<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import IsLoading from '../components/ui/IsLoading.vue';
import Tooltip from '../components/Tooltip.vue';

import { useTimeFormatter } from '../composables/useTimeFormatter';

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const isLoading = ref(true);
const showTooltip = ref(false); // Controla a visibilidade do tooltip
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
        ? 'border border-green-200 bg-green-100'
        : subject.accuracyPercentage > 50
          ? 'border border-yellow-200 bg-yellow-100'
          : 'border border-red-200 bg-red-100';

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
    ? 'border-green-200 bg-green-100'
    : accuracyPercentage > 50
      ? 'border-yellow-200 bg-yellow-100'
      : 'border-red-200 bg-red-100';
});

const handleMouseEnter = () => {
  showTooltip.value = true;
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};

const handleClick = () => {
  showTooltip.value = false; // Oculta o tooltip ao clicar
};
</script>

<template>
  <IsLoading v-if="isLoading" />
  <div v-else>
    <!-- Filtro por data -->
    <div class="filters flex flex-col gap-1 sm:flex-row sm:gap-4">
      <div class="grid grid-cols-2 sm:flex flex-row items-center gap-2">
        <label for="start-date">Data inicial:</label>
        <input id="start-date" type="date" v-model="startDate" />
      </div>
      
      <div class="grid grid-cols-2 sm:flex flex-row items-center gap-2">
        <label for="end-date">Data final:</label>
        <input id="end-date" type="date" v-model="endDate" />
      </div>

      <!-- Seleção de critério de ordenação -->
      <div class="">
        <label for="sort-by">Ordenar por:</label>
        <select id="sort-by" v-model="sortBy" class="w-full sm:w-auto sm:ml-2">
          <option value="studyTime">Tempo de Estudo</option>
          <option value="accuracy">Porcentagem de Acertos</option>
        </select>
      </div>


    </div>
    <!-- Tempo total de estudo no período -->
    <div class="grid mt-2 sm:flex gap-2">
      <div class="text-sm border bg-white text-center rounded-md p-4 shadow-sm">
        <p>Tempo total de estudo no período</p>
        <p class="text-xl">{{ formatStudyTime(totalStudyTime) }}</p>
      </div>
      <div class="text-sm border bg-white text-center rounded-md p-4 shadow-sm">
        <p>Total de questões no período</p>
        <p class="text-xl">{{ totalQuestions }}</p>
      </div>
      <div :class="`text-sm border text-center rounded-md p-4  shadow-sm ${totalAccuracyBgClass}`">
        <p>Total de acertos no período</p>
        <p class="text-xl">{{ totalQuestionsAndAccuracy.totalCorrectAnswers }} - ({{
          totalQuestionsAndAccuracy.accuracyPercentage }}%)</p>
      </div>
    </div>

    <!-- Lista resumida -->
    <div class="mt-2">
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName"
        :class="`mb-2 border rounded-md text-zinc-800 overflow-hidden cursor-pointer`" @click="toggleTopics(index)">
        <!-- Header do card -->
        <Tooltip text="Clique para mostrar os tópicos estudado">
        <div :class="`rounded-md grid grid-cols-3 gap-2 items-center shadow-sm p-2 ${subject.bgClass}`">
            <h3 class="text-xl font-semibold">{{ subject.subjectName }}</h3>
          <div class="text-center">
            <p class="text-xl"><i class="fa-solid fa-stopwatch"></i> Tempo Total de Estudo</p>
            <p class="text-4xl">{{ formatStudyTime(subject.totalStudyTime) }}</p>
          </div>
          <div class="text-sm">
            <div class="flex flex-col items-end">
              <p class="text-xl">Total de Questões</p>
              <p class="text-4xl font-semibold">{{ subject.totalQuestionsResolved }}</p>
              <p>{{ subject.accuracyPercentage }}%</p>
            </div>
            <div>
            </div>
          </div>
        </div>
      </Tooltip>
        <!-- Campos de topicos estudados -->
        <div>
          <transition name="fade">
            <ul v-if="activeTopic === index" role="list" class="divide-y divide-zinc-200">
              <li v-for="(topic, idx) in subject.topics" :key="idx" class="flex justify-between gap-x-6 py-1"
                :class="[
                  idx === 0 ? 'shadow-inner' : '',  
                  getColorClass(topic.correctAnswers, topic.questionsResolved)
                ]">
                <div class="grid grid-cols-4 w-full justify-between items-center px-4">
                  <div class="col-span-2">
                    <p class="text-md font-semibold">{{ topic.topic ? topic.topic : 'Tópico não informado' }}</p>
                  </div>
                  <div class="text-sm col-span-1">
                    <p>Tempo de Estudo: {{ formatStudyTime(topic.studyTime) }}</p>
                  </div>
                  <div class="text-sm col-span-1 hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p>Questões Resolvidas: {{ topic.questionsResolved }}</p>
                    <p>Respostas Corretas: {{ topic.correctAnswers }}</p>
                    <p>Respostas Incorretas: {{ topic.incorrectAnswers }}</p>
                    <p>Porcentagem: {{ getAccuracyPercentage(topic.correctAnswers, topic.questionsResolved) }}%</p>
                  </div>
                  <!-- <p>Quantidade de Pausas: {{ topic.pauses }}</p> -->
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
  box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.1); /* Ajuste a sombra interna do topo */
}

/* Sombra apenas no primeiro item */
.shadow-inner {
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.1); /* Ajuste a sombra interna no item */
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