<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useBreakpoints } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import draggable from 'vuedraggable';

import AlertModal from '../components/ui/AlertModal.vue';

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const scheduleStore = useScheduleStore();

// Ref para controlar modal
const showSuccessModal = ref(false);
const showClearModal = ref(false);
const successMessage = ref('');

// --- STATE DO COMPONENTE ---
const isEditMode = ref(true); // Começa em modo de edição por padrão
const availableSubjects = ref([]);

const breakpoints = useBreakpoints({
  tablet: 768,
  desktop: 1024, // O breakpoint 'lg' do Tailwind
});

const isDesktop = breakpoints.greaterOrEqual('desktop');

const isSchedulePopulated = computed(() => {
  return scheduleStore.weeklyPlan.some(day => day.subjects.length > 0);
});

const subjectUsage = computed(() => {
  const usageMap = {};
  // Inicializa o mapa para todas as matérias disponíveis
  userStore.combinedSubjects.forEach(subject => {
    usageMap[subject.name] = [];
  });

  // Itera sobre o cronograma para preencher o mapa de uso
  scheduleStore.weeklyPlan.forEach(day => {
    // Pega a primeira letra do dia (ex: "Segunda-feira" -> "S")
    // E para Sábado, usamos 'Sa' para diferenciar de Segunda e Sexta.
    const dayInitial = day.day.startsWith('Sá') ? 'Sa' : day.day.charAt(0);

    day.subjects.forEach(subjectInstance => {
      // Adiciona a inicial do dia na lista daquela matéria, sem duplicar
      if (usageMap[subjectInstance.name] && !usageMap[subjectInstance.name].includes(dayInitial)) {
        usageMap[subjectInstance.name].push(dayInitial);
      }
    });
  });

  return usageMap;
});

const sortedAvailableSubjects = computed(() => {
  // Usamos .slice() para criar uma cópia antes de ordenar,
  // evitando modificar a lista original 'availableSubjects'.
  return availableSubjects.value.slice().sort((a, b) => {
    // localeCompare é a forma correta de comparar strings alfabeticamente,
    // lidando bem com acentos e caracteres especiais.
    return a.name.localeCompare(b.name);
  });
});

// --- WATCHER E LIFECYCLE HOOKS ---
watch(() => userStore.combinedSubjects, (newSubjects) => {
  if (newSubjects && newSubjects.length > 0) {
    availableSubjects.value = JSON.parse(JSON.stringify(newSubjects));
  }
}, { immediate: true, deep: true });

onMounted(async () => {
  await scheduleStore.loadWeekPlan();
  scheduleStore.loadWeeklyProgress();
  if (subjectStore.subjects.length === 0) {
    await subjectStore.fetchSubjects();
  }
  if (userStore.userSubjects.length === 0) {
    await userStore.fetchUserSubjects();
  }

  scheduleStore.syncProgressWithStudyRecords();

  const hasContent = scheduleStore.weeklyPlan.some(day => day.subjects.length > 0);
  if (hasContent) {
    isEditMode.value = false;
  } else {
    isEditMode.value = true;
  }
  // console.log(`Iniciando no modo ${isEditMode.value ? 'de Edição' : 'de Visualização'}`);
});

// --- MÉTODOS ---
function addSubjectToDay(dayName, subject) {
  if (!subject) return;

  const day = scheduleStore.weeklyPlan.find(d => d.day === dayName);
  if (day) {
    day.subjects.push({
      // Preserva o ID original da matéria (subject_id)
      subject_id: subject.id,
      // Gera um ID único para a instância
      id: Date.now(),
      name: subject.name,
    });
  }
}

function onAddSubject(event) {
  const dayName = event.to.dataset.day;
  const day = scheduleStore.weeklyPlan.find(d => d.day === dayName);
  const newItem = day.subjects[event.newIndex];

  if (day && newItem) {
    if (newItem.subject_id === undefined) { 
      // console.log("Item novo detectado. Gerando IDs...");
      newItem.subject_id = newItem.id;
      newItem.id = Date.now();
    }
  }
}

function removeSubjectFromDay(dayName, subjectId) {
  const day = scheduleStore.weeklyPlan.find(d => d.day === dayName);
  if (day) {
    day.subjects = day.subjects.filter(s => s.id !== subjectId);
  }
}

