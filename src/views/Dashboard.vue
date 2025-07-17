<script setup>
import { RouterView, useRoute, RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import { useRouter } from 'vue-router';

import Button from '../components/ui/Button.vue';

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
  {
    label: 'Desafios',
    icon: 'fa-solid fa-flag-checkered',
    route: '/area-do-aluno/challenges'
  },
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
      class="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 flex items-center justify-between p-4">
      <router-link to="/area-do-aluno" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
          <i class="fa-solid fa-graduation-cap text-white text-sm"></i>
        </div>
        <span class="font-bold text-lg text-gray-900">Estuday</span>
      </router-link>
      <button 
        @click="toggleMenu" 
        class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        :aria-label="isMenuMobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
      >
        <i :class="[
          'text-gray-600 transition-transform duration-200',
          isMenuMobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
        ]"></i>
      </button>
    </nav>
    <!-- Menu mobile -->
    <transition name="menu-overlay">
      <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
        <transition name="menu-slide">
          <div class="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            <!-- Header do menu mobile -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                  <i class="fa-solid fa-graduation-cap text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="font-bold text-gray-900">Estuday</h2>
                  <p class="text-sm text-gray-500">Menu de navegação</p>
                </div>
              </div>
              <button 
                @click="toggleMenu" 
                class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Fechar menu"
              >
                <i class="fa-solid fa-xmark text-gray-600"></i>
              </button>
            </div>

            <!-- Conteúdo do menu -->
            <div class="flex-1 overflow-y-auto p-4">
              <!-- Seção do usuário -->
              <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-user text-white"></i>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Bem-vindo!</p>
                    <p class="text-sm text-gray-600">{{ user }}</p>
                  </div>
                </div>
              </div>

              <!-- Links de navegação -->
              <nav class="space-y-2">
                <template v-for="item in menuItems" :key="item.label">
                  <!-- Links simples -->
                  <div v-if="!item.subItems">
                    <router-link 
                      :to="item.route" 
                      @click="toggleMenu"
                      class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary font-medium transition-all duration-200 group"
                      :class="route.path === item.route ? 'bg-primary/15 text-primary shadow-sm' : ''"
                    >
                      <div class="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors"
                           :class="route.path === item.route ? 'bg-primary/20' : ''">
                        <i :class="[item.icon, 'text-lg', route.path === item.route ? 'text-primary' : 'text-gray-600 group-hover:text-primary']"></i>
                      </div>
                      <span class="flex-1">{{ item.label }}</span>
                      <i v-if="route.path === item.route" class="fa-solid fa-check text-primary text-sm"></i>
                    </router-link>
                  </div>

                  <!-- Links com submenu -->
                  <div v-else>
                    <button
                      @click="toggleMenu3"
                      class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary font-medium transition-all duration-200 w-full group"
                      :class="isSettingsMenuActive() ? 'bg-primary/15 text-primary shadow-sm' : ''"
                    >
                      <div class="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors"
                           :class="isSettingsMenuActive() ? 'bg-primary/20' : ''">
                        <i :class="[item.icon, 'text-lg', isSettingsMenuActive() ? 'text-primary' : 'text-gray-600 group-hover:text-primary']"></i>
                      </div>
                      <span class="flex-1 text-left">{{ item.label }}</span>
                      <i :class="[
                        'fa-solid transition-transform duration-200',
                        isMenu3Open ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-gray-400'
                      ]"></i>
                    </button>
                    
                    <transition name="submenu">
                      <div v-if="isMenu3Open" class="ml-14 mt-2 space-y-1">
                        <router-link
                          v-for="sub in item.subItems"
                          :key="sub.label"
                          :to="sub.route"
                          @click="toggleMenu"
                          class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                          :class="route.path === sub.route ? 'text-primary font-medium bg-primary/10' : ''"
                        >
                          <div class="w-2 h-2 rounded-full bg-gray-300"
                               :class="route.path === sub.route ? 'bg-primary' : ''"></div>
                          <span>{{ sub.label }}</span>
                        </router-link>
                      </div>
                    </transition>
                  </div>
                </template>
              </nav>
            </div>

            <!-- Footer do menu -->
            <div class="p-4 border-t border-gray-100">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-colors duration-200"
              >
                <i class="fa-solid fa-sign-out-alt"></i>
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <!-- Sidebar desktop -->
    <div class="sm:min-h-screen">
      <aside v-if="!isMobileView" :class="[
        'flex flex-col h-full bg-white shadow-md text-sm transition-[width] duration-300 ease-in-out',
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
/* Estilos para as transições do menu mobile */
.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilo para a transição da sidebar desktop */
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