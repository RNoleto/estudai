<script setup>
import { computed, onMounted, watch, ref } from 'vue';

// import IsLoading from '../components/ui/IsLoading.vue';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';

const userStore = useUserStore();
const subjectStore = useSubjectStore();

// const isLoading = ref(true);

// Carregar as matérias da API
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
    // isLoading.value = false;
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

  return Object.values(summary);
});
</script>

<template>
  <!-- <IsLoading v-if="isLoading" /> -->
  <div class="hidden sm:block sm:w-full">  
    <table  class="bg-white shadow-md rounded-xl overflow-hidden sm:w-full">
      <thead class="bg-primary text-white sm:text-sm">
        <tr>
          <th class="px-4 py-2 text-left">Matéria</th>
          <th class="px-4 py-2 text-left">Tempo</th>
          <!-- <th class="px-4 py-2 text-left">Pausas</th> -->
          <!-- <th class="px-4 py-2 text-left">Questões Resolvidas</th> -->
           <th class="px-4 py-2 text-center"><i class="fa-solid fa-file-pen"></i></th>
          <th class="px-4 py-2 text-center"><i class="fa-solid fa-circle-check"></i></th>
          <th class="px-4 py-2 text-center"><i class="fa-solid fa-circle-xmark"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(subject, index) in summarizedData" :key="subject.subjectName"
          :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'" class="text-sm border-b last:border-b-0 hover:bg-gray-200">
          <td class="px-4 py-2 text-gray-700 border">{{ subject.subjectName }}</td>
          <td class="px-4 py-2 text-gray-700 border text-center">{{ formatStudyTime(subject.totalStudyTime) }}</td>
          <!-- <td class="px-4 py-2 text-gray-700 border text-center">{{ subject.totalPauses }}</td> -->
          <td class="px-4 py-2 text-gray-700 border text-center">{{ subject.totalQuestionsResolved }}</td>
          <td class="px-4 py-2 text-green-700 font-semibold border text-center">{{ subject.totalCorrectAnswers }}</td>
          <td class="px-4 py-2 text-red-700 border font-semibold text-center">{{ subject.totalIncorrectAnswers }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="w-full shadow-md rounded-2xl sm:hidden">
    <div class="bg-primary text-zinc-100 px-1 py-1.5 rounded-t-2xl">
      <p class="text-base ml-2">Matérias estudadas</p>
    </div>
    <ul class="flex flex-col">
      <li v-for="(subject, index) in summarizedData" :key="subject.subjectName" :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'">
        <div class="flex justify-between items-center p-1 text-gray-700">
          <div class="leading-normal">
            <p>{{ subject.subjectName }}</p>
            <p class="text-xs">{{ formatStudyTime(subject.totalStudyTime) }}</p>
          </div>
          <div class="text-xs flex flex-col justify-end gap-1">
            <p>{{ subject.totalQuestionsResolved }} questões</p>
            <p>{{ subject.totalCorrectAnswers }} corretas</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="bg-primary py-2 rounded-b-2xl">
    </div>
  </div>
</template>
