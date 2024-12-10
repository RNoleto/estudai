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
  <div class="flex flex-col rounded-md bg-white p-4 shadow">
    <div class="flex flex-col items-center">
      <h2 class="w-full text-2xl text-center p-2 mb-4 border-b border-zinc-100">Temporizador</h2>
      <div class="text-4xl font-mono mb-4">{{ timerStore.formattedTime }}</div>
      <div class="flex space-x-2">
        <Button @click="timerStore.start" variant="primary" :disabled="timerStore.isRunning || props.isDisabled">Iniciar</Button>
        <Button @click="timerStore.togglePause" variant="secondary" :disabled="!timerStore.isRunning">
          {{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}
        </Button>
        <Button @click="stopTimer" variant="delete" :disabled="!timerStore.isRunning">Parar</Button>
      </div>
    </div>
    <div class="flex justify-between mt-4 px-4">
      <p><strong>Tempo total:</strong> {{ timerStore.formatPauseTime(timerStore.totalPauseTime) }}</p>
      <p><strong>Total de pausas:</strong> {{ timerStore.pauses.length }}</p>      
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
