<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goToLogin() {
  router.push('/');
}
</script>

<template>
    <section class="bg-gradient-to-r from-primary to-secondary py-16 text-white" id="hero">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-extrabold mb-4">
          Transforme Seu Estudo com Inteligência Artificial
        </h1>
        <p class="text-lg md:text-2xl mb-8">
          Gerencie seu tempo, acompanhe seu progresso e melhore seu desempenho com insights personalizados.
        </p>
        <button
            @click="goToLogin"
            class="bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-baseGreen transition duration-300"
        >
          Comece Agora - É Grátis!
        </button>
      </div>
    </section>
  </template>
  
  <style scoped>
  /* Se precisar de ajustes adicionais, insira-os aqui */
  </style>
  