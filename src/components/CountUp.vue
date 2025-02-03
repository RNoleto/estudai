<template>
    <div class="p-4 max-w-md mx-auto bg-white rounded shadow">
      <!-- Exibição do tempo com animação suave -->
      <div class="text-center mb-4">
        <div class="text-4xl font-mono transition-all duration-500">
          {{ countUpStore.formattedTime }}
        </div>
      </div>
  
      <!-- Botões de controle -->
      <div class="flex justify-center space-x-4 mb-4">
        <button
          @click="handlePlayPause"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {{ countUpStore.isRunning ? (countUpStore.isPaused ? 'Retomar' : 'Pausar') : 'Play' }}
        </button>
        <button
          @click="handleStop"
          class="px-4 py-2 bg-red-500 text-white rounded"
          :disabled="!countUpStore.isRunning"
        >
          Parar
        </button>
      </div>
  
      <!-- Swipers para definir o tempo inicial (apenas quando o timer não está rodando) -->
      <div v-if="!countUpStore.isRunning" class="flex justify-center space-x-8 mb-4">
        <!-- Picker de Horas -->
        <div class="flex flex-col items-center">
          <div class="mb-2 font-semibold">Horas</div>
          <div class="relative w-20 h-16 overflow-hidden border rounded">
            <div
              class="absolute inset-0 transition-transform duration-300"
              :style="{ transform: `translateY(-${selectedHour * itemHeight}px)` }"
            >
              <div
                v-for="hour in hours"
                :key="hour"
                class="h-10 flex items-center justify-center"
              >
                {{ hour < 10 ? '0' + hour : hour }}
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-2">
            <button @click="incrementHour" class="px-2 py-1 bg-gray-200 rounded mb-1">
              ▲
            </button>
            <button @click="decrementHour" class="px-2 py-1 bg-gray-200 rounded">
              ▼
            </button>
          </div>
        </div>
  
        <!-- Picker de Minutos -->
        <div class="flex flex-col items-center">
          <div class="mb-2 font-semibold">Minutos</div>
          <div class="relative w-20 h-16 overflow-hidden border rounded">
            <div
              class="absolute inset-0 transition-transform duration-300"
              :style="{ transform: `translateY(-${selectedMinute * itemHeight}px)` }"
            >
              <div
                v-for="minute in minutes"
                :key="minute"
                class="h-10 flex items-center justify-center"
              >
                {{ minute < 10 ? '0' + minute : minute }}
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-2">
            <button @click="incrementMinute" class="px-2 py-1 bg-gray-200 rounded mb-1">
              ▲
            </button>
            <button @click="decrementMinute" class="px-2 py-1 bg-gray-200 rounded">
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useCountUpStore } from '../stores/useContUpStore.js';
  
  const countUpStore = useCountUpStore();
  
  // Define a altura de cada item no swiper (em pixels)
  const itemHeight = 40;
  
  // Cria arrays para as horas (0 a 23) e minutos (0 a 59)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  // Estados reativos para o item selecionado em cada swiper
  const selectedHour = ref(0);
  const selectedMinute = ref(0);
  
  // Funções para incrementar/decrementar os valores com limites
  const incrementHour = () => {
    if (selectedHour.value < hours.length - 1) {
      selectedHour.value++;
    }
  };
  
  const decrementHour = () => {
    if (selectedHour.value > 0) {
      selectedHour.value--;
    }
  };
  
  const incrementMinute = () => {
    if (selectedMinute.value < minutes.length - 1) {
      selectedMinute.value++;
    }
  };
  
  const decrementMinute = () => {
    if (selectedMinute.value > 0) {
      selectedMinute.value--;
    }
  };
  
  // Função para tratar o clique no botão Play/Pausar/Retomar
  const handlePlayPause = () => {
    if (!countUpStore.isRunning) {
      // Se o timer não está rodando, define o tempo inicial com base na seleção
      const secondsToSet = selectedHour.value * 3600 + selectedMinute.value * 60;
      countUpStore.setTime(secondsToSet);
      countUpStore.start();
    } else {
      countUpStore.togglePause();
    }
  };
  
  // Função para tratar o clique no botão Parar
  const handleStop = () => {
    countUpStore.stop();
    // Opcional: reseta as seleções para zero
    selectedHour.value = 0;
    selectedMinute.value = 0;
  };
  </script>
  
  <style scoped>
  /* Se desejar, ajuste os estilos adicionais aqui */
  </style>
  