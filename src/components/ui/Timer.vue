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

const emit = defineEmits(['timerStopped', 'openFocus']);

const stopTimer = () => {
  timerStore.stop();
  emit('timerStopped');
};

const openFocus = () => {
  emit('openFocus');
}
</script>

<template>
  <div class="relative flex flex-col rounded-md bg-white shadow p-4 min-h-[250px]">
    <div @click="!props.isDisabled && openFocus()" class="absolute right-4 text-sm p-1 cursor-pointer" :class="{ 'cursor-not-allowed text-gray-400': props.isDisabled }">
      <i class="fa-solid fa-arrows-to-circle"></i>
    </div>
    <div class="flex flex-col items-center gap-1 py-4">
      <h2 class="w-full text-2xl text-center border-b border-zinc-100 p-2">Temporizador</h2>
      <div class="text-4xl font-mono">{{ timerStore.formattedTime }}</div>
      <div class="flex space-x-2">
        <Button @click="timerStore.start" variant="primary" :disabled="timerStore.isRunning || props.isDisabled">Iniciar</Button>
        <Button @click="timerStore.togglePause" variant="secondary" :disabled="!timerStore.isRunning">
          {{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}
        </Button>
        <Button @click="stopTimer" variant="delete" :disabled="!timerStore.isRunning">Parar</Button>
      </div>
    </div>
    <div class="flex justify-between py-2">
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
