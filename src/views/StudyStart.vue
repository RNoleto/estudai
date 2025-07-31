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
import { useScheduleStore } from '../stores/useScheduleStore';
import { useHead } from '@vueuse/head';


function openFocus() { isFocus.value = true; }

const { formatStudyTime } = useTimeFormatter();
const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();
const scheduleStore = useScheduleStore();

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
      scheduleStore.loadWeekPlan(),
      scheduleStore.loadWeeklyProgress(),
    ]);

    scheduleStore.syncProgressWithStudyRecords();

    isLoading.value = false;
  } catch (error) {
    console.error("Error loading data: ", error);
  }
});

function getTodayDateString() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset * 60 * 1000));
  return adjustedToday.toISOString().split('T')[0];
}

const todaysSubjects = computed(() => {
    // Gatilho de reatividade (já está correto)
    const today = getTodayDateString();
    const progressToday = scheduleStore.dailyProgress[today];

    const todayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
                                .replace(/^\w/, c => c.toUpperCase());

    const dayPlan = scheduleStore.weeklyPlan.find(d => d.day === todayName);

    if (!dayPlan || !dayPlan.subjects) {
        return [];
    }

    // [CORREÇÃO APLICADA AQUI]
    // A função map agora passa o 'todayName' para isCompleted
    return dayPlan.subjects.map(subject => ({
        ...subject,
        completed: scheduleStore.isCompleted(subject.id, todayName) 
    }));
});

// [NOVO] Função para selecionar uma matéria sugerida
function selectSuggestedSubject(subject) {
  // Encontra o objeto completo da matéria na lista de matérias do usuário
  const fullSubjectObject = userSubjects.value.find(s => s.name === subject.name);
  if (fullSubjectObject) {
    handleSubjectSelection(fullSubjectObject);
  }
}

// Trecho responsável pelo StudySummaryModal
const handleTimerStopped = () => {
  isOpen.value = true;
  isFocus.value = false;
  updateChartData();
};

const handleCloseModal = () => {
  isOpen.value = false;
}

