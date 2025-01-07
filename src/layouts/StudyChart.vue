<script setup>
import { onMounted, ref, computed, watch } from 'vue';

import IsLoading from "../components/ui/IsLoading.vue"


import { useUserStore } from '../stores/useUserStore';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

const userStore = useUserStore();

const isLoading = ref(true);

onMounted(async () => {
    try {
        await Promise.all([
            userStore.fetchUserSubjects(),
            subjectStore.fetchSubjects(),
            userStore.fetchUserStudyRecords(), // Atualiza os registros com nomes das matérias
        ]);
    } catch (error) {
        console.error("Erro ao carregar tempo de estudo:", error);
    } finally {
        isLoading.value = false;
    }

    if (userStore.userSubjects?.length && subjectStore.subjects?.length) {
    summarizedData;
    }
});

// Atualizar dados sempre que necessário
watch(
  () => userStore.userStudyRecords,
  (newRecords, oldRecords) => {
    if (JSON.stringify(newRecords) !== JSON.stringify(oldRecords)) {
      summarizedData;
    }
  },
  { deep: true }
);
// Agrupa e soma os dados por 'subjectName'
const summarizedData = computed(() => {
  const summary = userStore.userStudyRecords.reduce((acc, record) => {
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

  // Retorna os valores ordenados pelo tempo total de estudo (maior para menor)
  return Object.values(summary).sort((a, b) => b.totalStudyTime - a.totalStudyTime).slice(0,3);
});
</script>

<template>
    <IsLoading v-if="isLoading" />  
    <div v-else class="border border-gray-200 p-4 rounded-lg w-max">
        <h1 class="text-xl">Top 3 por tempo de estudo</h1>
        <div v-for="(subject, index) in summarizedData" :key="subject.subjectName">
            <div>
                <p><strong>{{ subject.subjectName }}</strong></p>
                <div class="gap-2">
                    <p>Tempo de estudo: {{ formatStudyTime(subject.totalStudyTime) }}</p>
                    <p>{{ subject.totalQuestionsResolved }} Questões</p>
                    <p>{{ subject.totalCorrectAnswers }} Questões Corretas</p>
                    <p>{{ subject.totalIncorrectAnswers }} Questões Incorretas</p>
                </div>
            </div>
        </div>
    </div>
</template>