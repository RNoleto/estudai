<template>
  <header class="bg-white shadow fixed w-full z-20">
    <!-- Overlay escuro para menu mobile -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 md:hidden z-10" @click="closeMenu"></div>
    </transition>
    <!-- Container principal -->
    <div class="container mx-auto px-4 py-4 flex items-center justify-between relative z-20">
      <!-- Logo e Nome do Site -->
      <div class="flex items-center">
        <!-- <img src="/logo.svg" alt="Estuday" class="w-10 h-10 mr-2" /> -->
        <span class="font-bold text-2xl text-primary">Estuday</span>
      </div>
      <!-- Navegação para telas médias e maiores -->
      <nav class="hidden items-center md:flex space-x-6">
        <a href="#hero" class="text-gray-700 hover:text-primary">Home</a>
        <a href="#demonstration" class="text-gray-700 hover:text-primary">Funcionalidades</a>
        <a href="#prints-showcase" class="text-gray-700 hover:text-primary">Galeria</a>
        <a href="#testimonials" class="text-gray-700 hover:text-primary">Comentários</a>
        <a href="#faq" class="text-gray-700 hover:text-primary">FAQ</a>
        <a href="/login" class="bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-baseGreen transition duration-300">Cadastre-se</a>
      </nav>
      <!-- Botão para mobile (hamburger menu) -->
      <button @click="toggleMenu" class="md:hidden focus:outline-none transition" aria-label="Abrir menu de navegação">
        <svg v-if="!isOpen" class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <svg v-else class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <!-- Menu Mobile com Transição -->
    <transition name="slide-fade">
      <div v-if="isOpen" class="md:hidden fixed top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-lg z-20 flex flex-col pt-8 px-6 animate-slideIn">
        <nav class="flex flex-col gap-3 mt-4">
          <a @click="closeMenu" href="#hero" class="block text-lg text-gray-800 font-medium hover:text-primary py-2 px-2 rounded transition">Home</a>
          <a @click="closeMenu" href="#demonstration" class="block text-lg text-gray-800 font-medium hover:text-primary py-2 px-2 rounded transition">Funcionalidades</a>
          <a @click="closeMenu" href="#prints-showcase" class="block text-lg text-gray-800 font-medium hover:text-primary py-2 px-2 rounded transition">Galeria</a>
          <a @click="closeMenu" href="#testimonials" class="block text-lg text-gray-800 font-medium hover:text-primary py-2 px-2 rounded transition">Comentários</a>
          <a @click="closeMenu" href="#faq" class="block text-lg text-gray-800 font-medium hover:text-primary py-2 px-2 rounded transition">FAQ</a>
          <a @click="closeMenu" href="/login" class="block bg-primary text-white text-lg font-semibold py-2 px-4 rounded-full shadow hover:bg-baseGreen transition duration-300 mt-2 text-center">Cadastre-se</a>
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
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 767px) {
  header {
    padding-bottom: 0;
  }
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
