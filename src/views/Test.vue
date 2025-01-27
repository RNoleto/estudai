<script setup>
import { computed, onMounted } from 'vue';
import ReusableSwiper from '../components/ui/ReusableSwiper.vue';

import { useCareerStore } from '../stores/useCareerStore';

const careersStore = useCareerStore();

// Carregar as carreiras e ordená-las
onMounted(async () => {
  await careersStore.fetchCareers();  
  // Ordenar as carreiras por ordem alfabética
  careersStore.careers.sort((a, b) => a.name.localeCompare(b.name));
});

// Computed para gerar os slides dinamicamente com base nas carreiras
const slides = computed(() => {
  return careersStore.careers.map((career) => `${career.name}`);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Swiper Reutilizável</h1>
    <!-- Passando os slides dinamicamente para o ReusableSwiper -->
    <!-- <ReusableSwiper :slides="slides" direction="horizontal" :autoplay="true" :navigation="true" :pagination="true" :loop="true"/> -->

    <div class="mt-4">
      <ReusableSwiper :slides="slides" direction="vertical" :loop="false" :pagination="false" :navigation="false"/>    
    </div>
  </div>
</template>