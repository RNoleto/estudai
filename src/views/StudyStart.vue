<script setup>
import { onMounted, ref, computed, watch } from 'vue';

import StudyCard from '../layouts/StudyCard.vue';
import StudySummaryModal from '../layouts/StudySummaryModal.vue';

import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import ComboBox from '../components/ui/ComboBox.vue';
import AlertModal from '../components/ui/AlertModal.vue';
import Button from '../components/ui/Button.vue';

import EditModal from '../components/EditModal.vue';
import ManualStudyEntryModal from '../components/ManualStudyEntryModal.vue';
import Card from '../components/Card.vue';

import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";
import { useTimeFormatter } from '../composables/useTimeFormatter';
import { useHead } from '@vueuse/head';


function openFocus() { isFocus.value = true; }

const { formatStudyTime } = useTimeFormatter();
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
const isManualEntryModalVisible = ref(false);

// Ref para controlar o modal de sucesso (após a deleção)
const showSuccessModal = ref(false);


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
}

const handleSaveSuccess = () =>{
  selectedSubject.value = null;
  studyStore.topic = "";   
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
    // Recarrega a lista de registros após a exclusão
    await userStore.fetchUserStudyRecords();

    // Exibe o modal de sucesso
    showSuccessModal.value = true;
    // Opcional: fecha automaticamente o modal de sucesso após 2 segundos
    setTimeout(() => {
      showSuccessModal.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erro ao deletar o registro:", error.message);
  } finally {
    // Fecha o modal de confirmação e reseta o registro selecionado
    showConfirmModal.value = false;
    recordToDelete.value = null;
  }
}

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

useHead({
  title: "Estuday | Estudar - Registre Seu Tempo e Acompanhe Seu Progresso",
  meta: [
    { name: "description", content: "Otimize seus estudos com nosso temporizador! Registre o tempo de estudo, matérias, tópicos e questões resolvidas. Acompanhe seu desempenho e organize seu aprendizado de forma eficiente com o Estuday!" },
    { property: "og:title", content: "Estuday | Estudar - Registre Seu Tempo e Acompanhe Seu Progresso" },
    { property: "og:description", content: "Otimize seus estudos com nosso temporizador! Registre o tempo de estudo, matérias, tópicos e questões resolvidas. Acompanhe seu desempenho e organize seu aprendizado de forma eficiente com o Estuday!" },
    { property: "og:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { property: "og:url", content: "https://estuday.com.br/estudar" },
    { name: "twitter:title", content: "Estuday | Estudar - Registre Seu Tempo e Acompanhe Seu Progresso" },
    { name: "twitter:description", content: "Otimize seus estudos com nosso temporizador! Registre o tempo de estudo, matérias, tópicos e questões resolvidas. Acompanhe seu desempenho e organize seu aprendizado de forma eficiente com o Estuday!" },
    { name: "twitter:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { name: "keywords", content: "estudar, temporizador, registro de tempo, desempenho, aprendizado, métricas, Estuday" }
  ]
});
</script>

<template>
  <div class="min-h-screen bg-">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pt-20 sm:pt-6">
      <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Iniciar <span class="text-primary">estudos</span>
            </h1>
            <p class="mt-1 text-sm text-gray-600 sm:text-base">
              Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..." }}
            </p>
          </div>
        </div>
      </div>
    </div>

        <!-- Main Content -->
    <div class="mx-auto min-h-[750px] overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[600px] items-stretch">
        
        <!-- Left Column: Timer and Study Setup -->
        <div class="xl:col-span-1 flex flex-col space-y-4">
          
          <!-- Study Setup Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-gear text-primary"></i>
              Configuração do Estudo
            </h2>
            
            <div class="space-y-4">
              <!-- Subject Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Matéria
                </label>
                <ComboBox 
                  :options="userSubjects" 
                  :placeholder="'Selecione uma matéria...'" 
                  v-model="selectedSubject"
                  :key="selectedSubject ? selectedSubject.id : 'empty'" 
                  @select="handleSubjectSelection" 
                  class="w-full" 
                />
              </div>
              
              <!-- Topic Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tópico
                </label>
                <Input 
                  placeholder="Qual tópico você vai estudar?" 
                  :showLabel="false" 
                  class="w-full"
                  v-model="studyStore.topic" 
                />
              </div>
              
              <!-- Manual Entry Button -->
              <div>
                <Button 
                  :variant="isSubjectSelected ? 'base' : 'baseDisable'" 
                  :disabled="!isSubjectSelected" 
                  size="xs"
                  class="w-full" 
                  @click="openManualEntryModal"
                  :title="!isSubjectSelected ? 'Você precisa selecionar uma matéria' : ''"
                >
                  <i class="fa-solid fa-plus mr-2"></i>
                  Inserir Manualmente
                </Button>
              </div>
            </div>
          </div>

          <!-- Timer Card -->
          <div class="flex-1">
            <Timer 
              :isDisabled="!isSubjectSelected" 
              @timerStopped="handleTimerStopped" 
              @openFocus="openFocus"
              class="w-full h-full" 
            />
          </div>
        </div>

        <!-- Right Column: Statistics and Records -->
        <div class="xl:col-span-2 flex flex-col space-y-4">
          
          <!-- Today's Statistics -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-chart-line text-primary"></i>
              Estatísticas de Hoje
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card 
                v-if="totalTimeStudyToday" 
                title="Tempo de Estudo" 
                icon="fa-solid fa-stopwatch-20" 
                class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              >
                <template #content>
                  <p class="text-blue-700">{{ formatStudyTime(totalTimeStudyToday) }}</p>
                </template>
              </Card>
              
              <Card 
                v-if="questionResolved" 
                title="Questões Respondidas" 
                icon="fa-solid fa-pen-clip" 
                class="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              >
                <template #content>
                  <p class="text-green-700">{{ questionResolved }}</p>
                </template>
              </Card>
              
              <Card 
                v-if="totalCorrectAnswers" 
                title="Acertos" 
                icon="fa-solid fa-check" 
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
              >
                <template #content>
                  <p class="text-emerald-700">{{ totalCorrectAnswers }}</p>
                </template>
              </Card>
            </div>
          </div>

          <!-- Study Records -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-book-open text-primary"></i>
                Registros de Estudo
              </h2>
              
              <div class="text-sm text-gray-500">
                {{ todayStudyRecords.length }} registro{{ todayStudyRecords.length !== 1 ? 's' : '' }} hoje
              </div>
            </div>
            
            <!-- Records Grid -->
            <div v-if="todayStudyRecords.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
              <StudyCard 
                v-for="(record, index) in todayStudyRecords" 
                :key="record.id"
                :record="record" 
                :isLoading="isLoading" 
                :chartData="chartData[index]" 
                :chartOptions="chartOptions[index]"
                @edit="openModal" 
                @delete="openDeleteModal(record)" 
                class="w-full"
              />
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12 flex-1 flex flex-col justify-center">
              <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
                <i class="fa-solid fa-book-open text-6xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum registro hoje</h3>
              <p class="text-gray-500 mb-6">
                Inicie um timer ou adicione um registro manualmente para começar a acompanhar seus estudos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <StudySummaryModal 
      :isOpen="isOpen" 
      @onClose="handleCloseModal" 
      @onSaveSuccess="handleSaveSuccess"
    />
    
    <EditModal 
      v-if="isModalVisible" 
      :isVisible="isModalVisible" 
      :record="selectedRecord"
      @update="userStore.fetchUserStudyRecords" 
      @close="isModalVisible = false" 
    />
    
    <ManualStudyEntryModal 
      :isVisible="isManualEntryModalVisible" 
      :selectedSubject="selectedSubject"
      @close="isManualEntryModalVisible = false" 
      :onSave="handleSaveManualEntry" 
    />
    
    <!-- Alert Modals -->
    <AlertModal 
      :visible="showConfirmModal" 
      title="Deletar Registro"
      message="Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita."
      @confirm="handleDeleteRecord" 
      @close="showConfirmModal = false" 
      :showConfirm="true" 
      type="delete" 
    />

    <AlertModal 
      :visible="showSuccessModal" 
      title="Sucesso" 
      message="Registro deletado com sucesso!"
      @close="showSuccessModal = false" 
      :showButton="false" 
      :showConfirm="false" 
      type="success" 
    />
  </div>
</template>