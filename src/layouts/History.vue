<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';

import Card from '../components/Card.vue';

import IsLoading from '../components/ui/IsLoading.vue';
import StudyReportModal from '../components/StudyReportModal.vue';
import Button from '../components/ui/Button.vue';

const studyModal = ref(null);

const openReport = () => {
  studyModal.value.openModal();
};

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const isLoading = ref(true);
const { formatStudyTime } = useTimeFormatter();

const startDate = ref(null); // Data inicial do filtro
const endDate = ref(null); // Data final do filtro

// Critério de ordenação: tempo de estudo ou porcentagem de acertos
const sortBy = ref('studyTime'); // Valor inicial: ordenar por tempo de estudo

// Para controlar qual lista de tópicos está aberta
const activeTopic = ref(null);

const toggleTopics = (index) => {
  activeTopic.value = activeTopic.value === index ? null : index;
};


onMounted(async () => {
  try {
    await Promise.all([
      userStore.fetchUserSubjects(),
      subjectStore.fetchSubjects(),
      userStore.fetchUserStudyRecords(),
    ]);
  } catch (error) {
    console.error("Erro ao carregar tempo de estudo:", error);
  } finally {
    isLoading.value = false;
  }
});

// Computada para filtrar os registros pelo período selecionado
const filteredRecords = computed(() => {
  return userStore.userStudyRecords.filter(record => {
    const recordDate = new Date(record.created_at);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    return (
      (!start || recordDate >= start) &&
      (!end || recordDate <= end)
    );
  });
});

// Computada para calcular o tempo total de estudo no período filtrado
const totalStudyTime = computed(() => {
  return filteredRecords.value.reduce((acc, record) => acc + record.study_time, 0);
});

// Computada para resumir os dados com base nos registros filtrados
const summarizedData = computed(() => {
  const summary = filteredRecords.value.reduce((acc, record) => {
    const { subject, study_time, total_pauses, questions_resolved, correct_answers, incorrect_answers } = record;
    const subjectName = subject?.name || 'Matéria não encontrada';

    if (!acc[subjectName]) {
      acc[subjectName] = {
        subjectName,
        topics: [],
        totalStudyTime: 0,
        totalPauses: 0,
        totalQuestionsResolved: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
      };
    }

    acc[subjectName].topics.push({
      topic: record.topic || 'Tópico não informado',
      studyTime: study_time,
      questionsResolved: questions_resolved,
      correctAnswers: correct_answers,
      incorrectAnswers: incorrect_answers,
      pauses: total_pauses,
    });

    acc[subjectName].totalStudyTime += study_time;
    acc[subjectName].totalPauses += total_pauses;
    acc[subjectName].totalQuestionsResolved += questions_resolved;
    acc[subjectName].totalCorrectAnswers += correct_answers;
    acc[subjectName].totalIncorrectAnswers += incorrect_answers;

    return acc;
  }, {});

  const sortedData = Object.values(summary).map(subject => {
    subject.accuracyPercentage = getAccuracyPercentage(
      subject.totalCorrectAnswers,
      subject.totalQuestionsResolved
    );

    subject.bgClass =
      subject.accuracyPercentage >= 70
        ? 'border border-primary bg-secondary'
        : subject.accuracyPercentage > 50
          ? 'border border-baseYellow bg-secYellow'
          : 'border border-baseRed bg-secRed';

    return subject;
  });

  // Ordenar com base no critério escolhido
  return sortedData.sort((a, b) => {
    if (sortBy.value === 'studyTime') {
      return b.totalStudyTime - a.totalStudyTime; // Ordenar por tempo de estudo
    } else if (sortBy.value === 'accuracy') {
      return b.accuracyPercentage - a.accuracyPercentage; // Ordenar por porcentagem de acertos
    }
    return 0;
  });
});

const getAccuracyPercentage = (correctAnswers, totalQuestions) => {
  if (totalQuestions === 0) return 0; // Evita divisão por zero
  return Math.round((correctAnswers / totalQuestions) * 100);
};

const getColorClass = (correctAnswers, totalQuestions) => {
  const percentage = getAccuracyPercentage(correctAnswers, totalQuestions);
  return percentage >= 70 ? 'border-green-200 bg-green-50' : percentage > 50 ? 'bg-yellow-50' : 'bg-red-50';
};

