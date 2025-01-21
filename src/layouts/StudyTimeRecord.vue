<script setup>
import { computed, ref, onMounted } from 'vue';
import { useTimeFormatter } from '../composables/useTimeFormatter';
import { useUserStore } from '../stores/useUserStore';

import IsLoading from "../components/ui/IsLoading.vue"

const { formatStudyTime } = useTimeFormatter();
const userStore = useUserStore();

const isLoading = ref(true);

// Calcular o total de tempo de estudo
const totalStudyTime = computed(() => {
  return userStore.userStudyRecords.reduce((sum, record) => sum + record.study_time, 0);
});

onMounted(async () => {
  try {
    await userStore.fetchUserStudyRecords();
  } catch (error) {
    console.error("Erro ao carregar tempo de estudo:", error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <IsLoading v-if="isLoading" />    
  <div v-else>
    <div class="flex flex-col justify-center bg-white shadow-md rounded-lg text-center p-2 gap-2 sm:p-4 sm:gap-4 sm:min-h-[250px]">
      <h2 class="text-base sm:text-2xl font-bold text-gray-800">Tempo de Estudo</h2>
      <p class="text-base font-bold sm:text-4xl text-blue-600">
        {{ formatStudyTime(totalStudyTime) }}
      </p>
      <p class="text-xs text-gray-600">Acompanhe o seu progresso!</p>
    </div>
  </div>
</template>