function handleSave() {
  scheduleStore.saveWeeklyPlan();
  isEditMode.value = false;

  successMessage.value = "Cronograma salvo com sucesso!";
  showSuccessModal.value = true;
  
  setTimeout(() => {
    showSuccessModal.value = false;
  }, 2000);
}

function clearSchedule() {
  showClearModal.value = true;
}

function handleConfirmClear() {
  showClearModal.value = false;

  scheduleStore.weeklyPlan.forEach(day => {
    day.subjects = [];
  });

  successMessage.value = "Cronograma limpo com sucesso!";
  showSuccessModal.value = true;
  setTimeout(() => {
    showSuccessModal.value = false;
  }, 2000);
}

// function clearSchedule() {
//   // usar modal de confirmação
//   if(window.confirm("Tem certeza que deseja limpar todo o cronograma? Esta ação não pode ser desfeita.")) {
//     scheduleStore.weeklyPlan.forEach(day => {
//       day.subjects = [];
//     });
//   }
// }

// Função para destacar o dia atual no modo de visualização
function isToday(dayName) {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  return dayName.toLowerCase() === today.toLowerCase();
}

useHead({
  title: "Estuday | Cronograma de Estudos - Planeje Sua Trilha de Aprendizado",
  meta: [
    {
      name: "description",
      content: "Monte seu cronograma de estudos com o Estuday! Organize suas matérias, defina metas e acompanhe seu progresso. Torne seu estudo mais eficiente com planejamento visual e estruturado."
    },
    { property: "og:title", content: "Estuday | Cronograma de Estudos - Planeje Sua Trilha de Aprendizado" },
    {
      property: "og:description",
      content: "Monte seu cronograma de estudos com o Estuday! Organize suas matérias, defina metas e acompanhe seu progresso. Torne seu estudo mais eficiente com planejamento visual e estruturado."
    },
    { property: "og:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { property: "og:url", content: "https://estuday.com.br/cronograma" },
    { name: "twitter:title", content: "Estuday | Cronograma de Estudos - Planeje Sua Trilha de Aprendizado" },
    {
      name: "twitter:description",
      content: "Monte seu cronograma de estudos com o Estuday! Organize suas matérias, defina metas e acompanhe seu progresso. Torne seu estudo mais eficiente com planejamento visual e estruturado."
    },
    { name: "twitter:image", content: "https://estuday.com.br/img/metaImg.webp" },
    {
      name: "keywords",
      content: "cronograma de estudos, planejamento, estudo, matérias, metas, progresso, Estuday, organização, trilha de aprendizado"
    }
  ]
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:py-6 sm:px-6 lg:px-8 pt-16 sm:pt-6">
      <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 lg:text-3xl xl:text-4xl">
              Cronograma de <span class="text-primary">Estudos</span>
            </h1>
            <p class="text-gray-600 mt-1">{{ isEditMode ? 'Arraste as matérias para montar seu plano.' : 'Marque suastarefas concluídas de hoje.' }}</p>
          </div>

          <div class="flex items-center gap-4">
            <button v-if="isEditMode && isSchedulePopulated" @click="clearSchedule"
              class="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700">
              Limpar Tudo
            </button>
            <button v-if="isEditMode" @click="handleSave"
              class="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700">
              Salvar e Visualizar
            </button>
            <button v-else @click="isEditMode = true"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700">
              Editar Cronograma
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Modo de Edição -->
      <div v-if="isEditMode">

        <div v-if="isDesktop" class="grid grid-cols-4 gap-8">
          <div class="col-span-1">
            <div class="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Matérias</h2>
              <draggable v-model="availableSubjects" item-key="id" tag="div"
                class="space-y-2 max-h-[65vh] overflow-y-auto pr-2"
                :group="{ name: 'subjects', pull: 'clone', put: false }" :sort="false" :delay="100"
                :delay-on-touch-only="true">
                <template #item="{ element: subject }">
                  <div
                    class="bg-gray-100 p-3 rounded-md cursor-grab text-sm font-medium text-gray-700 hover:bg-gray-200">
                    <div class="flex flex-col gap-1">
                      <span class="flex items-center">
                        <i class="fa-solid fa-grip-vertical mr-2 text-gray-400"></i>
                        {{ subject.name }}
                      </span>
                      <div class="flex justify-end items-center gap-1">
                        <span v-for="initial in subjectUsage[subject.name]" :key="initial"
                          class="flex items-center justify-center h-5 w-5 bg-primary text-white text-xs rounded-full font-bold">
                          {{ initial }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
          <div class="col-span-3">
            <div class="grid grid-cols-2 xl:grid-cols-3 gap-6">
              <div v-for="day in scheduleStore.weeklyPlan" :key="day.day"
                class="bg-white rounded-lg shadow p-5 flex flex-col">
                <h3 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{{ day.day }}</h3>
                <draggable v-model="day.subjects" item-key="id" tag="div" group="subjects"
                  class="flex-grow min-h-[10rem] bg-gray-50 rounded-lg p-2 space-y-2" :data-day="day.day"
                  @add="onAddSubject" :delay="100" :delay-on-touch-only="true">
                  <template #item="{ element: subject }">
                    <div
                      class="flex items-center justify-between bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-md cursor-grab">
                      <span>{{ subject.name }}</span>
                      <button @click="removeSubjectFromDay(day.day, subject.id)"
                        class="ml-2 text-blue-800 hover:bg-blue-800/20 rounded-full w-5 h-5 flex items-center justify-center"
                        title="Remover">&times;
                      </button>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="(day, index) in scheduleStore.weeklyPlan" :key="day.day"
            class="bg-white rounded-lg shadow p-5 flex flex-col">
            <h3 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{{ day.day }}</h3>

            <div class="flex-grow min-h-[6rem] space-y-2">
              <p v-if="day.subjects.length === 0" class="text-sm text-gray-400 text-center py-4">Nenhuma matéria.</p>
              <div v-else v-for="subject in day.subjects" :key="subject.id"
                class="flex items-center justify-between bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-md">
                <span>{{ subject.name }}</span>
                <button @click="removeSubjectFromDay(day.day, subject.id)"
                  class="ml-2 text-blue-800 hover:bg-blue-800/20 rounded-full w-5 h-5 flex items-center justify-center"
                  title="Remover">&times;</button>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center gap-2">
                <select @change="addSubjectToDay(day.day, availableSubjects.find(s => s.id == $event.target.value))"
                  :value="''"
                  class="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-primary focus:border-primary">
                  <option value="" disabled>+ Adicionar matéria...</option>
                  <option v-for="subject in sortedAvailableSubjects" :key="subject.id" :value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="day in scheduleStore.weeklyPlan" :key="day.day"
          class="bg-white rounded-lg shadow p-5 transition-all"
          :class="{ 'border-2 border-primary': isToday(day.day), 'opacity-70': !isToday(day.day) }">
          <h3 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{{ day.day }}</h3>
          <div class="flex-grow min-h-[10rem] space-y-2">
            <p v-if="day.subjects.length === 0" class="text-sm text-gray-400 text-center py-4">Nenhuma matéria
              planejada.</p>
            <div v-else v-for="subject in day.subjects" :key="subject.id">
              <label class="flex items-center p-3 rounded-md transition-all duration-200"
                :class="[scheduleStore.isCompleted(subject.id, day.day) ? 'bg-green-100' : 'bg-gray-100', isToday(day.day) ? 'cursor-pointer hover:bg-gray-200' : 'cursor-not-allowed']">
                <input type="checkbox"
                  class="h-5 w-5 rounded border-gray-400 text-green-600 focus:ring-green-500 disabled:cursor-not-allowed"
                  :checked="scheduleStore.isCompleted(subject.id, day.day)" :disabled="!isToday(day.day)"
                  @change="scheduleStore.toggleCompletion(subject.id)" />
                <span class="ml-3 text-sm font-medium text-gray-800"
                  :class="{ 'line-through text-gray-500': scheduleStore.isCompleted(subject.id) }">
                  {{ subject.name }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AlertModal :visible="showSuccessModal" title="Sucesso" :message="successMessage" @close="showSuccessModal = false" :showButton="false" :showConfirm="false" type="success" 
  />
  <AlertModal :visible="showClearModal" title="Confirmar Limpeza" message="Tem certeza que deseja limpar todo o cronograma? Esta ação não pode ser desfeita."@close="showClearModal = false"@confirm="handleConfirmClear":showButton="true" :showConfirm="true" type="warning"/>
</template>