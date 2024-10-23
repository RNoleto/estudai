<script setup>
import { useTimerStore } from '../../stores/useTimerStore'

const timerStore = useTimerStore()

</script>

<template>
  <div class="flex flex-col items-center p-4 border rounded-md shadow-md shadow-black bg-white">
    <h2 class="text-lg font-bold mb-4">Temporizador</h2>
    <div class="text-2xl font-mono mb-4">{{ timerStore.formattedTime }}</div>
    <div class="flex space-x-2">
      <button @click="timerStore.start" class="btn" :disabled="timerStore.isRunning">Iniciar</button>
      <button @click="timerStore.togglePause" class="btn" :disabled="!timerStore.isRunning">{{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}</button>
      <button @click="timerStore.stop" class="btn">Parar</button>
    </div>

    <div class="mt-4">
      <h3 class="text-md font-bold">Pausas:</h3>
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
