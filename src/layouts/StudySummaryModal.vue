<script setup>
import Button from '../components/ui/Button.vue';
import { computed, ref, onMounted } from 'vue';
import { useTimerStore } from '../stores/useTimerStore';
import { useUserStore } from '../stores/useUserStore';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

const { props } = defineProps({isOpen: Boolean});

const emit = defineEmits(['onClose']);

const timerStore = useTimerStore();
const userStore = useUserStore();

const isSaving = ref(false);


// Computed properties para garantir que os valores estejam atualizados
const totalStudyTime = computed(() => timerStore.finalFormattedTime); //Tempo no formato de segundos usado para o banco de dados
const formatedTime = computed(() => formatStudyTime(timerStore.finalElapsedTime)); //Mostra o tempo no formato correto antes de salvar
const totalPauses = computed(() => timerStore.finalTotalPausesLength);

// Estado do modal
const questionsResolved = ref('no');
const totalQuestions = ref(0);
const incorrectAnswers = ref(0);
const closeModal = () => {
  emit('onClose');
  
};

onMounted(async () => {
  await userStore.fetchUserStudyRecords();
});

// Salvando dados no store
const saveData = async () => {

  if(isSaving.value) return; //Impedimento de cliques repetidos enquanto salva

  if(incorrectAnswers.value > totalQuestions.value){
    alert('Total de questões incorretas não pode ser maior que total de questões respondidas');
    return;
  }
  
  isSaving.value = true; //Ativa o estado de salvamento
  
  try {
    const newRecord  = {
      totalStudyTime: totalStudyTime.value,
      totalPauses: totalPauses.value,
      questionsResolved: questionsResolved.value,
      totalQuestions: questionsResolved.value === 'yes' ? totalQuestions.value : 0,
      incorrectAnswers: questionsResolved.value === 'yes' ? incorrectAnswers.value : 0,
    };   

    // Salvando os dados no userStore
    await userStore.saveUserStudyRecord(newRecord); // passando valores para useUserStore
    
    // Recarregar os registros de estudo após salvar
    await userStore.fetchUserStudyRecords(); 

    // Reinicia os valores do timer
    timerStore.resetTimer();
    
    clearForm();
    closeModal();

    emit('onSaveSuccess');

  } catch (error) {
    console.error('Erro ao salvar:', error);
  } finally {
    isSaving.value = false; // Libera o botão após a conclusão
  }
}

const clearForm = () => {
  questionsResolved.value = 'no';
  totalQuestions.value = 0;
  incorrectAnswers.value = 0;
}

const isFormValid = computed(() => {
  if (questionsResolved.value === 'yes') {
    return (
      totalQuestions.value >= incorrectAnswers.value &&
      totalQuestions.value > 0 &&
      incorrectAnswers.value >= 0 
    );
  }
  return true; // Válido se nenhuma questão foi resolvida.
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-zinc-700 bg-opacity-50 backdrop-filter backdrop-blur-sm z-10">
    <div class="bg-white p-5 rounded-lg shadow-lg max-w-sm">
      <h2 class="text-lg font-bold mb-4 uppercase ">Resumo de Estudo</h2>
      <!-- Exibindo o tempo total de estudo -->
      <div>
        <strong>Tempo Total de Estudo:</strong> {{ formatedTime }} 
      </div>
      <!-- Exibindo o número de pausas -->
      <div>
        <strong>Total de Pausas:</strong> {{ totalPauses }}
      </div>
      <!-- Pergunta sobre resolução de questões -->
      <div class="mt-4">
        <p>Você resolveu questões?</p>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input type="radio" v-model="questionsResolved" value="yes" class="mr-2">
            Sim
          </label>
          <label class="flex items-center">
            <input type="radio" v-model="questionsResolved" value="no" class="mr-2">
            Não
          </label>
        </div>
      </div>

      <!-- Campos adicionais para questões resolvidas -->
      <div v-if="questionsResolved === 'yes'" class="flex gap-4 mt-4">
        <label class="block mb-2">
          <span>Questões resolvidas</span>
          <input type="number" v-model="totalQuestions" min="0" class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
        </label>
        <label for="block mb-2">
          <span>Questões erradas</span>
          <input type="number" v-model="incorrectAnswers" min="0" :max="totalQuestions" class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none">
        </label>
      </div>
      <div class="flex justify-between mt-2">
        <Button 
          variant="primary"
            @click="saveData"
            :disabled="!isFormValid || isSaving"
        >
          {{ isSaving ? 'Salvando...' : 'Salvar' }}
        </Button>
        <Button
          variant="secondary"
          @click="closeModal"
        >
          Cancelar
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-sm {
  width: 90%;
  max-width: 400px;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]{
  -moz-appearance: textfield;
}
</style>
