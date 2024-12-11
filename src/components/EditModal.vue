<script setup>
import { reactive, watch, computed } from 'vue';

import { useUserStore } from '../stores/useUserStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';
import { useSubjectStore } from '../stores/useSubjectStore';

import ComboBox from '../components/ui/ComboBox.vue';

const { formatStudyTime } = useTimeFormatter();


const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  record: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update', 'close']);

const userStore = useUserStore();
const subjectStore = useSubjectStore();

// Inicializa `formData` com valores reativos
const formData = reactive({
  subject_id: null,
  subjectName: '',
  topic: '',
  study_time: 0,
  total_pauses: 0,
  questions_resolved: 0,
  correct_answers: 0,
  incorrect_answers: 0,
});

// Atualiza `formData` quando `record` muda
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      formData.subject_id = newRecord.subject_id || null;
      formData.subjectName = newRecord.subjectName || '';
      formData.topic = newRecord.topic || '';
      formData.study_time = newRecord.study_time || 0;
      formData.total_pauses = newRecord.total_pauses || 0;
      formData.questions_resolved = newRecord.questions_resolved || 0;
      formData.correct_answers = newRecord.correct_answers || 0;
      formData.incorrect_answers = newRecord.incorrect_answers || 0;
    }
  },
  { immediate: true }
);

// Computed para obter a lista de matérias
const subjects = computed(() => subjectStore.subjects);

// Emite evento de atualização
const handleSubmit = () => {
  emit('update', { ...formData });
  closeModal();
};

// Fecha o modal
const closeModal = () => {
  emit('close');
};

const saveChanges = async () => {
  try {
    const updatedData = {
      subject_id: formData.subject_id,
      topic: formData.topic,
      questions_resolved: formData.questions_resolved,
      correct_answers: formData.correct_answers,
      incorrect_answers: formData.questions_resolved - formData.correct_answers,
      study_time: formData.study_time, // Mantém imutável
      total_pauses: formData.total_pauses, // Mantém imutável
    };

    await userStore.updateUserStudyRecord(props.record.id, updatedData); // Certifique-se que este método existe
    alert("Registro atualizado com sucesso!");
    closeModal(); // Usa a função já definida para fechar o modal
  } catch (error) {
    alert("Ocorreu um erro ao atualizar o registro. Tente novamente.");
  }
};
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-zinc-600">
    <div class="bg-zinc-100 rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">Editar Registro</h2>
      <form @submit.prevent="saveChanges">
        <div class="mb-4">
          <label for="subjectName" class="block text-sm font-medium text-gray-700">Matéria</label>
          <ComboBox
            :options="subjects"
            :placeholder="'Selecione uma matéria...'"
            v-model="formData.subjectName"
            class="mt-1 block w-full"
          />
          <!-- <input v-model="formData.subjectName" type="text" id="subjectName"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /> -->
        </div>
        <div class="mb-4">
          <label for="topic" class="block text-sm font-medium text-gray-700">Tópico</label>
          <input v-model="formData.topic" type="text" id="topic"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="flex gap-4 justify-between">
          <div class="mb-4">
            <label for="study_time" class="block text-sm font-medium text-gray-700">Tempo de estudo</label>
            <input :value="formatStudyTime(formData.study_time)" type="text" id="study_time" readonly
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed text-zinc-500" />
          </div>
          <div class="mb-4">
            <label for="total_pauses" class="block text-sm font-medium text-gray-700">Nº de pauses</label>
            <input v-model="formData.total_pauses" type="number" id="total_pauses" readonly
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed text-zinc-500" />
          </div>
        </div>
        <p class="text-center p-4 block text-sm font-medium text-gray-700">Dados de Questões</p>
        <div class="flex gap-2 justify-between">
          <div class="mb-4">
            <label for="questions_resolved" class="block text-sm font-medium text-gray-700">Total</label>
            <input v-model="formData.questions_resolved" type="number" id="questions_resolved"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="correct_answers" class="block text-sm font-medium text-gray-700">Corretas</label>
            <input v-model="formData.correct_answers" type="number" id="correct_answers"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="incorrect_answers" class="block text-sm font-medium text-gray-700">Erradas</label>
            <input v-model="formData.incorrect_answers" type="number" id="incorrect_answers"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Remove as bordas ao clicar em inputs readonly */
input[readonly]:focus {
  outline: none;
  
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Para navegadores baseados no Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

input {
  padding: 5px 10px
}
</style>