const handleSaveSuccess = async () => {
  selectedSubject.value = null;
  studyStore.topic = "";
  
  await userStore.fetchUserStudyRecords(); 
  await scheduleStore.syncProgressWithStudyRecords();
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

const todayStudyRecords = computed(() => userStore.todayStudyRecords);

const todayProgress = computed(() => {
  // Pega a lista de matérias de hoje que já criamos
  const subjects = todaysSubjects.value;

  // Total de matérias planejadas para hoje
  const totalCount = subjects.length;

  // Se não há matérias, o progresso é zero
  if (totalCount === 0) {
    return { percentage: 0, completedCount: 0, totalCount: 0 };
  }

  // Conta quantas matérias na lista têm a propriedade 'completed' como true
  const completedCount = subjects.filter(subject => subject.completed).length;

  // Calcula a porcentagem e arredonda para um número inteiro
  const percentage = Math.round((completedCount / totalCount) * 100);

  return { percentage, completedCount, totalCount };
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
  studyStore.setSubject(subject.id);
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
    // 1. Deleta o registro no banco de dados
    await userStore.deleteUserStudyRecord(recordToDelete.value.id);

    // 2. Busca a NOVA lista de registros (agora menor)
    await userStore.fetchUserStudyRecords();

    // 3. AGORA chama a sincronização, que usará a lista atualizada
    await scheduleStore.syncProgressWithStudyRecords();

    showSuccessModal.value = true;
    setTimeout(() => {
      showSuccessModal.value = false;
    }, 2000);

  } catch (error) {
    console.error("Erro ao deletar o registro:", error.message);
  } finally {
    showConfirmModal.value = false;
    recordToDelete.value = null;
  }
}

const openManualEntryModal = () => {
  isManualEntryModalVisible.value = true;
};

const handleSaveManualEntry = async (newRecord) => {
  try {
    // 1. Salva o novo registro no banco de dados
    await userStore.saveUserStudyRecord(newRecord);

    // 2. [PASSO CRUCIAL] Busca a lista de registros novamente para incluir o novo item
    await userStore.fetchUserStudyRecords();

    // 3. AGORA chama a sincronização, que usará a lista completa e atualizada
    await scheduleStore.syncProgressWithStudyRecords();

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
        <div class="xl:col-span-1 flex flex-col space-y-4 h-fit">

          <!-- Matérias configurada no cronograma -->
          <div v-if="todaysSubjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <i class="fa-solid fa-calendar-day text-primary"></i>
              Para estudar hoje
            </h2>

            <div class="mb-4">
              <div class="flex justify-between items-center mb-1 text-sm">
                <span class="font-bold text-primary">{{ todayProgress.percentage }}% Concluído</span>
                <span class="text-gray-500">{{ todayProgress.completedCount }} de {{ todayProgress.totalCount }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div class="bg-primary h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: todayProgress.percentage + '%' }"></div>
              </div>
            </div>

            <div class="space-y-2">
              <div v-for="subject in todaysSubjects" :key="subject.id">
                <button @click="selectSuggestedSubject(subject)"
                  class="w-full flex items-center p-3 rounded-md text-left transition-all duration-200" :class="subject.completed
                    ? 'bg-green-50 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-primary-light'" :disabled="subject.completed">
                  <div class="w-5 h-5 flex items-center justify-center rounded-full mr-3"
                    :class="subject.completed ? 'bg-green-500' : 'bg-gray-300'">
                    <i v-if="subject.completed" class="fa-solid fa-check text-white text-xs"></i>
                  </div>
                  <span class="font-medium text-gray-800" :class="{ 'line-through': subject.completed }">
                    {{ subject.name }}
                  </span>
                </button>
              </div>
            </div>
          </div>

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
                <ComboBox :options="userSubjects" :placeholder="'Selecione uma matéria...'" v-model="selectedSubject"
                  :key="selectedSubject ? selectedSubject.id : 'empty'" @select="handleSubjectSelection" class="w-full" />
              </div>

              <!-- Topic Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tópico
                </label>
                <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="w-full"
                  v-model="studyStore.topic" />
              </div>

              <!-- Manual Entry Button -->
              <div>
                <Button :variant="isSubjectSelected ? 'base' : 'baseDisable'" :disabled="!isSubjectSelected" size="xs"
                  class="w-full" @click="openManualEntryModal"
                  :title="!isSubjectSelected ? 'Você precisa selecionar uma matéria' : ''">
                  <i class="fa-solid fa-plus mr-2"></i>
                  Inserir Manualmente
                </Button>
              </div>
            </div>
          </div>

          <!-- Timer Card -->
          <div class="h-fit">
            <Timer :isDisabled="!isSubjectSelected" @timerStopped="handleTimerStopped" @openFocus="openFocus"
              class="w-full" />
          </div>
        </div>

        <!-- Right Column: Statistics and Records -->
        <div class="xl:col-span-2 flex flex-col space-y-4 h-fit">

          <!-- Today's Statistics -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-chart-line text-primary"></i>
              Estatísticas de Hoje
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card v-if="totalTimeStudyToday" title="Tempo de Estudo" icon="fa-solid fa-stopwatch-20"
                class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <template #content>
                  <p class="text-blue-700">{{ formatStudyTime(totalTimeStudyToday) }}</p>
                </template>
              </Card>
              <Card v-if="questionResolved" title="Total de Questões" icon="fa-solid fa-pen-clip"
                class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <template #content>
                  <p class="text-green-700">{{ questionResolved }}</p>
                </template>
              </Card>

              <Card v-if="totalCorrectAnswers" title="Acertos" icon="fa-solid fa-check"
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <template #content>
                  <p class="text-emerald-700">{{ totalCorrectAnswers }}</p>
                </template>
              </Card>
            </div>
          </div>

          <!-- Study Records -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            <div v-if="todayStudyRecords.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StudyCard v-for="(record, index) in todayStudyRecords" :key="record.id" :record="record"
                :isLoading="isLoading" :chartData="chartData[index]" :chartOptions="chartOptions[index]" @edit="openModal"
                @delete="openDeleteModal(record)" class="w-full" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
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
    <StudySummaryModal :isOpen="isOpen" @onClose="handleCloseModal" @onSaveSuccess="handleSaveSuccess" />

    <EditModal v-if="isModalVisible" :isVisible="isModalVisible" :record="selectedRecord"
      @update="userStore.fetchUserStudyRecords" @close="isModalVisible = false" />

    <ManualStudyEntryModal :isVisible="isManualEntryModalVisible" :selectedSubject="selectedSubject"
      @close="isManualEntryModalVisible = false" :onSave="handleSaveManualEntry" />

    <!-- Alert Modals -->
    <AlertModal :visible="showConfirmModal" title="Deletar Registro"
      message="Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita."
      @confirm="handleDeleteRecord" @close="showConfirmModal = false" :showConfirm="true" type="delete" />

    <AlertModal :visible="showSuccessModal" title="Sucesso" message="Registro deletado com sucesso!"
      @close="showSuccessModal = false" :showButton="false" :showConfirm="false" type="success" />
  </div>
</template>

<style scoped>
.hover\:bg-primary-light:hover {
  background-color: #E0E7FF;
  /* Ex: light-indigo-100 */
}
</style>