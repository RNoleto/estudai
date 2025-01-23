<script setup>
import { ref } from 'vue';
import { useTimerStore } from '../stores/useTimerStore';

const timerStore = useTimerStore();

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

// Props e eventos
const emit = defineEmits(['close', 'timerStopped']);

// Estados do cronômetro
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isRunning = ref(false);
const isPaused = ref(false); // Estado para determinar se está pausado
const pauseCount = ref(0); // Contador de pausas
let timerInterval = null;

// Função para iniciar ou retomar o cronômetro
function startOrResumeTimer() {
  if (!isRunning.value || isPaused.value) {
    isRunning.value = true;
    isPaused.value = false;

    timerStore.start(); // Inicia ou retoma o timer no store

    timerInterval = setInterval(() => {
      seconds.value++;
      if (seconds.value === 60) {
        seconds.value = 0;
        minutes.value++;
      }
      if (minutes.value === 60) {
        minutes.value = 0;
        hours.value++;
      }

      // Atualizar o tempo no store
      timerStore.elapsedTime = hours.value * 3600 + minutes.value * 60 + seconds.value;
    }, 1000);
  }
}

// Função para pausar o cronômetro
function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false;
    isPaused.value = true;
    clearInterval(timerInterval);

    pauseCount.value++; // Incrementa a contagem de pausas
    timerStore.pauses.push(timerStore.elapsedTime); // Salva o tempo de pausa no store
  }
}

// Função para parar e resetar o cronômetro
function stopTimer() {
  timerStore.stop();
  emit('timerStopped');
  isRunning.value = false;
  isPaused.value = false;
  clearInterval(timerInterval);
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
  pauseCount.value = 0; // Reseta a contagem de pausas ao parar o cronômetro
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
    <button @click="$emit('close')" class="absolute top-[90px] right-4 sm:top-4 sm:right-4 text-white text-2xl hover:text-red-500">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="text-center text-white">
      <div class="text-6xl sm:text-8xl font-mono mb-8">
        {{ String(hours).padStart(2, '0') }}:{{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}
      </div>
      <div class="text-2xl font-semibold mb-4">
        Pausas: {{ pauseCount }}
      </div>
      <div class="space-x-4">
        <button
          @click="isPaused ? startOrResumeTimer() : (isRunning ? pauseTimer() : startOrResumeTimer())"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {{ isPaused ? 'Retomar' : (isRunning ? 'Pausar' : 'Iniciar') }}
        </button>
        <button
          @click="stopTimer"
          :disabled="!isRunning && !isPaused"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Parar
        </button>
      </div>
    </div>
  </div>
</template>
