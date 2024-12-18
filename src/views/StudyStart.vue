<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import StudySummaryModal from '../layouts/StudySummaryModal.vue';
import ComboBox from '../components/ui/ComboBox.vue';
import EditModal from '../components/EditModal.vue';
import AlertModal from '../components/AlertModal.vue';

import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";

import { useCurrentDate } from '../composables/useCurrentDate';

const { formattedDate } = useCurrentDate();

import StudyCard from '../layouts/StudyCard.vue';
import FocusTimer from '../components/FocusTimer.vue';

function openFocus(){
  isFocus.value = true;
}

function closeFocus() {
  isFocus.value = false;
}

const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);
const chartData = ref();
const chartOptions = ref(null);
const isOpen = ref(false);
const isFocus = ref(false);

const isLoading = ref(true);
const showConfirmModal = ref(false);
const recordToDelete = ref(null);

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

// Trecho responsável pelo StudySummaryModal
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
  const incorrectPercentage = userStore.getIncorrectAnswerPercentage(record);

  return {
    plugins: {
      legend: {
        display: false, // Oculta a legenda
      },
      tooltip: {    
        enabled: true, // Habilita o tooltip
        callbacks: {
          // Personaliza o conteúdo do tooltip
          label: (tooltipItem) => {
            // Verifica a posição do mouse e exibe o valor correto
            if (tooltipItem.dataIndex === 0) {
              return `Acertos: ${tooltipItem.raw.toFixed(1)}%`;
            } else if (tooltipItem.dataIndex === 1) {
              return `Erros: ${tooltipItem.raw.toFixed(1)}%`;
            }
          },
        },        
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

const todayStudyRecords = computed(() => {
  const today = new Date().toISOString().slice(0, 10); // Data de hoje no formato ISO (AAAA-MM-DD)

  return userStore.userStudyRecords.filter((record) => {
    if (!record.created_at) return false; // Ignora registros sem data
    try {
      // Ajuste para o formato vindo do banco de dados
      const recordDate = new Date(record.created_at.split('.')[0]);
      return recordDate.toISOString().slice(0, 10) === today;
    } catch (error) {
      console.error("Erro ao processar a data do registro:", error);
      return false; // Ignora registros com erro
    }
  });
});

const updateChartData = () => {
  try {
    if (!todayStudyRecords.value || todayStudyRecords.value.length === 0) return;

    chartData.value = todayStudyRecords.value.map(record => getChartData(record));
    chartOptions.value = todayStudyRecords.value.map(record => getChartOptions(record));
  } catch (error) {
    console.error("Error updating chart data: ", error);
  }
};

// Atualizar dados sempre que necessário
watch(
  todayStudyRecords,
  () => {
    updateChartData();
  },
  { immediate: true }
);

// Watch para desabilitar a rolagem ao abrir o FocusTimer
watch(isFocus, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
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
  studyStore.setSubject(subject.id); // Apenas atualiza o ID na store
};

const isSubjectSelected = computed(() => !!selectedSubject.value);

const isModalVisible = ref(false);
const selectedRecord = ref(null);

const openModal = (record) => {
  selectedRecord.value = { ...record };
  isModalVisible.value = true;
};

const updateRecord = (updatedRecord) => {
  isModalVisible.value = false;
};


// Função para abrir o modal de confirmação
function openDeleteModal(record) {
  recordToDelete.value = record;
  showConfirmModal.value = true;
}

// Função para deletar o registro
async function handleDeleteRecord() {
  if (!recordToDelete.value || !recordToDelete.value.id) return;

  try {
    await userStore.deleteUserStudyRecord(recordToDelete.value.id);
    // Recarrega a lista de registros após deletar
    await userStore.fetchUserStudyRecords();
  } catch (error) {
    console.error("Erro ao deletar o registro:", error.message);
  } finally {
    showConfirmModal.value = false; // Fecha o modal
    recordToDelete.value = null; // Reseta o registro selecionado
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-4xl">Iniciar Estudos</h3>
    <div class="flex justify-between">
      <p>Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..."  }}</p>
      <p>{{ formattedDate }}</p>
    </div>
    <div class="grid gap-2 grid-cols-6">
      <!-- Campo de pesquisa com lista suspensa de matérias -->
      <div class="flex gap-2 col-span-6">
        <ComboBox :options="userSubjects" :placeholder="'Selecione uma matéria...'" v-model="selectedSubject"
          @select="handleSubjectSelection" class="w-full" />
        <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="w-full"
          v-model="studyStore.topic" />
      </div>
      <div class="gap-2 xl:col-span-2 lg:col-span-2 md:col-span-5 sm:col-span-5">
        <Timer :isDisabled="!isSubjectSelected" @timerStopped="handleTimerStopped" @click="openFocus" class="w-full" />
        <StudySummaryModal :isOpen="isOpen" @onClose="handleCloseModal" />
      </div>
      <div class="xl:col-span-4">
        <!-- Exibe os registros de estudo -->
        <div  class="grid gap-2 xl:grid-cols-2">
          <StudyCard v-for="(record, index) in todayStudyRecords" :key="record.id" :record="record" :isLoading="isLoading"
            :chartData="chartData[index]" :chartOptions="chartOptions[index]" @edit="openModal" @delete="openDeleteModal(record)" />
          <EditModal v-if="isModalVisible" :isVisible="isModalVisible" :record="selectedRecord" @update="updateRecord"
            @close="isModalVisible = false" />
        </div>
      </div>
    </div>
  </div>
  <AlertModal 
      :visible="showConfirmModal" 
      title="Deletar Registro"
      message="Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita."
      @confirm="handleDeleteRecord" 
      @cancel="showConfirmModal = false"
    />
    <div v-if="isFocus">
      <FocusTimer @close="closeFocus"/>
  </div>
</template>