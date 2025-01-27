<script setup>
import { computed, onMounted } from 'vue';
import ReusableSwiper from '../components/ui/ReusableSwiper.vue';


import { useCareerStore } from '../stores/useCareerStore';

const careersStore = useCareerStore();

onMounted(async () => {
  await careersStore.fetchCareers();  
  // Ordenar as carreiras por ordem alfabética
  careersStore.careers.sort((a, b) => a.name.localeCompare(b.name));
});

const filteredCareers = computed(() => {
  if (!searchTerm.value) return careersStore.careers;
  return careersStore.careers.filter((career) =>
    career.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const slides = [
  'Slide 1 - Bem-vindo',
  'Slide 2 - Aprenda Vue',
  'Slide 3 - Explore Tailwind',
];
</script>

<template>
  <div class="flex flex-col items-center ">
    <h1 class="text-2xl font-bold mb-4">Swiper Reutilizável</h1>
    <ReusableSwiper :slides="slides" direction="horizontal" :autoplay="true" :navigation="false" :pagination="false" />
  </div>
</template>