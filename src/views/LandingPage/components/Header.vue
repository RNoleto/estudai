<template>
  <header class="bg-white shadow fixed w-full z-10">
    <!-- Container principal -->
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo e Nome do Site -->
      <div class="flex items-center">
        <!-- Substitua o src pelo caminho do seu logo -->
        <!-- <img src="/logo.svg" alt="Estuday" class="w-8 h-8 mr-2" /> -->
        <span class="font-bold text-xl text-primary">Estuday</span>
      </div>
      <!-- Navegação para telas médias e maiores -->
      <nav class="hidden items-center md:flex space-x-6">
        <a href="#hero" class="text-gray-700 hover:text-primary">Home</a>
        <a href="#demonstration" class="text-gray-700 hover:text-primary">Funcionalidades</a>
        <a href="#prints-showcase" class="text-gray-700 hover:text-primary">Galeria</a>
        <a href="#testimonials" class="text-gray-700 hover:text-primary">Comentários</a>
        <a href="#signatures" class="text-gray-700 hover:text-primary">Planos</a>
        <a href="#faq" class="text-gray-700 hover:text-primary">FAQ</a>
        <a href="/" class="bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-baseGreen transition duration-300">Cadastre-se</a>
        <!-- <a href="#contato" class="text-gray-700 hover:text-primary">Contato</a> -->
      </nav>
      <!-- Botão para mobile (hamburger menu) -->
      <button @click="toggleMenu" class="md:hidden focus:outline-none transition" aria-label="Abrir menu de navegação">
        <svg v-if="!isOpen" class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <!-- Menu Mobile com Transição -->
    <transition name="slide-fade">
      <div v-if="isOpen" class="md:hidden">
        <nav class="px-4 pt-2 pb-4 space-y-1 bg-white">
          <a @click="closeMenu" href="#hero" class="block text-gray-700 hover:text-primary">Home</a>
          <a @click="closeMenu" href="#demonstration" class="block text-gray-700 hover:text-primary">Funcionalidades</a>
          <a @click="closeMenu" href="#prints-showcase" class="block text-gray-700 hover:text-primary">Galeria</a>
          <a @click="closeMenu" href="#testimonials" class="block text-gray-700 hover:text-primary">Comentários</a>
          <a @click="closeMenu" href="#signatures" class="block text-gray-700 hover:text-primary">Planos</a>
          <a @click="closeMenu" href="#faq" class="block text-gray-700 hover:text-primary">FAQ</a>
          <a @click="closeMenu" href="/" class="text-baseGreen font-semibold hover:text-hoverGreen transition duration-300">Cadastre-se</a>
          <!-- <a @click="closeMenu" href="#contato" class="block text-gray-700 hover:text-primary">Contato</a> -->
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}
</script>

<style scoped>
/* Transição personalizada para o menu mobile */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
