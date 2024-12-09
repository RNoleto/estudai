<script setup>
import { computed } from 'vue';
import { useTimeFormatter } from '../composables/useTimeFormatter';
import { useUserStore } from '../stores/useUserStore';

const { formatStudyTime } = useTimeFormatter();
const userStore = useUserStore();

// Calcular o total de tempo de estudo
const totalStudyTime = computed(() => {
  return userStore.userStudyRecords.reduce((sum, record) => sum + record.study_time, 0);
});
</script>

<template>
    <div class="flex  flex-col justify-center bg-white shadow-md rounded-lg text-center p-4 gap-4">
      <h2 class="text-2xl font-bold text-gray-800">Tempo Total de Estudo</h2>
      <p class="text-4xl font-extrabold text-blue-600">
        {{ formatStudyTime(totalStudyTime) }}
      </p>
      <p class="text-sm text-gray-600">Parabéns pelo progresso!</p>
    </div>
</template>