// Computada para o total de questões no período filtrado
const totalQuestions = computed(() => {
  return filteredRecords.value.reduce((acc, record) => acc + record.questions_resolved, 0);
});

// Computada para o total de acertos no período filtrado
const totalCorrectAnswers = computed(() => {
  return filteredRecords.value.reduce((acc, record) => acc + record.correct_answers, 0);
});

// Computada para calcular o total de questões e acertos no período filtrado
const totalQuestionsAndAccuracy = computed(() => {
  const totalQuestions = filteredRecords.value.reduce((sum, record) => sum + record.questions_resolved, 0);
  const totalCorrectAnswers = filteredRecords.value.reduce((sum, record) => sum + record.correct_answers, 0);

  const accuracyPercentage = totalQuestions === 0
    ? 0
    : Math.round((totalCorrectAnswers / totalQuestions) * 100);

  return {
    totalQuestions,
    totalCorrectAnswers,
    accuracyPercentage,
  };
});

const totalAccuracyBgClass = computed(() => {
  const { accuracyPercentage } = totalQuestionsAndAccuracy.value;
  return accuracyPercentage >= 70
    ? 'text-baseBlue border-baseBlue'
    : accuracyPercentage > 50
      ? 'text-baseYellow border-baseYellow'
      : 'text-baseRed border-baseRed';
});
</script>

