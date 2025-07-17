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
          : 'border border-baseRed bg-secRed text-white';

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

// Computada para o total de questões no período filtrado
const totalQuestions = computed(() => {
  return filteredRecords.value.reduce((acc, record) => acc + record.questions_resolved, 0);
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

import { useHead } from '@vueuse/head';

useHead({
    title: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA",
    meta:[
    { name: 'description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { property: 'og:title', content: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA" },
    { property: 'og:description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { property: 'og:image', content: "https://estuday.com.br/img/metaImg.webp" },
    { property: 'og:url', content: "https://estuday.com.br/area-do-aluno/historico-de-estudos" },
    { name: 'twitter:title', content: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA" },
    { name: 'twitter:description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { name: 'twitter:image', content: "https://estuday.com.br/img/metaImg.webp" },
    { name: 'keywords', content: "concursos públicos, gestão do tempo de estudo, organização de estudos, preparação para concurso, questões de concurso, acompanhamento de desempenho, planejamento de estudos" }
    ]
})
</script>

<template>
  <div>
    <!-- Filtros e ações agrupados em um card -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <div class="flex flex-col w-full sm:w-auto">
          <label for="start-date" class="ml-1 font-semibold text-zinc-700">Data inicial</label>
          <div class="relative">
            <i class="fa-regular fa-calendar absolute left-2 top-2 text-zinc-400"></i>
            <input id="start-date" type="date" class="rounded-md p-2 pl-8 text-zinc-700 shadow-sm border border-zinc-200 w-full" v-model="startDate" />
          </div>
        </div>
        <div class="flex flex-col w-full sm:w-auto">
          <label for="end-date" class="ml-1 font-semibold text-zinc-700">Data final</label>
          <div class="relative">
            <i class="fa-regular fa-calendar-check absolute left-2 top-2 text-zinc-400"></i>
            <input id="end-date" type="date" class="rounded-md p-2 pl-8 text-zinc-700 shadow-sm border border-zinc-200 w-full" v-model="endDate" />
          </div>
        </div>
        <div class="flex flex-col w-full sm:w-auto">
          <label for="sort-by" class="ml-1 font-semibold text-zinc-700">Ordenar por</label>
          <select id="sort-by" v-model="sortBy" class="w-full p-2 rounded-md border border-zinc-200 text-zinc-700 shadow-sm">
            <option value="studyTime">Tempo de Estudo</option>
            <option value="accuracy">Porcentagem de Acertos</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end w-full sm:w-auto">
        <Button 
          @click="openReport" 
          :variant="summarizedData.length <= 0 ? 'baseDisable' : 'base'"
          size="md"
          :disabled="summarizedData.length <= 0"
          :title="summarizedData.length <= 0 ? 'Você precisa criar registro de estudo antes!' : ''"
          class="w-full sm:w-auto"
        >
          <i class="fa-solid fa-lightbulb mr-2"></i> Gerar Insight
        </Button>
        <StudyReportModal ref="studyModal" />
      </div>
    </div>

    <!-- Cards de resumo -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <Card title="Tempo total de estudo" icon="fa-solid fa-stopwatch-20" class="col-span-1">
        <template #content>
            <span class="flex-1 text-end text-2xl font-bold text-primary">{{ formatStudyTime(totalStudyTime) }}</span>
        </template>
      </Card>
      <Card title="Total de questões" icon="fa-solid fa-pen-clip" class="col-span-1">
        <template #content>
          <span class="flex-1 text-end text-2xl font-bold text-blue-700">{{ totalQuestions }}</span>
        </template>
      </Card>
      <Card title="Total de acertos" icon="fa-solid fa-check" class="col-span-1">
        <template #content>
          <span class="flex-1 text-end text-2xl font-bold text-green-700">{{ totalQuestionsAndAccuracy.totalCorrectAnswers }}</span>
          <span class="ml-2 text-sm font-semibold text-zinc-500">({{ totalQuestionsAndAccuracy.accuracyPercentage }}%)</span>
        </template>
      </Card>
    </div>

    <!-- Lista resumida de matérias -->
    <div class="space-y-4">
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName"
        :class="`rounded-2xl overflow-y-auto shadow-md border transition-all duration-200 ${subject.bgClass}`">
        <!-- Header do card de matéria -->
        <div class="flex items-center justify-between p-4 cursor-pointer select-none" @click="toggleTopics(index)">
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold">{{ subject.subjectName }}</span>
            <span v-if="subject.accuracyPercentage >= 70" class="ml-2 text-green-600" title="Ótimo desempenho"><i class="fa-solid fa-circle-check"></i></span>
            <span v-else-if="subject.accuracyPercentage > 50" class="ml-2 text-yellow-500" title="Desempenho razoável"><i class="fa-solid fa-circle-exclamation"></i></span>
            <span v-else class="ml-2 text-red-600" title="Precisa melhorar"><i class="fa-solid fa-circle-xmark"></i></span>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex flex-col items-center">
              <span :class="[
                'text-sm',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-500'
              ]">Tempo</span>
              <span :class="[
                'font-semibold',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-800'
              ]">{{ formatStudyTime(subject.totalStudyTime) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span :class="[
                'text-sm',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-500'
              ]">Questões</span>
              <span :class="[
                'font-semibold',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-800'
              ]">{{ subject.totalQuestionsResolved }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span :class="[
                'text-sm',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-500'
              ]">Acertos</span>
              <span :class="[
                'font-semibold',
                subject.accuracyPercentage < 51 ? 'text-white' : 'text-zinc-800'
              ]">{{ subject.accuracyPercentage }}%</span>
            </div>
            <span :class="['transition-transform', 'duration-200', 'ml-2', activeTopic === index ? 'rotate-90' : '']">
              <i class="fa-solid fa-chevron-right"></i>
            </span>
          </div>
        </div>
        <!-- Accordion de tópicos -->
        <transition name="fade">
          <ul v-if="activeTopic === index" role="list" :class="[
            'divide-y', 'bg-zinc-50', 'divide-zinc-200'
          ]">
            <li v-for="(topic, idx) in subject.topics" :key="idx"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3">
              <div class="flex-1">
                <span :class="[
                  'font-semibold','text-zinc-700'
                ]">{{ topic.topic ? topic.topic : 'Tópico não informado' }}</span>
              </div>
              <div class="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm justify-between sm:justify-end">
                <span :class="['flex items-center gap-1','text-zinc-700']"><i class="fa-solid fa-stopwatch"></i> {{ formatStudyTime(topic.studyTime) }}</span>
                <span :class="['flex items-center gap-1','text-green-700']"><i class="fa-solid fa-check"></i> {{ topic.correctAnswers }} acertos</span>
                <span :class="['flex items-center gap-1','text-red-700']"><i class="fa-solid fa-xmark"></i> {{ topic.incorrectAnswers }} erros</span>
                <span :class="['flex items-center gap-1','text-blue-700']"><i class="fa-solid fa-pen-clip"></i> {{ topic.questionsResolved }} questões</span>
                <span :class="['flex items-center gap-1','text-yellow-700']"><i class="fa-solid fa-percentage"></i> {{ getAccuracyPercentage(topic.correctAnswers, topic.questionsResolved) }}%</span>
              </div>
            </li>
          </ul>
        </transition>
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