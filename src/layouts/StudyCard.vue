<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import Chart from 'primevue/chart';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

const props = defineProps({
  isLoading:{
    type: Boolean,
    default: false
  },
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

const emits = defineEmits(['edit', 'delete']);

const userStore = useUserStore();

// Calcula porcentagens
const correctPercentage = computed(() =>
  userStore.getCorrectAnswerPercentage(props.record).toFixed(1)
);

const incorrectPercentage = computed(() =>
  userStore.getIncorrectAnswerPercentage(props.record).toFixed(1)
);
// Variáveis de controle de visibilidade
const showCorrect = ref(true);
const showIncorrect = ref(false);
</script>

<template>
  <div v-if="isLoading" class="border border-zinc-300 shadow-sm rounded-md p-4 animate-pulse flex items-center gap-4 min-h-[250px]">
      <!-- Placeholder de loading -->
      <div class="flex-1 space-y-6 py-2">
        <div class="h-2 bg-slate-200 rounded"></div>
        <div class="h-2 bg-slate-200 rounded"></div>
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div class="rounded-full bg-slate-200 h-[100px] w-[100px]"></div>
    </div>
  <div v-else class="shadow-md flex flex-col gap-1 text-xs sm:text-sm text-zinc-700 border-b rounded-2xl bg-white p-4">
    <!-- Header do card -->
    <div class="flex justify-between">
      <div class=" flex flex-col justify-center gap-1">
        <p><span class="font-bold">Matéria:</span> {{ record.subjectName }}</p>
        <p><span class="font-bold">Tópico:</span> {{ record.topic }}</p>
      </div>
      <div>
        <button class="p-1 text-sm text-baseBlue" @click="$emit('edit', props.record)"><i class="fa-regular fa-pen-to-square"></i></button> <!-- Edit -->
        <button class="text-sm text-terRed p-1"  @click="$emit('delete', props.record)"><i class="fa-solid fa-trash"></i></button> <!-- Delete -->
      </div>
    </div>
    <!-- Conteudo do Card -->
    <div class=" flex justify-between gap-10">
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
        <Chart :type="'doughnut'" :data="chartData" :options="chartOptions" class="w-[4rem] sm:w-[5rem] lg:w-[10rem]" />
        <div class="absolute text-center bottom-1 sm:bottom-11 md:bottom-12 lg:bottom-6">
          <div v-bind:class="{ 'text-baseGreen': showCorrect, 'hidden': !showCorrect }">
            <strong class="text-xs lg:text-xl">{{ correctPercentage }}%</strong>
            <p class="text-sm sm:text-sm lg:text-base">Acertos</p>
          </div>
          <div v-if="incorrectPercentage > 0" v-bind:class="{ 'text-terRed': showIncorrect, 'hidden': !showIncorrect }">
            <strong class="text-xs sm:text-xl">{{ incorrectPercentage }}%</strong>
            <p class="text-sm sm:text-sm lg:text-base">Erros</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