<template>
  <!-- <IsLoading v-if="isLoading" /> -->
  <div>
    <!-- Filtro por data -->
    <div class="flex justify-between gap-1 sm:justify-start sm:items-end sm:gap-4">
      <div class="flex flex-col">
        <label for="start-date" class="ml-1">Data inicial</label>
        <input id="start-date" type="date" class="rounded-md p-1 text-zinc-500 shadow-sm" v-model="startDate" />
      </div>
      <div class="flex flex-col">
        <label for="end-date" class="ml-1">Data final</label>
        <input id="end-date" type="date" class="rounded-md p-1 text-zinc-500 shadow-sm" v-model="endDate" />
      </div>
      <!-- Seleção de critério de ordenação -->
      <div class="hidden sm:flex sm:flex-col">
        <label for="sort-by">Ordenar por</label>
        <select id="sort-by" v-model="sortBy" class="w-full p-1 rounded-md sm:w-auto">
          <option value="studyTime">Tempo de Estudo</option>
          <option value="accuracy">Porcentagem de Acertos</option>
        </select>
      </div>
      <!-- botão desktop -->
      <div class="hidden sm:block">
        <Button @click="openReport" variant="ia">Gerar Insight</Button>
        <StudyReportModal ref="studyModal" />
      </div>
    </div>
    <!-- Seleção de critério de ordenação -->
    <div class="flex flex-col gap-1 mt-1 sm:hidden">
      <label for="sort-by" class="ml-1">Ordenar por</label>
      <select id="sort-by" v-model="sortBy" class="w-full text-zinc-500 p-2 rounded-md shadow-sm sm:w-auto sm:ml-2">
        <option value="studyTime" class="text-base">Tempo de Estudo</option>
        <option value="accuracy" class="text-base">Porcentagem de Acertos</option>
      </select>
    </div>
    <!-- botão mobile -->
    <!-- <div class="mt-2 sm:hidden">
      <Button @click="openReport" variant="ia" class="w-full">Gerar Insight</Button>
      <StudyReportModal ref="studyModal" />
    </div> -->
    <!-- Tempo total de estudo no período -->
    <div class="grid grid-cols-2 mt-2 sm:flex gap-2">
      <Card title="Tempo total de estudo" icon="fa-solid fa-stopwatch-20" class="col-span-3">
        <template #content>
          {{ formatStudyTime(totalStudyTime) }}
        </template>
      </Card>
      <Card title="" icon="fa-solid fa-pen-clip" footer="Total de questões" class="items-center">
        <template #content>
          <p>{{ totalQuestions }}</p>
        </template>
      </Card>
      <Card title="" :icon="`fa-solid fa-check ${totalAccuracyBgClass}`" footer="Total de acertos" :class="`items-center ${totalAccuracyBgClass}`">
        <template #content>
          <p :class="`${totalAccuracyBgClass}`">{{ totalQuestionsAndAccuracy.totalCorrectAnswers }} - ({{
          totalQuestionsAndAccuracy.accuracyPercentage }}%)</p>
        </template>
      </Card>
    </div>

    <!-- Lista resumida -->
    <div class="mt-2">
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName"
        :class="`mb-2 text-zinc-800 overflow-hidden cursor-pointer`" @click="toggleTopics(index)">
        <!-- Header do card -->
        <div :class="`rounded-2xl grid grid-cols-4 gap-2 items-center shadow-sm p-2 ${subject.bgClass}`">
          <h3 class="col-span-1 text-md leading-4 font-semibold sm:text-2xl">{{ subject.subjectName }}</h3>
          <!-- Campo de total de tempo -->
          <div class="col-span-2">
            <div class="flex flex-col gap-1 text-center items-center">
              <div class="sm:hidden">
                <i class="fa-solid fa-stopwatch"></i>
                <p class="text-md font-semibold sm:text-xl">{{ formatStudyTime(subject.totalStudyTime) }}</p>
              </div>
              <div class="hidden sm:flex sm:items-center gap-2">
                <i class="fa-solid fa-stopwatch"></i>
                <p class="text-md font-semibold sm:text-xl">{{ formatStudyTime(subject.totalStudyTime) }}</p>
              </div>
              <p class="text-sm leading-3 sm:text-md">Tempo de estudo</p>
            </div>
          </div>
          <!-- Campo de total de acertos -->
          <div class="col-span-1 flex flex-col gap-1 text-center">
            <div class="sm:hidden">
              <i class="fa-solid fa-pen-clip"></i>
              <p class="text-md font-semibold sm:text-4xl">{{ subject.totalQuestionsResolved }} - {{
                subject.accuracyPercentage }}%</p>
            </div>
            <div class="hidden sm:flex sm:items-center sm:gap-2 sm:justify-center">
              <i class="fa-solid fa-pen-clip"></i>
              <p class="text-md font-semibold sm:text-2xl">{{ subject.totalQuestionsResolved }} - {{
                subject.accuracyPercentage }}%</p>
            </div>
            <p class="text-sm leading-3 sm:text-md">Total de Questões</p>
          </div>
          <div>
          </div>
        </div>
        <!-- Campos de topicos estudados -->
        <div>
          <transition name="fade">
            <ul v-if="activeTopic === index" role="list" class="divide-y divide-zinc-200">
              <li v-for="(topic, idx) in subject.topics" :key="idx"
                class="flex flex-col gap-1 p-2 sm:items-center sm:flex-row sm:justify-between sm:w-[98%] sm:m-auto" :class="[
                  idx === 0 ? 'shadow-inner' : '',
                  getColorClass(topic.correctAnswers, topic.questionsResolved)
                ]">
                <p class="text-sm font-semibold sm:text-base">{{ topic.topic ? topic.topic : 'Tópico não informado' }}
                </p>
                <div class="flex justify-between items-center text-xs sm:hidden">
                  <div class="text-center leading-3">
                    <p class="font-semibold">{{ formatStudyTime(topic.studyTime) }}</p>
                    <p>de estudo</p>
                  </div>
                  <div class="text-center leading-3">
                    <p class="font-semibold">{{ topic.correctAnswers }}</p>
                    <p>acertos</p>
                  </div>
                  <div class="text-center leading-3">
                    <p class="font-semibold">{{ topic.incorrectAnswers }}</p>
                    <p>erros</p>
                  </div>
                  <div class="text-center leading-3">
                    <p class="font-semibold">{{ topic.questionsResolved }}</p>
                    <p>questões</p>
                  </div>
                  <p class="text-2xl">{{ getAccuracyPercentage(topic.correctAnswers, topic.questionsResolved) }}%</p>
                </div>
                <!-- Desktop -->
                <div class="hidden gap-4 sm:flex sm:justify-between sm:items-center">
                  <p>{{ formatStudyTime(topic.studyTime) }} de estudo</p>
                  <p>{{ topic.correctAnswers }} acertos</p>
                  <p>{{ topic.incorrectAnswers }} erros</p>
                  <p>{{ topic.questionsResolved }} questões</p>
                  <p class="text-xl">{{ getAccuracyPercentage(topic.correctAnswers, topic.questionsResolved) }}%</p>
                </div>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-inner-top {
  box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.1);
  /* Ajuste a sombra interna do topo */
}

/* Sombra apenas no primeiro item */
.shadow-inner {
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.1);
  /* Ajuste a sombra interna no item */
}

.container {
  overflow: visible;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>