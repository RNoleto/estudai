<script setup>
import { RouterView, useRoute, RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const user = userStore.userName;

const route = useRoute();

const isMobileView = ref(window.innerWidth <= 640);

const updateIsMobileView = () => {
  isMobileView.value = window.innerWidth <= 640;
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobileView);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobileView);
});

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

const handleSettingsLinkClick = () => {
  if (isSidebarCollapsed.value) {
    isMenu3Open.value = false;
  }
};

onMounted(async () => {
  await userStore.checkUserCareer();
});

const menuItems = [
  {
    label: 'Home',
    icon: 'fas fa-home',
    route: '/area-do-aluno'
  },
  {
    label: 'Estudar',
    icon: 'fa-solid fa-stopwatch',
    route: '/area-do-aluno/estudar'
  },
  {
    label: 'Concursos',
    icon: 'fa-solid fa-book',
    route: '/area-do-aluno/concursos'
  },
  {
    label: 'Histórico de Estudo',
    icon: 'fa-solid fa-pen-clip',
    route: '/area-do-aluno/historico-de-estudos'
  },
  // {
  //   label: 'Desafios',
  //   icon: 'fa-solid fa-flag-checkered',
  //   route: '/area-do-aluno/challenges'
  // },
  {
    label: 'Minhas Configurações',
    icon: 'fas fa-cog',
    subItems: [
      {
        label: 'Minha Carreira',
        route: '/area-do-aluno/carreiras'
      },
      {
        label: 'Minhas Matérias',
        route: '/area-do-aluno/materias'
      }
    ]
  },
  {
    label: 'Suporte ao Usuário',
    icon: 'fa-solid fa-headset',
    route: '/area-do-aluno/suporte'
  }
];

const isSettingsMenuActive = () => {
  const settingsRoutes = menuItems.find(item => item.label === 'Minhas Configurações').subItems.map(sub => sub.route);
  return settingsRoutes.includes(route.path);
};

async function handleLogout(){
  await userStore.logout();
  router.push('/');
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 text-gray-700">
    <!-- navbar mobile -->
    <nav v-if="isMobileView"
      class="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-zinc-500 shadow-sm z-50 flex items-center justify-between p-4">
      <router-link to="/area-do-aluno">
        <p class="font-bold text-lg">Estuday</p>
      </router-link>
      <button @click="toggleMenu" class="md:hidden focus:outline-none transition"
        :aria-label="isMenuMobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'">
        <i :class="isMenuMobileOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </nav>
    <!-- Menu mobile -->
    <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-40">
      <transition name="fade-slide" mode="out-in" appear>
        <div class="fixed top-0 right-0 h-screen bg-zinc-100 z-10 flex flex-col justify-start pt-16 gap-2 mt-10 px-6">
          <div v-for="item in menuItems" :key="item.label">
            <div v-if="!item.subItems">
              <router-link :to="item.route" @click="toggleMenu"
                class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100"
                :class="route.path === item.route ? 'bg-secondary text-gray-700 shadow-sm' : ''">
                <i :class="item.icon"></i>
                {{ item.label }}
              </router-link>
            </div>
            <div v-else>
              <button @click="toggleMenu3"
                class="flex items-center gap-2 text-gray-700 text-lg font-semibold p-2 rounded-xl hover:bg-blue-100"
                :class="isSettingsMenuActive() ? 'bg-secondary text-gray-700 shadow-sm' : ''">
                <i :class="item.icon"></i>
                {{ item.label }}
              </button>
              <transition name="fade-slide" mode="out-in" appear>
                <div v-if="isMenu3Open" class="text-zinc-700 mt-1 ml-8 flex flex-col gap-2">
                  <router-link
                    v-for="sub in item.subItems"
                    :key="sub.label"
                    :to="sub.route"
                    :class="[
                      'flex items-center gap-1 text-sm hover:text-blue-800',
                      route.path === sub.route ? 'font-bold text-blue-800' : ''
                    ]"
                    @click="toggleMenu"
                  >
                    {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
          <!-- Botão de sair mobile -->
          <div class="flex mt-[12rem] items-center gap-2" :class="isSidebarCollapsed ? 'justify-center' : ''">
              <!-- <p v-if="!isSidebarCollapsed" class="text-gray-700 text-sm font-medium">{{ user.fullName }}</p> -->
              <Button variant="baseDisable" size="sm" @click="handleLogout">
                Sair
              </Button>               
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
        <div class="p-4 text-lg text-gray-700 font-bold border-b border-secondary flex items-center"
          :class="[isSidebarCollapsed ? 'justify-center' : 'justify-between']">
          <span v-if="!isSidebarCollapsed"><router-link to="/area-do-aluno">Estuday</router-link></span>
          <button @click="toggleSidebar" class="text-primary hover:bg-gray-200 rounded"
            :class="isSidebarCollapsed ? 'px-4' : 'px-2'"
            :aria-label="isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'">
            <i :class="isSidebarCollapsed ? 'fa-solid fa-caret-right' : 'fa-solid fa-caret-left'"></i>
          </button>
        </div>
        <nav class="flex flex-col h-full gap-1" :class="isSidebarCollapsed ? 'p-1 items-center' : 'p-2'">
          <div class="flex items-center gap-2 mb-4 text-sm text-gray-700" :class="isSidebarCollapsed ? 'justify-center' : ''">
            <p v-if="!isSidebarCollapsed">Bem vindo {{ user }}!</p>
          </div>
          <!-- Home da Dashboard -->
          <div v-for="item in menuItems" :key="item.label">
            <div v-if="!item.subItems">
              <router-link :to="item.route" :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md',
                route.path === item.route
                  ? 'bg-secondary text-gray-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
                <i
                  :class="[item.icon, route.path === item.route ? 'text-gray-700' : 'text-primary hover:text-gray-500']"></i>
                <span v-show="!isSidebarCollapsed">{{ item.label }}</span>
              </router-link>
            </div>
            <div v-else>
              <button
                @click="toggleMenu3"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md text-gray-700 w-full',
                  isSettingsMenuActive() ? 'bg-secondary text-gray-700 shadow-sm' : 'hover:bg-gray-100'
                ]"
              >
                <i :class="item.icon"></i>
                <span v-show="!isSidebarCollapsed">{{ item.label }}</span>
              </button>
              <transition name="fade-slide" mode="out-in" appear>
                <div v-if="isMenu3Open && !isSidebarCollapsed" class="ml-8 flex flex-col gap-1">
                  <router-link
                    v-for="sub in item.subItems"
                    :key="sub.label"
                    :to="sub.route"
                    :class="[
                      'text-sm text-gray-700 hover:text-blue-800',
                      route.path === sub.route ? 'font-bold text-blue-800' : ''
                    ]"
                  >
                    {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
          <div class="mt-auto bg-secondary rounded-lg w-full shadow-md">
            <div class="flex items-center justify-center gap-2" :class="isSidebarCollapsed ? 'justify-center' : ''">
              <Button variant="baseDisable" size="sm" class="flex-1 p-2" @click="handleLogout">
                Sair
              </Button>
            </div>
          </div>
        </nav>
      </aside>
    </div>
    <!-- Conteúdo Principal -->
    <main class="flex-1 overflow-y-auto h-full">
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