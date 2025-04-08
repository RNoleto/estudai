<script setup>
import { RouterView, useRoute, RouterLink } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { UserButton, useUser } from 'vue-clerk';

const { user } = useUser();
const route = useRoute();

const userStore = useUserStore();

const isMobileView = computed(() => window.innerWidth <= 490);
const isMenuMobileOpen = ref(false);

const toggleMenu = () => {
  isMenuMobileOpen.value = !isMenuMobileOpen.value
}


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
      <router-link to="/area-do-aluno">
        <p class="font-bold text-lg">Estuday</p>
      </router-link>
      <button @click="toggleMenu" class="text-xl p-2 rounded focus:outline-none">
        <i :class="isMenuMobileOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </nav>
    <!-- Menu mobile -->
    <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-40">
      <transition name="fade-slide" mode="out-in" appear>
        <div class="fixed top-0 right-0 h-screen bg-zinc-100 z-10 flex flex-col justify-start pt-16 gap-2 mt-10 px-6">
          <div class="flex items-center gap-2 text-gray-700 text-lg  font-semibold p-2 rounded-xl hover:bg-blue-100">
            <router-link to="/area-do-aluno">
              <i class="fas fa-home"></i>
              Home
            </router-link>
          </div>
          <div class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <router-link to="/area-do-aluno/historico-de-estudos">
              <i class="fa-solid fa-pen-clip"></i>
              Histórico de Estudo
            </router-link>
          </div>
          <div class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <router-link to="/area-do-aluno/estudar">
              <i class="fa-solid fa-stopwatch"></i>
              Estudar
            </router-link>
          </div>
          <div class="hidden flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100">
            <router-link to="/area-do-aluno/planos">
              <i class="fa-solid fa-file-signature"></i>
              Planos
            </router-link>
          </div>
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
                <router-link to="/area-do-aluno/carreiras" class="flex items-center  gap-1 text-sm hover:text-blue-800">
                  Minha Carreira
                </router-link>
                <router-link to="/area-do-aluno/materias" class="flex items-center gap-1 text-sm hover:text-blue-800">
                  Minhas Matérias
                </router-link>
              </div>
            </transition>
          </div>
          <!-- <router-link to="/area-do-aluno/configuracoes" class="flex items-center gap-2 text-gray-700 text-lg  font-semibold  p-2 rounded-xlhover:bg-blue-100">
            <i class="fas fa-cog"></i>
            Configurações
          </router-link> -->
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
    <div class="sm:min-h-screen p-1">
      <aside v-if="!isMobileView" :class="[
        'flex flex-col h-full rounded-lg border border-secondary bg-white shadow-md text-sm transition-[width] duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-[4.5rem]' : 'w-[15rem]'
      ]">
        <div class="p-4 text-lg text-gray-700 font-bold border-b border-secondary flex items-center" :class="[isSidebarCollapsed ? 'justify-center' : 'justify-between']">
          <span v-if="!isSidebarCollapsed" ><router-link to="/area-do-aluno">Estuday</router-link></span>
          <button @click="toggleSidebar" class="text-primary hover:bg-gray-200 rounded" :class="isSidebarCollapsed ? 'px-4' : 'px-2'" :aria-label="isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'">
            <i :class="isSidebarCollapsed ? 'fa-solid fa-caret-right' : 'fa-solid fa-caret-left'"></i>
          </button>
        </div>
        <nav class="flex flex-col h-full gap-1" :class="isSidebarCollapsed ? 'p-1 items-center' : 'p-2'">
          <!-- Home da Dashboard -->
          <div :class="[isSidebarCollapsed ? 'justify-center' : 'justify-between']">
            <router-link to="/area-do-aluno" :class="[
              'flex items-center gap-2 px-4 py-2 mt-4 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno'
                ? 'bg-secondary text-gray-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            ]">
              <i :class="[
                'fas fa-home',
                route.path === '/area-do-aluno' ? 'text-gray-700' : 'text-primary hover:text-gray-500'
              ]"></i>
              <span v-show="!isSidebarCollapsed" >
                Home
              </span>
            </router-link>
          </div>
          <!-- Estudar da Dashboard -->
          <div>
            <router-link to="/area-do-aluno/estudar" :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/estudar' ? 'bg-secondary text-gray-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            ]">
              <i :class="[
                'fa-solid fa-stopwatch',
                route.path === '/area-do-aluno/estudar'
                  ? 'bg-secondary text-gray-700 shadow-sm'
                  : 'text-primary hover:text-gray-500'
              ]"></i>
              <span v-if="!isSidebarCollapsed" >Estudar</span>
            </router-link>
          </div>
          <!-- Historico de Estudos -->
          <div>
            <router-link to="/area-do-aluno/historico-de-estudos" :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/historico-de-estudos'
                ? 'bg-secondary text-gray-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            ]">
              <i :class="[
                'fa-solid fa-pen-clip',
                route.path === '/area-do-aluno/historico-de-estudos'
                  ? 'bg-secondary text-gray-700 shadow-sm'
                  : 'text-primary hover:text-gray-500'
              ]"></i>
              <span v-if="!isSidebarCollapsed" >Histórico de Estudo</span>
            </router-link>
          </div>
          <!-- Planos da Dashboard -->
          <div class="hidden">
            <a href="/area-do-aluno/planos" :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/planos' ? 'bg-secondary text-gray-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            ]">
              <i :class="['fa-solid fa-file-signature',
                route.path === '/area-do-aluno/planos'
                  ? 'bg-secondary text-gray-700 shadow-sm'
                  : 'text-primary hover:text-gray-500'
              ]"></i>
              <span v-if="!isSidebarCollapsed" >Planos</span>
            </a>
          </div>
          <!-- Menu de Configuração -->
          <div>
            <button @click="toggleMenu3" :class="[
              'flex gap-1 items-center justify-between w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:shadow-md',
              route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                ? 'bg-secondary text-gray-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            ]">
              <div class="flex items-center gap-2">
                <i :class="['fas fa-cog',
                  route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                    ? 'text-gray-700'
                    : 'text-primary hover:text-gray-500'
                ]"></i>
                <span v-if="!isSidebarCollapsed" :class="[
                  route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                    ? 'text-gray-700' : 'text-gray-700 hover:bg-gray-100'
                ]" >Configurações</span>
              </div>
              <i v-if="!isSidebarCollapsed" class="text-xs text-primary fas" :class="[isMenu3Open ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down', isSidebarCollapsed ? 'text-xs' : 'text-base',
              route.path === '/area-do-aluno/carreiras' || route.path === '/area-do-aluno/materias'
                ? 'text-gray-700'
                : 'text-primary hover:text-gray-100'
              ]"></i>
            </button>
            <div v-if="isMenu3Open"
              :class="['mt-1 space-y-2 transition-all duration-300', isSidebarCollapsed ? 'absolute z-20 rounded-xl left-10 bg-gray-50 border border-secondary shadow-lg w-48 p-2' : 'pl-8']">
              <router-link to="/area-do-aluno/carreiras"
                class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i
                  class="fa-solid fa-user-astronaut text-primary"></i> Minha Carreira</router-link>
              <router-link to="/area-do-aluno/materias"
                class="flex gap-2 items-center text-sm text-gray-600 hover:text-gray-900"><i
                  class="fa-solid fa-book text-primary"></i>
                Minhas Matérias</router-link>
            </div>
          </div>
          <div class="mt-auto bg-secondary p-2 rounded-lg w-full shadow-md">
            <div class="flex items-center gap-2" :class="isSidebarCollapsed ? 'justify-center' : ''">
              <UserButton />
              <p v-if="!isSidebarCollapsed" class="text-gray-700 text-sm font-medium">{{ user.fullName }}</p>
            </div>
          </div>
        </nav>
      </aside>
    </div>
    <!-- Conteúdo Principal -->
    <main class="flex-1 mt-6 sm:mt-0">
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