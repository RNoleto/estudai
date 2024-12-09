<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import StudySummaryModal from '../layouts/StudySummaryModal.vue';
import ComboBox from '../components/ui/ComboBox.vue';
import Chart from 'primevue/chart';

import { useCurrentDate } from "../composables/useCurrentDate";
import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";

import { useTimeFormatter } from '../composables/useTimeFormatter';

const { formattedDate } = useCurrentDate();
const { formatStudyTime } = useTimeFormatter();

const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);
const chartData = ref();
const chartOptions = ref(null);
const isOpen = ref(false);

const isLoading = ref(true);

// Carregar as matérias da API
onMounted(async () => {
  try {
    await Promise.all([
      userStore.fetchUserSubjects(),
      subjectStore.fetchSubjects(),
      userStore.fetchUserStudyRecords(),
    ]);
    isLoading.value = false;
  } catch (error) {
    console.error("Error loading data: ", error);
  }
});

// Trecho responsavel pelo StudySummaryModal
const handleTimerStopped = () => {
  isOpen.value = true;
  updateChartData();
};

const handleCloseModal = () => {
  isOpen.value = false;
}

// Gera os dados do gráfico para cada registro
const getChartData = (record) => {
  const correctPercentage = userStore.getCorrectAnswerPercentage(record);
  const incorrectPercentage = userStore.getIncorrectAnswerPercentage(record);

  return {
    labels: ["Acertos", "Erros"],
    datasets: [
      {
        data: [correctPercentage, incorrectPercentage],
        backgroundColor: ["#00C49F", "#FF6384"],
        hoverBackgroundColor: ["#00B884", "#FF5675"],
      },
    ],
  };
};
// Gera as opções do gráfico para cada registro
const getChartOptions = (record) => {
  const correctPercentage = userStore.getCorrectAnswerPercentage(record);

  return {
    plugins: {
      legend: {
        display: false, // Oculta a legenda
      },
      tooltip: {
        enabled: false, // Desabilita o tooltip padrão
      },
      centerText: {
        text: `${correctPercentage.toFixed(1)}%`, // Texto inicial com a porcentagem de acertos
      },
    },
    rotation: -90,
    circumference: 180,
    cutout: "60%", // Espaço interno
  };
};

const updateChartData = () => {
  try {
    if (!userStore.userStudyRecords || userStore.userStudyRecords.length === 0) return;

    chartData.value = userStore.userStudyRecords.map(record => getChartData(record));
    chartOptions.value = userStore.userStudyRecords.map(record => getChartOptions(record));
  } catch (error) {
    console.error("Error updating chart data: ", error);
  }
};

// Atualizar dados sempre que necessário
watch(
  [() => userStore.userStudyRecords, () => subjectStore.subjects],
  ([newStudyRecords, newSubjects]) => {
    if (newStudyRecords && newSubjects) {
      updateChartData();
    }
  },
  { immediate: true }
);

// Combine userSubjects com nomes de matérias
const userSubjects = computed(() => {
  return userStore.userSubjects
    .map((subjectId) =>
      subjectStore.subjects.find((subject) => subject.id === subjectId)
    )
    .filter(Boolean); // Filtra valores nulos ou indefinidos
});
// Define a matéria selecionada na store
const handleSubjectSelection = (subject) => {
  selectedSubject.value = subject;
  studyStore.setSubject(subject.id); // Apenas atualiza o ID na store
};

const isSubjectSelected = computed(() => !!selectedSubject.value);

</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-4xl font-bold">Iniciar estudos</h3>
      <p>{{ formattedDate }}</p>
    </div>
    <!-- Campo de pesquisa com lista suspensa de matérias -->
    <div class="grid grid-cols-3 gap-2 content-center relative">
      <div class="w-full content-center relative">
        <ComboBox :options="userSubjects" :placeholder="'Selecione uma matéria...'" v-model="selectedSubject"
          @select="handleSubjectSelection" />
      </div>
      <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="col-span-2"
        v-model="studyStore.topic" />
    </div>
    <!-- Resumo dos estudos -->
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">

        <div class="col-span-1 md:col-span-2 xl:col-span-1">
          <Timer :isDisabled="!isSubjectSelected" @timerStopped="handleTimerStopped" />
        </div>
        <StudySummaryModal :isOpen="isOpen" @onClose="handleCloseModal" />

        <!-- Cards com informações de estudos registrados pelo usuário -->
        <div class="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-2">
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <!-- Exibe animação enquanto carrega -->
            <div v-if="isLoading" v-for="n in 6" :key="'skeleton-' + n"
              class="border border-blue-300 shadow-sm rounded-md p-4 animate-pulse h-[172px] content-center">
              <div class="flex space-x-4">
                <div class="flex-1 space-y-6">
                  <div class="h-2 bg-slate-200 rounded w-5/12"></div>
                  <div class="h-2 bg-slate-200 rounded w-7/12"></div>
                  <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                      <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                      <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                      <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-slate-200 rounded"></div>
                    <div class="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div class="rounded-full bg-slate-200 h-[120px] w-[120px]"></div>
              </div>
            </div>
            <!-- Dados Reais -->
            <div v-else
              class="shadow-sm flex flex-col gap-1 text-xs text-zinc-700 col-span-1 border-b rounded-md bg-white p-4 overflow-hidden"
              v-if="userStore.userStudyRecords.length > 0" v-for="(record, index) in userStore.userStudyRecords"
              :key="record.id">
              <div class="flex flex-col justify-center gap-1">
                <p><span class="font-bold">Matéria:</span> {{ record.subjectName }}</p>
                <p><span class="font-bold">Tópico:</span> {{ record.topic }}</p>
              </div>
              <div class="flex justify-between">
                <div class="flex">
                  <div class="flex flex-col justify-center gap-1">
                    <p><span class="font-bold">Tempo de estudo:</span> {{ formatStudyTime(record.study_time) }}</p>
                    <p v-if="record.totalPauses > 0">
                      <span class="font-bold">Nº de pauses:</span> {{ record.total_pauses }}
                    </p>
                    <div v-if="record.questions_resolved > 0" class="flex flex-col gap-1">
                      <p><span class="font-bold">Questões respondidas:</span> {{ record.questions_resolved }}</p>
                      <p><span class="font-bold">Acertos:</span> {{ record.correct_answers }}</p>
                      <p><span class="font-bold">Erros: </span> {{ record.incorrect_answers }}</p>
                    </div>
                  </div>
                </div>
                <!-- Gráfico -->
                <div v-if="record.questions_resolved > 0" class="relative flex justify-center">
                  <Chart v-if="chartData.length > 0" :key="record.id" :type="'doughnut'" :data="chartData[index]"
                    :options="chartOptions[index]" class="md:w-[10rem] mt-[-60px]" />
                  <div class="absolute bottom-5">
                    <div class="text-[#00B884] flex flex-col text-center" id="acertos">
                      <strong class="text-xl">{{ userStore.getCorrectAnswerPercentage(record).toFixed(1) }}%</strong>
                      <p class="text-sm">Acertos</p>
                    </div>
                    <div v-if="userStore.getIncorrectAnswerPercentage(record) > 0"
                      class="text-[#FF5675] flex flex-col text-center hidden" id="erros">
                      <strong class="text-xl">{{ userStore.getIncorrectAnswerPercentage(record).toFixed(1)
                        }}%</strong>
                      <p class="text-sm">Erros</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
