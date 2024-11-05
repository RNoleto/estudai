<script setup>
import { ref } from 'vue';
import { useTimerStore } from '../../stores/useTimerStore';
import Button from './Button.vue';
import StudySummaryModal from '../../layouts/StudySummaryModal.vue';

const timerStore = useTimerStore();
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const stopTimer = () => {
  timerStore.stop();
  openModal();
};
</script>

<template>
  <div class="flex flex-col items-center p-4 border rounded-md bg-white">
    <h2 class="text-lg font-bold mb-4">Temporizador</h2>
    <div class="text-2xl font-mono mb-4">{{ timerStore.formattedTime }}</div>
    <div class="flex space-x-2">
      <Button @click="timerStore.start" variant="primary" :disabled="timerStore.isRunning">Iniciar</Button>
      <Button @click="timerStore.togglePause" variant="secondary" :disabled="!timerStore.isRunning">
        {{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}
      </Button>
      <!-- O botão "Parar" só estará habilitado quando o timer estiver rodando ou pausado -->
      <Button @click="stopTimer" variant="delete" :disabled="!timerStore.isRunning">Parar</Button>
    </div>

    <div class="mt-4">
      <h3 v-if="timerStore.pauses.length > 0" class="text-md font-bold">Pausas:</h3>
      <ul>
        <li v-for="(pause, index) in timerStore.pauses" :key="index">
          {{ index + 1 }}ª Pausa - {{ timerStore.formatPauseTime(pause) }}
        </li>
      </ul>
      <div class="mt-2">
        <strong>Total de pausas: {{ timerStore.pauses.length }}</strong>
      </div>
      <div>
        <strong>Tempo total: {{ timerStore.formatPauseTime(timerStore.totalPauseTime) }}</strong>
      </div>
    </div>

    <!-- Modal de Resumo de Estudo -->
    <StudySummaryModal
      :isOpen="isModalOpen"
      @onClose="closeModal"
    />
  </div>
</template>

<style scoped>
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
  &:disabled {
    @apply bg-gray-400 cursor-not-allowed;
  }
}
</style>
