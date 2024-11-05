<script setup>
import Button from '../components/ui/Button.vue';
import { computed, ref } from 'vue';
import { useTimerStore } from '../stores/useTimerStore';
import { useStudyStore } from '../stores/useStudyStore';

const props = defineProps({
  isOpen: Boolean, 
});

const emit = defineEmits(['onClose']);

const timerStore = useTimerStore();
const studyStore = useStudyStore();

// Computed properties para garantir que os valores estejam atualizados
const totalStudyTime = computed(() => timerStore.finalFormattedTime);
const totalPauses = computed(() => timerStore.finalTotalPausesLength);

// Estado do modal
const questionsResolved = ref(null);
const totalQuestions = ref(0);
const correctAnswers = ref(0);

const closeModal = () => {
  emit('onClose');
};

// Salvando dados no store
const saveData = () => {
  studyStore.updateStudySummary({
    totalStudyTime: totalStudyTime.value,
    totalPauses: totalPauses.value,
    questionsResolved: questionsResolved.value,
    totalQuestions: questionsResolved.value === 'yes' ? totalQuestions.value : 0,
    correctAnswers: questionsResolved.value === 'yes' ? correctAnswers.value : 0,
  });

  // Limpa os campos do formulário após salvar
  questionsResolved.value = null;
  totalQuestions.value = 0;
  correctAnswers.value = 0;

  closeModal(); // Fecha o modal
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-bold mb-4 uppercase ">Resumo de Estudo</h2>
      <!-- Exibindo o tempo total de estudo -->
      <div>
        <strong>Tempo Total de Estudo:</strong> {{ totalStudyTime }}
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
          <input type="number" v-model="totalQuestions" min="0" class="mt-1 block w-full border rounded px-2 py-1" />
        </label>
        <label class="block mb-2">
          <span>Questões certas</span>
          <input type="number" v-model="correctAnswers" min="0" class="mt-1 block w-full border rounded px-2 py-1" />
        </label>
      </div>
      <Button 
        variant="primary"
        @click="saveData"
        >
        Salvar
      </Button>
    </div>
  </div>
</template>
