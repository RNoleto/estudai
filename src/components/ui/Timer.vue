<script setup>
import { ref } from 'vue';
import { useTimerStore } from '../../stores/useTimerStore';
import Button from './Button.vue';

const isFocusMode = ref(false); // Controle do modo focus

const timerStore = useTimerStore();


const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  }
});

const enterFocusMode = () => {
  isFocusMode.value = true;
  document.body.style.overflow = 'hidden'; // Desabilita rolagem da página
};

const emit = defineEmits(['timerStopped', 'openFocus']);

const stopTimer = () => {
  timerStore.stop();
  emit('timerStopped');
  if (isFocusMode.value === true) {
    isFocusMode.value = false;
  }
};

const exitFocusMode = () => {
  isFocusMode.value = false;
  document.body.style.overflow = ''; // Restaura rolagem da página
};
</script>

<template>
  <div class="relative flex flex-col rounded-2xl bg-white shadow-md p-4"
    :class="['timer', isFocusMode ? 'focus-mode' : '']">
    <div @click="!props.isDisabled && enterFocusMode()" class="absolute right-4 text-sm p-1 cursor-pointer"
      :class="{ 'cursor-not-allowed text-gray-400': props.isDisabled }">
      <i class="fa-solid fa-arrows-to-circle"></i>
    </div>
    <div class="flex flex-col items-center gap-1 py-4 sm:gap-6">
      <h2 class="w-full text-xl text-center border-zinc-100 sm:text-2xl sm:font-semibold">Temporizador</h2>
      <div class="font-mono text-6xl">{{ timerStore.formattedTime }}</div>
      <div class="flex space-x-2">
        <Button variant="play" @click="timerStore.isRunning ? timerStore.togglePause() : timerStore.start()" :disabled="props.isDisabled">
            {{ timerStore.isRunning ? (timerStore.isPaused ? 'Continuar' : 'Pausar') : 'Iniciar' }}
          </Button>
        <!-- <Button @click="timerStore.togglePause" variant="secondary" :disabled="!timerStore.isRunning">
          {{ timerStore.isPaused ? 'Continuar' : 'Pausar' }}
        </Button> -->
        <Button @click="stopTimer" variant="delete" :disabled="!timerStore.isRunning">Parar</Button>
      </div>
    </div>
    <!-- Modo Focus -->
    <div v-if="isFocusMode" class="focus-overlay z-50 backdrop-blur-sm">
      <div @click="exitFocusMode"
        class="absolute top-[90px] right-4 p-3 sm:top-4 sm:right-4 text-white text-2xl hover:text-blue-500">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="text-center text-white">
        <div class="text-6xl sm:text-8xl font-mono mb-8">
          {{ timerStore.formattedTime }}
        </div>
        <div class="flex justify-between space-x-2">
          <Button @click="timerStore.isRunning ? timerStore.togglePause() : timerStore.start()"
             :disabled="props.isDisabled" variant="play">
            {{ timerStore.isRunning ? (timerStore.isPaused ? 'Continuar' : 'Pausar') : 'Iniciar' }}
          </Button>
          <Button @click="stopTimer" variant="delete"
            :disabled="!timerStore.isRunning">Parar</Button>
        </div>
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

.focus-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
