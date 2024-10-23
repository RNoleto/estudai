<template>
    <div class="flex flex-col items-center p-4 border rounded shadow-md bg-white">
        <h2 class="text-lg font-bold mb-4">Temporizador</h2>
        <div class="text-2xl font-mono mb-4">{{ formattedTime }}</div>
        <div class="flex space-x-2">
            <button @click="start" class="btn" :disabled="isRunning">Iniciar</button>
            <button @click="togglePause" class="btn" :disabled="!isRunning">{{ isPaused ? 'Continuar' : 'Pausar' }}</button>
            <button @click="stop" class="btn">Parar</button>
        </div>

        <div class="mt-4">
            <h3 class="text-md font-bold">Pausas:</h3>
            <ul>
                <li v-for="(pause, index) in pauses" :key="index">
                    {{ index + 1 }}ª Pausa - {{ formatPauseTime(pause) }}
                </li>
            </ul>
            <div class="mt-2">
                <strong>Total de pausas: {{ pauses.length }}</strong>
            </div>
            <div>
                <strong>Tempo total de pausa: {{ formatPauseTime(totalPauseTime) }}</strong>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isRunning = ref(false);
const isPaused = ref(false);
const elapsedTime = ref(0);
const pauses = ref([]); // Array para armazenar os tempos de pausa
let timerId = null; // ID do temporizador
let pauseStartTime = 0; // Tempo em que a pausa começou
let lastPauseDuration = 0; // Duração da última pausa

const start = () => {
    if (!isRunning.value) {
        isRunning.value = true;
        isPaused.value = false;

        timerId = setInterval(() => {
            elapsedTime.value += 1;
        }, 1000);
    }
};

const togglePause = () => {
    if (isRunning.value) {
        if (isPaused.value) {
            // Se está pausado, despausar
            isPaused.value = false;
            lastPauseDuration = elapsedTime.value; // Registra o tempo em que despausou

            timerId = setInterval(() => {
                elapsedTime.value += 1;
            }, 1000);
        } else {
            // Se está rodando, pausar
            clearInterval(timerId);
            isPaused.value = true;
            pauses.value.push(elapsedTime.value - lastPauseDuration); // Adiciona a duração da pausa
        }
    }
};

const stop = () => {
    clearInterval(timerId);
    isRunning.value = false;
    isPaused.value = false;
    elapsedTime.value = 0;
    pauses.value = []; // Reseta as pausas ao parar
};

const formattedTime = computed(() => {
    const seconds = elapsedTime.value % 60;
    const minutes = Math.floor(elapsedTime.value / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Função para formatar o tempo de pausa
const formatPauseTime = (pauseTime) => {
    const seconds = pauseTime % 60;
    const minutes = Math.floor(pauseTime / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Calcula o tempo total de pausa
const totalPauseTime = computed(() => {
    return pauses.value.reduce((total, pause) => total + pause, 0);
});
</script>

<style scoped>
.btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
    &:disabled {
        @apply bg-gray-400 cursor-not-allowed;
    }
}
</style>
