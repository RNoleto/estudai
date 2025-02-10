<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';
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
  <div class="grid bg-gray-100 text-gray-700 sm:flex">
    <!-- navbar mobile -->
    <nav v-if="isMobileView"
      class="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-zinc-500 shadow-sm z-50 flex items-center justify-between p-4">
      <p class="font-bold text-lg">Gerenciamento de Estudo</p>
      <button @click="toggleMenu" class="text-xl p-2 rounded focus:outline-none">
        <i :class="isMenuMobileOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </nav>
    <!-- Menu mobile -->
    <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-40">
      <transition name="fade-slide" mode="out-in" appear>
        <div class="fixed top-0 right-0 h-screen bg-zinc-100 z-10 flex flex-col justify-start pt-16 gap-2 mt-10 px-6">
          <a href="/area-do-aluno"
            class="flex items-center gap-2 text-gray-700 text-lg  font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fas fa-home"></i>
            Home
          </a>
          <a href="/area-do-aluno/historico-de-estudos"
            class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fa-solid fa-pen-clip"></i>
            Histórico de Estudo
          </a>
          <a href="/area-do-aluno/estudar"
            class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fa-solid fa-stopwatch"></i>
            Estudar
          </a>
          <div>
            <button @click="toggleMenu3"
              class="flex items-center gap-2 text-gray-700 text-lg  font-semibold p-2 rounded-xl hover:bg-blue-100">
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
          <a href="/area-do-aluno/planos"
            class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <i class="fa-solid fa-file-signature"></i>
            Planos
          </a>
          <!-- <a href="/area-do-aluno/configuracoes" class="flex items-center gap-2 text-gray-700 text-lg  font-semibold  p-2 rounded-xlhover:bg-blue-100">
            <i class="fas fa-cog"></i>
            Configurações
          </a> -->
          <div class="bottom-10 right-4 fixed">
            <div class="flex items-center gap-2">
              <p class="text-gray-700 text-lg font-semibold">{{ user.fullName }}</p>
              <UserButton />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- Sidebar desktop -->
    <aside v-if="!isMobileView" :class="[
      'min-h-screen bg-white shadow-md transition-all duration-300 text-sm',
      isSidebarCollapsed ? 'w-18' : 'w-60'
    ]">
      <div class="p-4 text-lg text-gray-700 font-bold border-b flex justify-between items-center">
        <span v-if="!isSidebarCollapsed">Área do Aluno</span>
        <button @click="toggleSidebar" class="p-2 text-[#21BFCA] hover:bg-gray-200 rounded">
          <i :class="isSidebarCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
        </button>
      </div>
      <nav class="flex flex-col gap-1 " :class="isSidebarCollapsed ? 'p-1' : 'p-2'">
        <!-- Home da Dashboard -->
        <div>
          <a href="/area-do-aluno" :class="[
            'flex items-center gap-2 px-4 py-2 mt-4 rounded-lg hover:shadow-md',
            route.path === '/area-do-aluno'
              ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          ]">
            <i :class="[
              'fas fa-home',
              route.path === '/area-do-aluno' ? 'text-[#3E73ED]' : 'text-[#21BFCA] hover:text-gray-500'
            ]"></i>
            <span v-if="!isSidebarCollapsed">Home</span>
          </a>
        </div>
        <!-- Historico de Estudos -->
        <div>
          <a href="/area-do-aluno/historico-de-estudos"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/historico-de-estudos' 
              ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
              ]">
            <i :class="[
              'fa-solid fa-pen-clip',
              route.path === '/area-do-aluno/historico-de-estudos' 
              ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' 
              : 'text-[#21BFCA] hover:text-gray-500'
              ]"></i>
            <span v-if="!isSidebarCollapsed">Histórico de Estudo</span>
          </a>
        </div>
        <!-- Estudar da Dashboard -->
        <div>
          <a href="/area-do-aluno/estudar" :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
            route.path === '/area-do-aluno/estudar' ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          ]">
            <i :class="[
              'fa-solid fa-stopwatch',
              route.path === '/area-do-aluno/estudar'
              ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm'
              : 'text-[#21BFCA] hover:text-gray-500'
              ]"></i>
            <span v-if="!isSidebarCollapsed">Estudar</span>
          </a>
        </div>
        <!-- Planos da Dashboard -->
        <div>
          <a href="/area-do-aluno/planos" :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
            route.path === '/area-do-aluno/planos' ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          ]">
            <i :class="['fa-solid fa-file-signature',
              route.path === '/area-do-aluno/planos'
              ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' 
              : 'text-[#21BFCA] hover:text-gray-500'
            ]"></i>
            <span v-if="!isSidebarCollapsed">Planos</span>
          </a>
        </div>
        <!-- Menu de Configuração -->
        <div>
          <button @click="toggleMenu3"
            :class="[
              'flex gap-1 items-center justify-between w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
              ]">
            <div class="flex items-center gap-2">
              <i :class="['fas fa-cog',
              route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                ? 'bg-[#AFEBEF] text-[#3E73ED] shadow-sm' 
                : 'text-[#21BFCA] hover:text-gray-100'
              ]"></i>
              <span v-if="!isSidebarCollapsed">Configurações</span>
            </div>
            <i class="text-xs text-[#21BFCA] fas"
              :class="[isMenu3Open ? 'fa-chevron-up' : 'fa-chevron-down', isSidebarCollapsed ? 'mini' : 'text-base']"></i>
          </button>
          <div v-if="isMenu3Open"
            :class="['mt-1 space-y-2 transition-all duration-300', isSidebarCollapsed ? 'absolute z-10 rounded-md left-16 bg-zinc-50 shadow-lg w-48 p-2' : 'pl-8']">
            <a href="/area-do-aluno/carreiras"
              class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i
                class="fa-solid fa-user-astronaut text-[#21BFCA]"></i> Minha Carreira</a>
            <a href="/area-do-aluno/materias"
              class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i
                class="fa-solid fa-book text-[#21BFCA]"></i>
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
.fade-slide-enter-active,
.fade-slide-leave-active {
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