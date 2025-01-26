// src/stores/useTimerStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  const isRunning = ref(false);
  const isPaused = ref(false);
  const elapsedTime = ref(0);
  const pauses = ref([]);
  const finalElapsedTime = ref(0);
  const finalTotalPauseTime = ref(0);
  const finalTotalPausesLength = ref(0);
  let timerId = null;
  let lastPauseDuration = 0;
  let lastTimestamp = null;

  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      isPaused.value = false;
      lastTimestamp = Date.now();

      const tick = () => {
        if (!isPaused.value && isRunning.value) {
          const now = Date.now();
          elapsedTime.value += Math.floor((now - lastTimestamp) / 1000);
          lastTimestamp = now;
          timerId = setTimeout(tick, 1000);
        }
      };

      tick();
    }
  };

  const togglePause = () => {
    if (isRunning.value) {
      if (isPaused.value) {
        isPaused.value = false;
        lastTimestamp = Date.now();
        const tick = () => {
          if (!isPaused.value && isRunning.value) {
            const now = Date.now();
            elapsedTime.value += Math.floor((now - lastTimestamp) / 1000);
            lastTimestamp = now;
            timerId = setTimeout(tick, 1000);
          }
        };

        tick();
      } else {
        isPaused.value = true;
        clearTimeout(timerId);
        pauses.value.push(elapsedTime.value - lastPauseDuration);
        lastPauseDuration = elapsedTime.value;
      }
    }
  };

  const stop = () => {
    finalElapsedTime.value = elapsedTime.value;
    finalTotalPauseTime.value = totalPauseTime.value;
    finalTotalPausesLength.value = pauses.value.length;

    clearTimeout(timerId);
    isRunning.value = false;
    isPaused.value = false;

    elapsedTime.value = 0;
    pauses.value = [];
  };

  const formattedTime = computed(() => {
    const seconds = elapsedTime.value % 60;
    const minutes = Math.floor(elapsedTime.value / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const formatPauseTime = (pauseTime) => {
    const seconds = pauseTime % 60;
    const minutes = Math.floor(pauseTime / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const totalPauseTime = computed(() => {
    return pauses.value.reduce((total, pause) => total + pause, 0);
  });

  const finalFormattedTime = computed(() => formatPauseTime(finalElapsedTime.value));
  const finalFormattedPauseTime = computed(() => formatPauseTime(finalTotalPauseTime.value));

  return {
    isRunning,
    isPaused,
    elapsedTime,
    pauses,
    start,
    togglePause,
    stop,
    formattedTime,
    formatPauseTime,
    totalPauseTime,
    finalFormattedTime,
    finalFormattedPauseTime,
    finalTotalPausesLength,
    finalElapsedTime,
  };
});
