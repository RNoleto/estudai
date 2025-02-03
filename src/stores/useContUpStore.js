// src/stores/useCountUpStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCountUpStore = defineStore('countup', () => {
  const isRunning = ref(false);
  const isPaused = ref(false);
  const currentTime = ref(0); // tempo em segundos

  let timerId = null;
  let lastTimestamp = null;

  // Inicia o timer a partir do valor atual de currentTime
  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      isPaused.value = false;
      lastTimestamp = Date.now();
      tick();
    }
  };

  const tick = () => {
    if (isRunning.value && !isPaused.value) {
      const now = Date.now();
      const delta = Math.floor((now - lastTimestamp) / 1000);
      if (delta > 0) {
        currentTime.value += delta;
        lastTimestamp = now;
      }
      timerId = setTimeout(tick, 1000);
    }
  };

  // Alterna entre pausar e retomar o timer
  const togglePause = () => {
    if (isRunning.value) {
      if (isPaused.value) {
        isPaused.value = false;
        lastTimestamp = Date.now();
        tick();
      } else {
        isPaused.value = true;
        clearTimeout(timerId);
      }
    }
  };

  // Para o timer e reseta o tempo para zero
  const stop = () => {
    isRunning.value = false;
    isPaused.value = false;
    clearTimeout(timerId);
    currentTime.value = 0;
  };

  // Função para definir o tempo inicial (em segundos)
  // Só permite alterar se o timer ainda não estiver rodando
  const setTime = (seconds) => {
    if (!isRunning.value) {
      currentTime.value = seconds;
    }
  };

  // Formata o tempo para o formato HH:MM:SS
  const formattedTime = computed(() => {
    const totalSeconds = currentTime.value;
    const sec = totalSeconds % 60;
    const min = Math.floor(totalSeconds / 60) % 60;
    const hr = Math.floor(totalSeconds / 3600);
    return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  });

  return {
    isRunning,
    isPaused,
    currentTime,
    start,
    togglePause,
    stop,
    setTime,
    formattedTime,
  };
});
