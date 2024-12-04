<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import StudySummaryModal from '../layouts/StudySummaryModal.vue';
import Navbar from '../components/Navbar.vue';
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
const chartInstance = ref(null);
const isOpen = ref(false);

// Trecho responsavel pelo StudySummaryModal
const handleTimerStopped = () => {
  isOpen.value = true;
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
// Atualizar dados sempre que necessário
watch(
  () => userStore.userStudyRecords,
  () => {
    if (userStore.userStudyRecords.length > 0) updateChartData();
  },
  { deep: true }
);


// Carregar as matérias da API
onMounted(async () => {
  await userStore.fetchUserSubjects();
  await subjectStore.fetchSubjects();
  await userStore.getCorrectAnswerPercentage;
  await userStore.getIncorrectAnswerPercentage;
  if (userStore.questionsResolved > 0) updateChartData();
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
  studyStore.setSubject(subject.id); // Atualiza a store com o ID
};

const isSubjectSelected = computed(() => !!selectedSubject.value);

const resetFields = () => {
  selectedSubject.value = null;
  studyStore.setSubject('');
  studyStore.setTopic(''); // Adicione uma ação ou getter para o tópico, se necessário
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
          <div class="col-span-1">
            <Timer :isDisabled="!isSubjectSelected" @timerStopped="handleTimerStopped" />
          </div>
          <StudySummaryModal :isOpen="isOpen" @onClose="handleCloseModal" />

          <!-- Cards com informações de estudos registrados pelo usuário -->
          <div class="col-span-2">
            <div class="grid grid-cols-3 gap-2">
              <div
                class="flex flex-col gap-1 text-xs text-zinc-700 col-span-1 border-b rounded-md bg-white p-4 overflow-hidden"
                v-if="userStore.userStudyRecords.length > 0" v-for="record in userStore.userStudyRecords"
                :key="record.id">
                <div class="flex flex-col justify-center gap-1">
                  <p><span class="font-bold">Matéria:</span> {{ record.subjectName }}</p>
                  <p><span class="font-bold">Tópico:</span> {{ record.topic }}</p>
                </div>
                <div class="flex justify-between">
                  <div class="flex">
                    <div class="flex flex-col justify-center gap-1">
                      <p><span class="font-bold">Tempo de estudo:</span> {{ formatStudyTime(record.studyTime) }}</p>
                      <p v-if="record.totalPauses > 0">
                        <span class="font-bold">Nº de pauses:</span> {{ record.totalPauses }}
                      </p>
                      <div v-if="record.questionsResolved > 0" class="flex flex-col gap-1">
                        <p><span class="font-bold">Questões respondidas:</span> {{ record.questionsResolved }}</p>
                        <p><span class="font-bold">Acertos:</span> {{ record.correctAnswers }}</p>
                        <p><span class="font-bold">Erros: </span> {{ record.incorrectAnswers }}</p>
                      </div>
                    </div>
                  </div>
                  <!-- Gráfico -->
                  <div v-if="record.questionsResolved > 0" class="relative flex justify-center">
                    <Chart :type="'doughnut'" :data="getChartData(record)" :options="getChartOptions(record)"
                      class="md:w-[10rem] mt-[-60px]" ref="chartInstance" />
                    <div class="absolute bottom-5">
                      <div class="text-[#00B884] flex flex-col text-center" id="acertos">
                        <strong class="text-xl">{{ userStore.getCorrectAnswerPercentage(record).toFixed(1) }}%</strong>
                        <p class="text-sm">Acertos</p>
                      </div>
                      <div class="text-[#FF5675] flex flex-col text-center hidden" id="erros">
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
  </div>
</template>
