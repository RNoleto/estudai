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
    const { subject, topic, study_time, total_pauses, questions_resolved, correct_answers, incorrect_answers } = record;
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

    // Adiciona o tópico estudado
    acc[subjectName].topics.push({
      topic,
      studyTime: study_time,
      questionsResolved: questions_resolved,
      correctAnswers: correct_answers,
      incorrectAnswers: incorrect_answers,
      pauses: total_pauses,
    });

    // Atualiza os totais da matéria
    acc[subjectName].totalStudyTime += study_time;
    acc[subjectName].totalPauses += total_pauses;
    acc[subjectName].totalQuestionsResolved += questions_resolved;
    acc[subjectName].totalCorrectAnswers += correct_answers;
    acc[subjectName].totalIncorrectAnswers += incorrect_answers;

    return acc;
  }, {});

  return Object.values(summary).map(subject => {
    subject.topics.sort((a, b) => b.studyTime - a.studyTime);
    return subject;
  }).sort((a, b) => b.totalStudyTime - a.totalStudyTime);
});
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
    </div>

    <!-- Tempo total de estudo no período -->
    <div class="my-5">
      <strong>Tempo Total de Estudo no Período:</strong> {{ formatStudyTime(totalStudyTime) }}
    </div>

    <!-- Lista resumida -->
    <div>
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName" class="p-2 mb-5 border border-zinc-300 shadow-sm rounded-md text-zinc-800">
        <!-- Header do card -->
        <div class="flex justify-between gap-2 items-center bg-blue-100">
          <h3 class="text-xl"><strong>{{ subject.subjectName }}</strong></h3>
          <div class="text-center">
            <p class="text-xl"><i class="fa-solid fa-stopwatch"></i> Tempo Total de Estudo</p>
            <p class="text-4xl">{{ formatStudyTime(subject.totalStudyTime) }}</p>
          </div>
          <div class="text-sm">
            <div class="text-center">
              <p class="text-xl">Total de Questões</p>
              <p class="text-4xl font-semibold">{{ subject.totalQuestionsResolved }}</p>
            </div>
            <div>
              <!-- <p>Total de Pausas:  {{ subject.totalPauses }}</p>
              <p>Questões Resolvidas: {{ subject.totalQuestionsResolved }}</p>
              <p>Respostas Corretas: {{ subject.totalCorrectAnswers }}</p>
              <p>Respostas Incorretas: {{ subject.totalIncorrectAnswers }}</p> -->
            </div>
          </div>
        </div>

        <div class="mt-3 bg-green-100">
          <h4><strong>Tópicos Estudados <i class="fas fa-chevron-up text-sm"></i></strong></h4>
          <ul>
            <li v-for="(topic, idx) in subject.topics" :key="idx" class=" gap-2 ml-4">
              <strong class="text-md">{{ topic.topic }}</strong>
              <div class="text-sm flex gap-2 ml-4">
                <p>Tempo de Estudo: {{ formatStudyTime(topic.studyTime) }}</p>
                <p>Questões Resolvidas: {{ topic.questionsResolved }}</p>
                <p>Respostas Corretas: {{ topic.correctAnswers }}</p>
                <p>Respostas Incorretas: {{ topic.incorrectAnswers }}</p>
                <p>Quantidade de Pausas: {{ topic.pauses }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
