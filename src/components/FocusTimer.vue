<script setup>
import { ref } from 'vue';
import { useTimerStore } from '../stores/useTimerStore'

const timerStore = useTimerStore();

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  }
});

// Props e eventos
const emit = defineEmits(['close', 'timerStopped']);

// Estados do cronômetro
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isRunning = ref(false);
const pauseCount = ref(0); // Contador de pausas
let timerInterval = null;

// Função para iniciar o cronômetro
function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true;
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
    }, 1000);
  }
}

// Função para pausar o cronômetro
function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false;
    clearInterval(timerInterval);
    pauseCount.value++; // Incrementa a contagem de pausas
  }
}

// Função para parar e resetar o cronômetro
function stopTimer() {
    timerStore.stop();
    emit('timerStopped');
    isRunning.value = false;
    clearInterval(timerInterval);
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    pauseCount.value = 0; // Reseta a contagem de pausas ao parar o cronômetro
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
    <button @click="$emit('close')" class="absolute top-4 right-4 text-white text-2xl hover:text-red-500">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="text-center text-white">
      <div class="text-8xl font-mono mb-8">
        {{ String(hours).padStart(2, '0') }}:{{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}
      </div>
      <div class="text-2xl font-semibold mb-4">
        Pausas: {{ pauseCount }}
      </div>
      <div class="space-x-4">
        <button 
          @click="startTimer" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          :disabled="isRunning"
        >
          Iniciar
        </button>
        <button 
          @click="pauseTimer" 
          class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          :disabled="!isRunning"
        >
          Pausar
        </button>
        <button 
          @click="stopTimer" 
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Parar
        </button>
      </div>
    </div>
    <pre><p class="bg-red-500 text-white">{{ timerStore.finalTotalPausesLength }}</p></pre>
  </div>
</template>