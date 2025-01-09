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
    const { subjectName, study_time, total_pauses, questions_resolved, correct_answers, incorrect_answers } = record;

    if (!acc[subjectName]) {
      acc[subjectName] = {
        subjectName,
        totalStudyTime: 0,
        totalPauses: 0,
        totalQuestionsResolved: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
      };
    }

    acc[subjectName].totalStudyTime += study_time;
    acc[subjectName].totalPauses += total_pauses;
    acc[subjectName].totalQuestionsResolved += questions_resolved;
    acc[subjectName].totalCorrectAnswers += correct_answers;
    acc[subjectName].totalIncorrectAnswers += incorrect_answers;

    return acc;
  }, {});

  return Object.values(summary);
});
</script>

<template>
  <IsLoading v-if="isLoading" />
  <div v-else>
    <strong>Componente de Histórico de Estudos</strong>

    <!-- Filtro por data -->
    <div class="filters mb-5">
      <label for="start-date">Data inicial:</label>
      <input id="start-date" type="date" v-model="startDate" />

      <label for="end-date">Data final:</label>
      <input id="end-date" type="date" v-model="endDate" />
    </div>

    <!-- Tempo total de estudo no período -->
    <div class="total-study-time my-5">
      <strong>Tempo Total de Estudo no Período:</strong> {{ formatStudyTime(totalStudyTime) }}
    </div>

    <!-- Lista resumida -->
    <div class="mt-10">
      <div v-for="(subject, index) in summarizedData" :key="subject.subjectName" class="flex flex-wrap gap-2 mb-5">
        <p><strong>Matéria:</strong> {{ subject.subjectName }}</p>
        <p><strong>Tempo Total de Estudo:</strong> {{ formatStudyTime(subject.totalStudyTime) }}</p>
        <p><strong>Total de Pausas:</strong> {{ subject.totalPauses }}</p>
        <p><strong>Questões Resolvidas:</strong> {{ subject.totalQuestionsResolved }}</p>
        <p><strong>Respostas Corretas:</strong> {{ subject.totalCorrectAnswers }}</p>
        <p><strong>Respostas Incorretas:</strong> {{ subject.totalIncorrectAnswers }}</p>
      </div>
    </div>
  </div>
</template>
