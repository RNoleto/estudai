<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import History from '../layouts/History.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import StudySummaryModal from '../layouts/StudySummaryModal.vue';
import ComboBox from '../components/ui/ComboBox.vue';
import EditModal from '../components/EditModal.vue';
import AlertModal from '../components/AlertModal.vue';
import Button from '../components/ui/Button.vue';
import ManualStudyEntryModal from '../components/ManualStudyEntryModal.vue';
import Card from '../components/Card.vue';

import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";
import { useTimeFormatter } from '../composables/useTimeFormatter';

const { formatStudyTime } = useTimeFormatter();

import StudyCard from '../layouts/StudyCard.vue';


function openFocus() {
  isFocus.value = true;
}



const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);
const chartData = ref();
const chartOptions = ref(null);
const isOpen = ref(false);
const isFocus = ref(false);
const showTooltip = ref(false);

const isLoading = ref(true);
const showConfirmModal = ref(false);
const recordToDelete = ref(null);
const isManualEntryModalVisible = ref(false);


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
  isFocus.value = false;
  updateChartData();
};

const handleCloseModal = () => {
  isOpen.value = false;
  selectedSubject.value = null;
  studyStore.topic = ""; //Aqui está limpando
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
  // Data atual no fuso horário do navegador (local)
  const now = new Date();
  // Início de hoje (00:00:00) no horário local
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Início do dia seguinte (00:00:00), que será o limite superior (não incluso)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return userStore.userStudyRecords.filter((record) => {
    if (!record.created_at) return false;
    try {
      // Converte a string da API em objeto Date
      const recordDate = new Date(record.created_at);
      // Retorna true se o registro estiver entre o início e o final do dia
      return recordDate >= startOfToday && recordDate < endOfToday;
    } catch (error) {
      console.error("Erro ao processar a data do registro:", error);
      return false;
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

// const isFocusButtonDisabled = computed(() => !selectedSubject.value);

const openManualEntryModal = () => {
  isManualEntryModalVisible.value = true;
};

const handleSaveManualEntry = async (newRecord) => {
  try {
    await userStore.saveUserStudyRecord(newRecord);
    await userStore.fetchUserStudyRecords();
  } catch (error) {
    console.error("Erro ao salvar o registro de estudo:", error.message);
  }
};

// Função para atualizar o estilo de overflow com base nos estados dos modais
function updateBodyOverflow() {
  if (isFocus.value || isOpen.value || isModalVisible.value || showConfirmModal.value || isManualEntryModalVisible.value) {
    document.body.style.overflow = 'hidden'; // Desativa a rolagem
  } else {
    document.body.style.overflow = ''; // Restaura ao estado inicial
  }
}

// Watchers para os estados dos modais
watch([isFocus, isOpen, isModalVisible, showConfirmModal, isManualEntryModalVisible], updateBodyOverflow);


const totalTimeStudyToday = computed(() => {
  return todayStudyRecords.value.reduce((total, record) => {
    const isToday = new Date(record.created_at).toDateString() === new Date().toDateString();
    return isToday ? total + record.study_time : total;
  }, 0);
});

const questionResolved = computed(() => {
  return todayStudyRecords.value.reduce((total, record) => {
    const isToday = new Date(record.created_at).toDateString() === new Date().toDateString();
    return isToday ? total + record.questions_resolved : total;
  }, 0);
});

const totalCorrectAnswers = computed(() => {
  return todayStudyRecords.value.reduce((total, record) => {
    const isToday = new Date(record.created_at).toDateString() === new Date().toDateString();
    return isToday ? total + record.correct_answers : total;
  }, 0);
});
</script>

<template>
  <DefaultLayout backgroundOpacity="opacity-20">
    <div class="p-4 mt-12 gap-4 sm:mt-0">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold sm:text-4xl">Iniciar <span class="text-primary">estudos.</span></h3>
          <div class="flex justify-between">
            <p class="text-sm sm:text-base">Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..." }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <!-- Campo de pesquisa com lista suspensa de matérias -->
        <div class="flex flex-col gap-2 sm:flex-row col-span-6">
          <ComboBox 
            :options="userSubjects" 
            :placeholder="'Selecione uma matéria...'" 
            v-model="selectedSubject"
            :key="selectedSubject ? selectedSubject.id : 'empty'"
            @select="handleSubjectSelection" 
            class="w-full" 
          />
          <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="w-full"
            v-model="studyStore.topic" />
          <Button :variant="isSubjectSelected ? 'primary' : 'secondary'" :disabled="!isSubjectSelected" size="sm" class="min-w-max" @mouseover="showTooltip = !selectedSubject" @mouseleave="showTooltip = false" @click="openManualEntryModal">Inserir Manualmente</Button>
          <!-- <div v-if="showTooltip && !selectedSubject" class="tooltip">
            Selecione uma matéria para ativar o botão
          </div> -->
        </div>
        <div class="grid sm:items-start grid-cols-3 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-6">
          <Timer :isDisabled="!isSubjectSelected" @timerStopped="handleTimerStopped" @openFocus="openFocus" class="col-span-3 sm:col-span-3"/>
          <Card v-if="totalTimeStudyToday" title="Hoje você estudou" icon="fa-solid fa-stopwatch-20" footer="Soma do tempo de estudo de hoje" class="col-span-1">
            <template #content>
              <p>{{ formatStudyTime(totalTimeStudyToday) }}</p>
            </template>
          </Card>
          <Card v-if="questionResolved" title="Você respondeu" icon="fa-solid fa-pen-clip" footer="Soma de questões respondidas hoje" class="col-span-1">
            <template #content>
              <p>{{ questionResolved }}</p>
            </template>
          </Card>
          <Card v-if="totalCorrectAnswers" title="Você acertou" icon="fa-solid fa-check" footer="Total de questões corretas hoje" class="col-span-1">
            <template #content>
              <p>{{ totalCorrectAnswers }}</p>
            </template>
          </Card>
          <StudySummaryModal :isOpen="isOpen" @onClose="handleCloseModal" />
        </div>
        <!-- Exibe os registros de estudo -->
        <div class="grid grid-cols-1 gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <StudyCard class="sm:col-span-1" v-for="(record, index) in todayStudyRecords" :key="record.id" :record="record"
            :isLoading="isLoading" :chartData="chartData[index]" :chartOptions="chartOptions[index]" @edit="openModal"
            @delete="openDeleteModal(record)" />
          <EditModal v-if="isModalVisible" :isVisible="isModalVisible" :record="selectedRecord" @update="userStore.fetchUserStudyRecords"
            @close="isModalVisible = false" />
        </div>
      </div>
    </div>
    <AlertModal :visible="showConfirmModal" title="Deletar Registro"
      message="Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita."
      @confirm="handleDeleteRecord" @cancel="showConfirmModal = false" />
    <ManualStudyEntryModal :isVisible="isManualEntryModalVisible" :selectedSubject="selectedSubject"
      @close="isManualEntryModalVisible = false" :onSave="handleSaveManualEntry" />
  </DefaultLayout>
</template>

<style scoped>
.tooltip {
  position: absolute;
  top: 202px;
  right: 25px;
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}
</style>