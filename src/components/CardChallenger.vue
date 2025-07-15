<script setup>
defineProps({
    title: {
        type: String,
        required: true,
        default: "Desafio de Estudo",
    },
    icon: {
        type: String,
        required: false,
        default: "fa-solid fa-bullseye",
    },
    progress: {
        type: Number,
        required: false,
        default: 0,
    }
});
</script>

<template>
  <div class="flex flex-col p-3 bg-white shadow-md rounded-2xl border border-secondary relative min-h-[150px] sm:min-h-[180px]">
    <!-- Selo de missão concluída -->
    <div v-if="progress >= 100" class="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm">
      Concluída
    </div>
    <div class="flex flex-col items-center gap-2 flex-1 justify-center">
      <i :class="icon" class="text-2xl sm:text-3xl text-baseBlue"></i>
      <p class="text-sm sm:text-base font-medium text-gray-700">{{ title }}</p>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div class="bg-baseBlue h-2 rounded-full transition-all duration-500" :style="{ width: Math.min(progress, 100) + '%' }"></div>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ progress.toFixed(2) }}%</p>
    </div>
  </div>
</template>