<script setup>
import { useTimerStore } from '../../stores/useTimerStore';
import Button from './Button.vue';


const timerStore = useTimerStore();

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['timerStopped']);

const stopTimer = () => {
  timerStore.stop();
  emit('timerStopped');
};
</script>

<template>
  <div class="grid grid-cols-2 rounded-md bg-white p-4">
    <div class="flex flex-col items-center">
      <h2 class="text-lg font-bold mb-4">Temporizador</h2>
      <div class="text-2xl font-mono mb-4">{{ timerStore.formattedTime }}</div>
      <div class="flex space-x-2">
        <Button @click="timerStore.start" variant="primary" :disabled="timerStore.isRunning || props.isDisabled">Iniciar</Button>
        <Button @click="timerStore.togglePause" variant="secondary" :disabled="!timerStore.isRunning">
          {{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}
        </Button>
        <!-- O botão "Parar" só estará habilitado quando o timer estiver rodando ou pausado -->
        <Button @click="stopTimer" variant="delete" :disabled="!timerStore.isRunning">Parar</Button>
      </div>
    </div>
    <div class="flex flex-col text-center justify-center p-4 gap-2 border-l border-zinc-100">
      <strong>Total de pausas: {{ timerStore.pauses.length }}</strong>      
      <strong>Tempo total: {{ timerStore.formatPauseTime(timerStore.totalPauseTime) }}</strong>
    </div>
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
