<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { UserButton, useUser } from 'vue-clerk';

const { user } = useUser();

const route = useRoute();

const isMobileView = computed(() => window.innerWidth <= 490);
const isMenuMobileOpen = ref(false);

const toggleMenu = () => {
  isMenuMobileOpen.value = !isMenuMobileOpen.value
}

const userStore = useUserStore();

// Estado para controlar se a sidebar está recolhida ou expandida
const isSidebarCollapsed = ref(false);

// Estados para controlar a abertura dos menus colapsáveis
const isMenu1Open = ref(false);
const isMenu2Open = ref(false);

const isMenu3Open = ref(false);

// Funções para alternar os estados dos menus
const toggleMenu1 = () => (isMenu1Open.value = !isMenu1Open.value);
const toggleMenu2 = () => (isMenu2Open.value = !isMenu2Open.value);
const toggleMenu3 = () => (isMenu3Open.value = !isMenu3Open.value);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

onMounted(async () => {
  await userStore.checkUserCareer();
});
</script>

<template>
  <div class="grid bg-gray-100 sm:flex">
    <!-- navbar mobile -->
    <nav v-if="isMobileView"
      class="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-zinc-500 shadow-sm z-50 flex items-center justify-between p-4">
      <p class="font-bold text-lg">Estudaí</p>
      <button @click="toggleMenu" class="text-xl p-2 rounded focus:outline-none">
        <i :class="isMenuMobileOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </nav>
    <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-40">
        <transition name="fade-slide" mode="out-in" appear>
        <div
          class="fixed top-0 right-0 h-screen bg-zinc-100 z-10 flex flex-col justify-start pt-16 gap-2 mt-10 px-6">
          <a href="/area-do-aluno" class="flex items-center gap-2 text-gray-700 text-lg  font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fas fa-home"></i>
            Home
          </a>
          <a href="/area-do-aluno/historico-de-estudos"
            class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fa-solid fa-pen-clip"></i>
            Histórico de Estudo
          </a>
          <a href="/area-do-aluno/estudar" class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fa-solid fa-stopwatch"></i>
            Estudar
          </a>
          <div>
            <button @click="toggleMenu3" class="flex items-center gap-2 text-gray-700 text-lg  font-semibold p-2 rounded-xl hover:bg-blue-100">
              <div>
                <i class="fas fa-cog"></i>
                Configurações
              </div>
            </button>
            <transition name="fade-slide" mode="out-in" appear>
              <div v-if="isMenu3Open" class="text-zinc-700 mt-1 ml-8 flex flex-col gap-2">
                <a href="/area-do-aluno/carreiras" class="flex items-center  gap-1 text-sm hover:text-blue-800">
                  Minha Carreira
                </a>
                <a href="/area-do-aluno/materias" class="flex items-center gap-1 text-sm hover:text-blue-800">
                  Minhas Matérias
                </a>
              </div>
            </transition>
          </div>
          <!-- <a href="/area-do-aluno/configuracoes" class="flex items-center gap-2 text-gray-700 text-lg  font-semibold  p-2 rounded-xlhover:bg-blue-100">
            <i class="fas fa-cog"></i>
            Configurações
          </a> -->
          <div class="bottom-10 right-4 fixed">
            <div class="flex items-center gap-2">
              <p class="text-gray-700 text-lg font-semibold">{{ user.fullName }}</p>
              <UserButton/>
            </div>
          </div>      
        </div>
      </transition>
      </div>
    <!-- Sidebar desktop -->
    <aside v-if="!isMobileView" :class="[
      'min-h-screen bg-white shadow-md transition-all duration-300',
      isSidebarCollapsed ? 'w-18' : 'w-60'
    ]">
      <div class="p-4 text-lg font-bold border-b flex justify-between items-center">
        <span v-if="!isSidebarCollapsed">Área do Aluno</span>
        <button @click="toggleSidebar" class="p-2 text-gray-700 hover:bg-gray-200 rounded">
          <i :class="isSidebarCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
        </button>
      </div>
      <nav class="flex flex-col gap-1 " :class="isSidebarCollapsed ? 'p-1' : 'p-2'">
        <!-- Home da Dashboard -->
        <div>
          <a href="/area-do-aluno" :class="[
            'flex items-center gap-2 px-4 py-2 mt-4 rounded',
            route.path === '/area-do-aluno' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          ]">
            <i class="fas fa-home"></i>
            <span v-if="!isSidebarCollapsed">Home</span>
          </a>
        </div>
        <!-- Historico de Estudos -->
        <div>
          <a href="/area-do-aluno/historico-de-estudos"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded',
              route.path === '/area-do-aluno/historico-de-estudos' ? 'bg--blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
            <i class="fa-solid fa-pen-clip"></i>
            <span v-if="!isSidebarCollapsed">Histórico de Estudo</span>
          </a>
        </div>
        <!-- Estudar da Dashboard -->
        <div>
          <a href="/area-do-aluno/estudar" :class="[
            'flex items-center gap-2 px-4 py-2 rounded',
            route.path === '/area-do-aluno/estudar' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          ]">
            <i class="fa-solid fa-stopwatch"></i>
            <span v-if="!isSidebarCollapsed">Estudar</span>
          </a>
        </div>
        <!-- Menu Principal 1 -->
        <!-- <div>
            <button @click="toggleMenu1"
              class="flex gap-1 items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-brain"></i>
                <span v-if="!isSidebarCollapsed">Menu 1</span>
              </div>
              <i class="fas" :class="[isMenu1Open ? 'fa-chevron-up' : 'fa-chevron-down', isSidebarCollapsed ? 'mini' : 'text-base']"></i>
            </button>
            <div v-if="isMenu1Open" :class="['mt-2 space-y-2 transition-all duration-300', isSidebarCollapsed ? 'absolute left-16 bg-white shadow-lg w-48' : 'pl-8']">
              <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
              <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
            </div>
          </div> -->

        <!-- Menu Principal 2 -->
        <!-- <div class="mt-4">
            <button @click="toggleMenu2"
              class="flex gap-1 items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
              <div class="flex items-center gap-2">
                <i class="fas fa-chart-bar"></i>
                <span v-if="!isSidebarCollapsed">Relatórios</span>
              </div>
              <i class="fas" :class="[isMenu2Open ? 'fa-chevron-up' : 'fa-chevron-down', isSidebarCollapsed ? 'mini' : 'text-base']"></i>
            </button>
            <div v-if="isMenu2Open" :class="['mt-2 space-y-2 transition-all duration-300', isSidebarCollapsed ? 'absolute left-16 bg-white shadow-lg w-48' : 'pl-8']">
              <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
              <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
            </div>
          </div>   -->
        <!-- Menu de Configuração -->
        <div class="">
          <button @click="toggleMenu3"
            class="flex gap-1 items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded">
            <div class="flex items-center gap-2">
              <i class="fas fa-cog"></i>
              <span v-if="!isSidebarCollapsed">Configurações</span>
            </div>
            <i class="fas"
              :class="[isMenu3Open ? 'fa-chevron-up' : 'fa-chevron-down', isSidebarCollapsed ? 'mini' : 'text-base']"></i>
          </button>
            <div v-if="isMenu3Open"
              :class="['mt-1 space-y-2 transition-all duration-300', isSidebarCollapsed ? 'absolute z-10 rounded-md left-16 bg-zinc-50 shadow-lg w-48 p-2' : 'pl-8']">
              <a href="/area-do-aluno/carreiras"
                class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i
                  class="fa-solid fa-user-astronaut"></i> Minha Carreira</a>
              <a href="/area-do-aluno/materias"
                class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i class="fa-solid fa-book"></i>
                Minhas Matérias</a>
              <!-- <a href="/area-do-aluno/ciclo-de-estudos" class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i class="fa-solid fa-arrows-spin"></i> Meu Ciclo de Estudo</a> -->
              <!-- <a href="#" class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i class="fa-solid fa-crosshairs"></i> Meus Objetivos</a> -->
            </div>
        </div>
      </nav>
    </aside>
    <!-- Conteúdo Principal -->
    <main class="flex-1 p-2 mt-6 sm:p-6 sm:mt-0">
      <!-- Conteudo a ser carregado na página -->
      <router-view />
    </main>
  </div>
</template>
<style>
/* Estilo para a transição */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translatex(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

</style>