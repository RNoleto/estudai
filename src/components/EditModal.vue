<script setup>
import { reactive, watch, computed, ref } from 'vue';

import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';

import ComboBox from '../components/ui/ComboBox.vue';
import Button from '../components/ui/Button.vue';
import Input from  '../components/ui/Input.vue';

import Card from './Card.vue';

import AlertModal from './ui/AlertModal.vue';

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

// Estado para o modal de alerta
const showModal = ref(false);
const type = ref(null);
const title = ref(null);
const message = ref(null);

// Atualize o formData para ter 3 propriedades de tempo separadas
const formData = reactive({
  subject_id: null,
  subjectName: '',
  topic: '',
  studyHours: '0',    // horas
  studyMinutes: '00', // minutos
  studySeconds: '00', // segundos
  total_pauses: 0,
  questions_resolved: 0,
  correct_answers: 0,
  incorrect_answers: 0,
});

const modalMessage = reactive({ text: '', type: '' });

// Função auxiliar para garantir 2 dígitos
function padTime(value) {
  return String(value).padStart(2, '0');
}

// Ao receber um novo record, separe o study_time (em segundos) em hh, mm, ss
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      formData.subject_id = newRecord.subject_id || null;
      formData.subjectName = newRecord.subjectName || '';
      formData.topic = newRecord.topic || '';
      
      const totalSeconds = newRecord.study_time || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      formData.studyHours = padTime(hours);
      formData.studyMinutes = padTime(minutes);
      formData.studySeconds = padTime(seconds);
      
      formData.total_pauses = newRecord.total_pauses || 0;
      formData.questions_resolved = newRecord.questions_resolved || 0;
      formData.correct_answers = newRecord.correct_answers || 0;
      formData.incorrect_answers = newRecord.incorrect_answers || 0;
    }
  },
  { immediate: true }
);

const subjects = computed(() => {
  return userStore.userSubjects
    .map((subject_id) =>
      subjectStore.subjects.find((subject) => subject.id === subject_id)
    )
    .filter(Boolean);
});

// Atualiza automaticamente as questões incorretas
watch(
  [() => formData.questions_resolved, () => formData.correct_answers],
  ([total, correct]) => {
    formData.incorrect_answers = Math.max(0, total - correct);
  }
);

const closeModal = () => {
  emit('close');
};

const saveChanges = async () => {
  // Validação dos inputs de tempo
  const hours = Number(formData.studyHours);
  const minutes = Number(formData.studyMinutes);
  const seconds = Number(formData.studySeconds);
  
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    showModal.value = true;
    title.value = 'Erro';
    type.value = 'error';
    message.value = 'Por favor, insira valores numéricos válidos para o tempo de estudo.';
    setTimeout(() => {
            showModal.value = false;
        }, 2000);
    return false;
  }
  
  // Validação: minutos e segundos entre 0 e 59 e horas não negativas
  if (hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {

    showModal.value = true;
    title.value = 'Erro';
    type.value = 'error';
    message.value = 'Por favor, insira um tempo de estudo válido.';
    setTimeout(() => {
            showModal.value = false;
        }, 2000);
    return;
  }
  
  // Converte o tempo para segundos
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (formData.total_pauses < 0) {
    showModal.value = true;
    title.value = 'Erro';
    type.value = 'error';
    message.value = 'O número de pauses deve ser maior ou igual a zero.';
    setTimeout(() => {
            showModal.value = false;
        }, 2000);
    return;
  }

  if(formData.correct_answers > formData.questions_resolved){
    showModal.value = true;
    title.value = 'Erro';
    type.value = 'error';
    message.value = 'O número de questões corretas não pode ser maior que o total de questões.';
    setTimeout(() => {
            showModal.value = false;
        }, 2000);
    return;
  }

  try {
    // Cria um objeto atualizado, convertendo os inputs de tempo para segundos
    const updatedData = {
      ...formData,
      study_time: totalSeconds,
    };
    
    // Remova as propriedades separadas de tempo se o backend não as espera
    delete updatedData.studyHours;
    delete updatedData.studyMinutes;
    delete updatedData.studySeconds;
    
    await userStore.updateUserStudyRecord(props.record.id, updatedData);
    
    emit('update');
    
    showModal.value = true;
    title.value = 'Sucesso';
    type.value = 'success';
    message.value = 'Registro atualizado com sucesso!';

    setTimeout(() => {
      showModal.value = false;
      closeModal();
    }, 2000);
  } catch (error) {
    showModal.value = true;
    title.value = 'Erro';
    type.value = 'error';
    message.value = 'Ocorreu um erro ao atualizar o registro. Tente novamente.';
    setTimeout(() => {
        showModal.value = false;
        closeModal();
    }, 2000);
  }
};
</script>

<template>
  <div v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-zinc-600 px-2">
    <Card title="Editar Registro" icon="fa-solid fa-tag" class="bg-zinc-100 rounded-2xl shadow-lg p-6 w-full max-w-md">
      <template #content>
        <form @submit.prevent="saveChanges" class="font-normal">
          <div class="mb-4">
            <label for="subjectName" class="block text-sm font-medium text-gray-700">Matéria</label>
            <ComboBox
              :options="subjects" 
              placeholder="Selecione uma matéria..." 
              v-model="formData.subjectName"
              class="block w-full" />
          </div>
          <div class="mb-4">
            <Input v-model="formData.topic" type="text" id="topic" showLabel="true" label="Tópico"/>
          </div>
          <!-- Inputs separados para o tempo de estudo -->
          <div class="flex gap-2 mb-4">
            <div class="flex-1">
              <Input v-model="formData.studyHours" type="number" id="studyHours" :maxlength="2" placeholder="hh" label="Horas"/>
            </div>
            <div class="flex-1">
              <Input v-model="formData.studyMinutes" type="number" id="studyMinutes" :maxlength="2" placeholder="mm" label="Minutos"/>
            </div>
            <div class="flex-1">
              <Input v-model="formData.studySeconds" type="number" id="studySeconds" :maxlength="2" placeholder="ss" label="Segundos"/>
            </div>
            <div class="flex-1">
              <Input v-model="formData.total_pauses" type="number" id="total_pauses" :maxlength="2" min="0" label="Nº de pauses"/>
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
          </div>
          <div class="flex justify-end gap-2">
            <Button type="submit" variant="base" size="full" @click="saveChanges">
              Salvar
            </Button>
            <Button type="button" variant="delete" @click="closeModal">
              Cancelar
            </Button>
          </div>
        </form>
      </template>
    </Card>
    <AlertModal :visible="showModal" :showButton="false" :showConfirm="false" :title="title" :type="type" :message="message"/>
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
  padding: 5px 10px;
}
</style>
