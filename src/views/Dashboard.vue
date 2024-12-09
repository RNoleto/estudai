<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { Icon } from '@iconify/vue';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.checkUserCareer();
});

// Estados para controlar a abertura dos menus colapsáveis
const isMenu1Open = ref(false);
const isMenu2Open = ref(false);
const isMenu3Open = ref(false);

// Funções para alternar os estados dos menus
const toggleMenu1 = () => (isMenu1Open.value = !isMenu1Open.value);
const toggleMenu2 = () => (isMenu2Open.value = !isMenu2Open.value);
const toggleMenu3 = () => (isMenu3Open.value = !isMenu3Open.value);
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-4 text-lg font-bold border-b">Área do Aluno</div>
      <nav class="p-4">
        <!-- Home da Dashboard -->
        <div>
          <a href="/area-do-aluno"
          class="flex items-center gap-2 px-4 py-2 mt-4 text-gray-700 hover:bg-gray-100 rounded">
          <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
        </div>
        <!-- Estudar da Dashboard -->
        <div>
          <a href="/area-do-aluno/estudar"
            class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
            <i class="fa-solid fa-stopwatch"></i>
            <span>Estudar</span>
          </a>
        </div>
        <!-- Menu Principal 1 -->
        <div>
          <button @click="toggleMenu1"
            class="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-brain"></i>
              <span>Menu 1</span>
            </div>
            <i class="fas" :class="isMenu1Open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div v-if="isMenu1Open" class="pl-8 mt-2 space-y-2">
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
          </div>
        </div>

        <!-- Menu Principal 2 -->
        <div class="mt-4">
          <button @click="toggleMenu2"
            class="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
            <div class="flex items-center gap-2">
              <i class="fas fa-chart-bar"></i>
              <span>Relatórios</span>
            </div>
            <i class="fas" :class="isMenu2Open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div v-if="isMenu2Open" class="pl-8 mt-2 space-y-2">
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
          </div>
        </div>

        <!-- Menu de Configuração -->
        <div class="mt-4">
          <button @click="toggleMenu3"
            class="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
            <div class="flex items-center gap-2">
              <i class="fas fa-cog"></i>
              <span>Configurações</span>
            </div>
            <i class="fas" :class="isMenu3Open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div v-if="isMenu3Open" class="pl-8 mt-2 space-y-2">
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Minha Carreira</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Minhas Matérias</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Meu Ciclo de Estudo</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900"><i class="fa-solid fa-crosshairs"></i> Meus Objetivos</a>
          </div>
        </div>
      </nav>
    </aside>
    <!-- Conteúdo Principal -->
    <main class="flex-1 p-6">
      <!-- Conteudo a ser carregado na página -->
      <router-view />
    </main>
  </div>
</template>
