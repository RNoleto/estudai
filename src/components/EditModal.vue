<script setup>
import { reactive, watch, computed } from 'vue';

import { useUserStore } from '../stores/useUserStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';
import { useSubjectStore } from '../stores/useSubjectStore';

import ComboBox from '../components/ui/ComboBox.vue';
import Button from '../components/ui/Button.vue';
import Input from  '../components/ui/Input.vue';

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

// Variáveis reativas para o modal
const modalMessage = reactive({ text: '', type: '' }); // Tipo 'success' ou 'error'

// Função para formatar o tempo de estudo em HH:MM:SS
function formatTimeToHHMMSS(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

// Atualiza `formData` quando `record` muda
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      formData.subject_id = newRecord.subject_id || null;
      formData.subjectName = newRecord.subjectName || '';
      formData.topic = newRecord.topic || '';
      formData.study_time = formatTimeToHHMMSS(newRecord.study_time || 0);
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

watch(
  [() => formData.questions_resolved, () => formData.correct_answers],
  ([total, correct]) => {
    formData.incorrect_answers = Math.max(0, total - correct);
  }
);

// Fecha o modal
const closeModal = () => {
  emit('close');
};

const saveChanges = async () => {
  try {
    // Validação do formato de tempo
    if (!/^\d{1,2}:\d{2}:\d{2}$/.test(formData.study_time)) {
      modalMessage.text = 'Por favor, insira o tempo de estudo no formato hh:mm:ss.';
      modalMessage.type = 'error';
      return;
    }

    // Conversão de tempo para segundos
    const [hours, minutes, seconds] = formData.study_time.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Validação do número de pauses
    if (formData.total_pauses < 0) {
      modalMessage.text = 'O número de pauses deve ser maior ou igual a zero.';
      modalMessage.type = 'error';
      return;
    }

    // Atualização dos dados
    const updatedData = {
      ...formData,
      study_time: totalSeconds,
    };

    await userStore.updateUserStudyRecord(props.record.id, updatedData);

    //Emitindo evento para carregar a listagem
    emit('update');

    modalMessage.text = 'Registro atualizado com sucesso!';
    modalMessage.type = 'success';
  } catch (error) {
    modalMessage.text = 'Ocorreu um erro ao atualizar o registro. Tente novamente.';
    modalMessage.type = 'error';
  }
};

// Função para fechar o modal de sucesso
const closeSuccessModal = () => {
  modalMessage.text = ''; // Limpa a mensagem
  closeModal(); // Fecha o modal de edição também
};
</script>

<template>
  <div v-if="isVisible && !modalMessage.text"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-zinc-600 px-2">
    <div class="bg-zinc-100 rounded-2xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">Editar Registro</h2>
      <form @submit.prevent="saveChanges">
        <div class="mb-4">
          <label for="subjectName" class="block text-sm font-medium text-gray-700">Matéria</label>
          <ComboBox :options="subjects" :placeholder="'Selecione uma matéria...'" v-model="formData.subjectName"
            class="mt-1 block w-full" />
        </div>
        <div class="mb-4">
          <Input v-model="formData.topic" type="text" id="topic" showLabel="true" label="Tópico"/>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="mb-4">
            <Input v-model="formData.study_time" type="text" id="study_time" placeholder="hh:mm:ss" label="Tempo de estudo"/>
          </div>
          <div class="mb-4">
            <Input v-model="formData.total_pauses" type="number" id="total_pauses" min="0" label="Nº de pauses"/>
          </div>
        </div>
        <p class="text-center p-4 block text-sm font-medium text-gray-700">Dados de Questões</p>
        <div class="flex gap-2 justify-between">
          <div class="mb-4">
            <Input v-model="formData.questions_resolved" type="number" id="questions_resolved" label="Total"/>
          </div>
          <div class="mb-4">
            <Input v-model="formData.correct_answers" type="number" id="correct_answers" label="Corretas"/>
          </div>
          <!-- <div class="mb-4">
            <label for="incorrect_answers" class="block text-sm font-medium text-gray-700">Erradas</label>
            <input v-model="formData.incorrect_answers" type="number" id="incorrect_answers" readonly
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed text-zinc-500" />
          </div> -->
        </div>
        <div class="flex justify-end gap-2">
          <Button type="submit" variant="play" size="full" >
            Salvar
          </Button>
          <Button type="button" variant="secondary" @click="closeModal">
            Cancelar
          </Button>
          
        </div>
      </form>
    </div>
  </div>
  <!-- Modal de Sucesso ou Erro -->
  <div v-if="modalMessage.text"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white">
    <div :class="modalMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      class="rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
      <p class="text-lg font-bold">{{ modalMessage.text }}</p>
      <button @click="closeSuccessModal" class="mt-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200">
        Fechar
      </button>
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
