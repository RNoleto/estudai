<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import Navbar from '../components/Navbar.vue';
import ComboBox from '../components/ui/ComboBox.vue';
import Chart from 'primevue/chart';

import { useCurrentDate } from "../composables/useCurrentDate";
import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";

const { formattedDate } = useCurrentDate();
const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);
const chartData = ref();
const chartOptions = ref(null);
const percentageData = ref({ acertos: 0, erros: 0 });
const chartInstance = ref(null);

// Atualizar dados do gráfico
const updateChartData = () => {
  const correctPercentage =
    studyStore.studySummary?.totalQuestions > 0
      ? (studyStore.studySummary.correctAnswers / studyStore.studySummary.totalQuestions) * 100
      : 0;
  const incorrectPercentage = 100 - correctPercentage;

  chartData.value = {
    labels: ["Acertos", "Erros"],
    datasets: [
      {
        data: [correctPercentage, incorrectPercentage],
        backgroundColor: ["#00C49F", "#FF6384"],
        hoverBackgroundColor: ["#00B884", "#FF5675"],
      },
    ],
  };

  chartOptions.value = {
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
// Atualizar dados sempre que necessário
watch(
  () => studyStore.studySummary,
  () => {
    if (studyStore.studySummary.totalQuestions > 0) updateChartData();
  },
  { deep: true }
);


// Carregar as matérias da API
onMounted(async () => {
  await userStore.fetchUserSubjects();
  await subjectStore.fetchSubjects();
  if (studyStore.studySummary.totalQuestions > 0) updateChartData();
});

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
  studyStore.setSubject(subject.name); // Atualiza a store com o nome
};

const isSubjectSelected = computed(() => !!selectedSubject.value);

const resetFields = () => {
  selectedSubject.value = null;
  studyStore.setSubject('');
  studyStore.setTopic(''); // Adicione uma ação ou getter para o tópico, se necessário
};

// Função para atualizar a porcentagem com base na posição do mouse
const handleMouseMove = (event) => {
  if (!chartInstance.value) return;

  const chart = chartInstance.value.chart;

  const activePoints = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
  if (activePoints.length) {
    const firstPoint = activePoints[0];
    const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
    const total = chart.data.datasets[firstPoint.datasetIndex].data.reduce((acc, val) => acc + val, 0);
    // const percentage = (value / total) * 100;

    // Atualiza a porcentagem de acertos e erros dependendo de qual parte do gráfico o mouse está
    if (firstPoint.index === 0) {
      const acertos = document.getElementById('acertos');
      acertos.classList.remove('hidden');

      const erros = document.getElementById('erros');
      erros.classList.add('hidden');
    } else {
      const erros = document.getElementById('erros');
      erros.classList.remove('hidden');

      const acertos = document.getElementById('acertos');
      acertos.classList.add('hidden');
    }
  }
};

// Função para resetar ao sair do mouse (voltar para a porcentagem inicial)
const handleMouseOut = () => {
  const acertos = document.getElementById('acertos');
  acertos.classList.remove('hidden');

  const erros = document.getElementById('erros');
  erros.classList.add('hidden');
};
</script>

<template>
  <div class="h-screen">
    <Navbar />
    <div class="p-4 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-4xl">Iniciar estudos</h3>
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
        <div class="grid grid-cols-3 gap-2">
          <Timer :isDisabled="!isSubjectSelected" class="col-span-1" />
          <div class="flex flex-col gap-1 text-xs text-zinc-700 col-span-2"
            v-if="studyStore.studySummary.totalStudyTime.length > 0">
            <div class="grid grid-cols-5 border-b rounded-md p-4 bg-white">
              <div class="flex flex-col col-span-3 justify-center">
                <p class="text-sm">Matéria: <span class="font-bold">{{ studyStore.subject }}</span></p>
                <p class="text-sm">Tópico: <span class="font-bold">{{ studyStore.topic }}</span></p>
              </div>
              <div class="flex justify-between col-span-2">
                <div class="content-center">
                  <p>Tempo de estudo: {{ studyStore.studySummary.totalStudyTime }}</p>
                  <p v-if="studyStore.studySummary.totalPauses > 0">
                    Nº de pauses: {{ studyStore.studySummary.totalPauses }}
                  </p>
                  <div v-if="studyStore.studySummary.questionsResolved === 'yes'" class="flex gap-4">
                    <p>Questões respondidas: {{ studyStore.studySummary.totalQuestions }}</p>
                    <p>Acertos: {{ studyStore.studySummary.correctAnswers }}</p>
                  </div>
                </div>
                <div v-if="studyStore.studySummary && studyStore.studySummary.totalQuestions > 0"
                  class="relative flex justify-center">
                  <!-- Gráfico -->
                  <Chart :type="'doughnut'" :data="chartData" :options="chartOptions" class="md:w-[10rem]"
                    @mousemove="handleMouseMove" @mouseout="handleMouseOut" ref="chartInstance" />
                  <!-- Texto centralizado -->
                  <div class="absolute bottom-5">
                    <div id="acertos" class="text-[#00B884] flex flex-col text-center">
                      <strong class="text-xl">{{ studyStore.correctAnswerPercentage.toFixed(1) }}%</strong>
                      <p class="text-sm">Acertos</p>
                    </div>
                    <div class="hidden text-[#FF5675] flex flex-col text-center" id="erros">
                      <strong class="text-xl">{{ studyStore.incorrectAnswerPercentage.toFixed(1) }}%</strong>
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
