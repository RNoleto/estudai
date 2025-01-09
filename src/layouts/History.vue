<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import IsLoading from '../components/ui/IsLoading.vue';

import { useTimeFormatter } from '../composables/useTimeFormatter';

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
        ? 'bg-green-100'
        : subject.accuracyPercentage > 50
          ? 'bg-yellow-100'
          : 'bg-red-100';

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
  return percentage >= 70 ? 'bg-green-50' : percentage > 50 ? 'bg-yellow-50' : 'bg-red-50';
};

</script>

<template>
  <IsLoading v-if="isLoading" />
  <div v-else>
    <!-- Filtro por data -->
    <div class="filters mb-5">
      <label for="start-date">Data inicial:</label>
      <input id="start-date" type="date" v-model="startDate" />

      <label for="end-date">Data final:</label>
      <input id="end-date" type="date" v-model="endDate" />

      <!-- Seleção de critério de ordenação -->
      <label for="sort-by" class="ml-4">Ordenar por:</label>
      <select id="sort-by" v-model="sortBy" class="ml-2">
        <option value="studyTime">Tempo de Estudo</option>
        <option value="accuracy">Porcentagem de Acertos</option>
      </select>
    </div>

    <!-- Tempo total de estudo no período -->
    <div class="my-5">
      <strong>Tempo Total de Estudo no Período:</strong> {{ formatStudyTime(totalStudyTime) }}
    </div>

    <!-- Lista resumida -->
    <div>
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName"
        :class="`mb-2 border border-zinc-300 shadow-sm rounded-md text-zinc-800 overflow-hidden ${subject.bgClass}`">
        <!-- Header do card -->
        <div class="flex justify-between gap-2 items-center p-2">
          <h3 class="text-xl"><strong>{{ subject.subjectName }}</strong></h3>
          <div class="text-center">
            <p class="text-xl"><i class="fa-solid fa-stopwatch"></i> Tempo Total de Estudo</p>
            <p class="text-4xl">{{ formatStudyTime(subject.totalStudyTime) }}</p>
          </div>
          <div class="text-sm">
            <div class="text-center">
              <p class="text-xl">Total de Questões</p>
              <p class="text-4xl font-semibold">{{ subject.totalQuestionsResolved }}</p>
              <p>{{ subject.accuracyPercentage }}%</p>
            </div>
            <div>
              <!-- <p>Total de Pausas:  {{ subject.totalPauses }}</p>
              <p>Questões Resolvidas: {{ subject.totalQuestionsResolved }}</p>
              <p>Respostas Corretas: {{ subject.totalCorrectAnswers }}</p>
              <p>Respostas Incorretas: {{ subject.totalIncorrectAnswers }}</p> -->
            </div>
          </div>
        </div>
        <!-- Campos de topicos estudados -->
        <div class="mt-2">
          <div class="shadow-md">
            <button class="ml-2 font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              @click="toggleTopics(index)">
              Tópicos Estudados
            </button>
          </div>
          <transition name="fade">
            <ul v-if="activeTopic === index" role="list" class="divide-y divide-zinc-200 mt-2">
              <li v-for="(topic, idx) in subject.topics" :key="idx" class="flex justify-between gap-x-6 py-1"
              :class="[idx % 2 === 0 ? 'bg-gray-100' : 'bg-white', getColorClass(topic.correctAnswers, topic.questionsResolved)]">
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>