<script setup>
import ReusableSwiper from '../components/ui/ReusableSwiper.vue';

const slides = [
  'Slide 1 - Bem-vindo',
  'Slide 2 - Aprenda Vue',
  'Slide 3 - Explore Tailwind',
];
</script>

<template>
  <div class="flex flex-col items-center ">
    <h1 class="text-2xl font-bold mb-4">Swiper Reutilizável</h1>
    <ReusableSwiper :slides="slides" direction="horizontal" :autoplay="false" :navigation="false" />
  </div>
</template>