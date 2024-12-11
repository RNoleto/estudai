<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import Chart from 'primevue/chart';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['edit']);

const userStore = useUserStore();

// Calcula porcentagens
const correctPercentage = computed(() =>
  userStore.getCorrectAnswerPercentage(props.record).toFixed(1)
);

const incorrectPercentage = computed(() =>
  userStore.getIncorrectAnswerPercentage(props.record).toFixed(1)
);
</script>

<template>
  <div class="shadow-sm flex flex-col gap-1 text-xs text-zinc-700 border-b rounded-md bg-white p-4">
    <div class="flex gap-2 justify-end">
      <button class="p-1 text-sm text-blue-400" @click="$emit('edit', props.record)"><i class="fa-regular fa-pen-to-square"></i></button>
      <button class="text-sm text-red-400 p-1"><i class="fa-solid fa-trash"></i></button>
    </div>
    <!-- Header do card -->
    <div class="flex flex-col justify-center gap-1">
      <p><span class="font-bold">Matéria:</span> {{ record.subjectName }}</p>
      <p><span class="font-bold">Tópico:</span> {{ record.topic }}</p>
    </div>
    <!-- Conteudo do Card -->
    <div class="flex justify-between gap-10">
      <div class="flex flex-col justify-center gap-1">
        <p><span class="font-bold">Tempo de estudo:</span> {{ formatStudyTime(record.study_time) }}</p>
        <p v-if="record.total_pauses > 0">
          <span class="font-bold">Nº de pauses:</span> {{ record.total_pauses }}
        </p>
        <div v-if="record.questions_resolved > 0" class="flex flex-col gap-1">
          <p><span class="font-bold">Questões respondidas:</span> {{ record.questions_resolved }}</p>
          <p><span class="font-bold">Acertos:</span> {{ record.correct_answers }}</p>
          <p><span class="font-bold">Erros:</span> {{ record.incorrect_answers }}</p>
        </div>
      </div>
      <!-- Gráfico -->
      <div v-if="record.questions_resolved > 0" class="relative flex justify-center">
        <Chart :type="'doughnut'" :data="chartData" :options="chartOptions" class="w-[10rem]" />
        <div class="absolute bottom-5 text-center">
          <div class="text-[#00B884]">
            <strong class="text-xl">{{ correctPercentage }}%</strong>
            <p class="text-sm">Acertos</p>
          </div>
          <div v-if="incorrectPercentage > 0" class="text-[#FF5675] hidden">
            <strong class="text-xl">{{ incorrectPercentage }}%</strong>
            <p class="text-sm">Erros</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
