<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import Chart from 'primevue/chart';
import { useTimeFormatter } from '../composables/useTimeFormatter';
import IconButton from '../components/ui/IconButton.vue';
const { formatStudyTime } = useTimeFormatter();

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  record: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['edit', 'delete']);
const userStore = useUserStore();

const correctPercentage = computed(() =>
  userStore.getCorrectAnswerPercentage(props.record).toFixed(1)
);
const incorrectPercentage = computed(() =>
  userStore.getIncorrectAnswerPercentage(props.record).toFixed(1)
);

const hasQuestions = computed(() => props.record.questions_resolved > 0);

// Cores harmônicas do projeto
const colorAcertos = '#2563eb'; // Azul principal
const colorErros = '#fca5a5';   // Vermelho suave

// Doughnut: acertos e erros no mesmo raio
const doughnutData = computed(() => ({
  labels: ['Acertos', 'Erros'],
  datasets: [
    {
      data: [Number(correctPercentage.value), Number(incorrectPercentage.value)],
      backgroundColor: [colorAcertos, colorErros],
      borderWidth: 0,
      borderRadius: 30,
      hoverBackgroundColor: [colorAcertos, colorErros],
      cutout: '80%',
      circumference: 360,
      rotation: -90,
    },
  ],
}));

// Valor central dinâmico do gráfico
const centerValue = ref({
  percent: correctPercentage.value,
  label: 'Acertos',
  color: 'text-baseBlue',
});

function handleChartHover(event, elements) {
  if (!elements || !elements.length) {
    centerValue.value = {
      percent: correctPercentage.value,
      label: 'Acertos',
      color: 'text-baseBlue',
    };
    return;
  }
  const index = elements[0].index;
  if (index === 0) {
    centerValue.value = {
      percent: correctPercentage.value,
      label: 'Acertos',
      color: 'text-baseBlue',
    };
  } else if (index === 1) {
    centerValue.value = {
      percent: incorrectPercentage.value,
      label: 'Erros',
      color: 'text-terRed',
    };
  }
}

const doughnutOptions = {
  cutout: '60%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  responsive: true,
  maintainAspectRatio: false,
  onHover: handleChartHover,
};
</script>

<template>
  <!-- Skeleton -->
  <div v-if="isLoading" class="border bg-white border-secondary shadow-sm rounded-2xl p-6 animate-pulse flex items-center gap-4 min-h-[180px]">
    <div class="flex-1 space-y-6 py-2">
      <div class="h-2 bg-secondary rounded"></div>
      <div class="h-2 bg-secondary rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-secondary rounded col-span-2"></div>
          <div class="h-2 bg-secondary rounded col-span-2"></div>
          <div class="h-2 bg-secondary rounded col-span-1"></div>
          <div class="h-2 bg-secondary rounded col-span-1"></div>
          <div class="h-2 bg-secondary rounded col-span-1"></div>
          <div class="h-2 bg-secondary rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-secondary rounded"></div>
      </div>
    </div>
    <div class="rounded-full bg-secondary h-[80px] w-[80px]"></div>
  </div>
  <!-- Card de Estudo -->
  <div v-else class="bg-white rounded-2xl shadow-md border border-secondary p-4 w-full max-w-2xl mx-auto  sm:flex-row gap-6 items-stretch overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col">
      <!-- Matéria + Botões -->
      <div class="flex justify-between items-center">
        <span class="text-baseBlue font-bold text-md sm:text-lg leading-tight">{{ record.subjectName }}</span>
        <div class="flex  gap-1">
         <IconButton size="xs" icon="fa-regular fa-pen-to-square" color="primary" aria-label="Editar registro" 
            tooltip="Editar registro" @click="$emit('edit', props.record)" 
         />
         <IconButton size="xs" icon="fa-solid fa-trash" color="danger" aria-label="Deletar registro"
           tooltip="Deletar registro" @click="$emit('delete', props.record)" 
         />
      </div>
    </div>
      <span class="text-xs bg-zinc-100 text-zinc-600 rounded px-2 py-0.5 font-medium w-fit">{{ record.topic }}</span>
    </div>
    <div class="flex *:flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 w-full">
      <!-- Lado Esquerdo: Infos -->
      <div class="flex-1 flex flex-col gap-3 w-full justify-between">
        <!-- Tempo de estudo -->
        <div class="text-zinc-700 text-base font-semibold flex items-center gap-2 mt-2">
          <i class="fa-regular fa-clock text-baseBlue"></i>
          <span>{{ formatStudyTime(record.study_time) }}</span>
        </div>
        <!-- Linha de questões -->
        <div v-if="hasQuestions" class="flex flex-col gap-y-0.5 text-sm text-zinc-700 mt-1">
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-list-check text-baseBlue"></i>
            <span class="font-medium">Questões:</span> {{ record.questions_resolved }}
          </div>
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-circle-check text-baseGreen"></i>
              <span class="font-medium">Acertos:</span> {{ record.correct_answers }}
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-circle-xmark text-terRed"></i>
              <span class="font-medium">Erros:</span> {{ record.incorrect_answers }}
            </span>
          </div>
        </div>
      </div>
      <!-- Lado Direito: Botões e Gráfico ou Placeholder -->
      <div class="flex flex-col items-end w-full sm:w-auto">
        <!-- Se tiver questões mostrar grafico -->
        <div v-if="hasQuestions" class="relative flex flex-col items-center justify-center bg-white rounded-full shadow-lg"   style="width:100px; height:100px;">
          <Chart :type="'doughnut'" :data="doughnutData" :options="doughnutOptions" style="width:100px; height:100px;" />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span :class="centerValue.color + ' font-bold text-lg sm:text-xl leading-none'">{{ centerValue.percent }}%</span>
            <span class="text-xs sm:text-sm text-gray-500">{{ centerValue.label }}</span>
          </div>
        </div>
        <!-- Senão mostra imagem de sem questões -->
        <div v-else class="flex flex-col items-center justify-center bg-white rounded-full shadow-lg" style="width:100px; height:100px;">
          <i class="fa-solid fa-book-open text-baseBlue text-3xl mb-2"></i>
          <span class="text-xs text-gray-500 text-center">Sem questões respondidas</span>
        </div>
      </div>
    </div>
  </div>
</template>
