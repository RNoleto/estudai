<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isMenuOpen = ref(false);
const router = useRouter();

const links = [
  { name: 'Dashboard', to: '/area-do-aluno/dashboard', icon: 'fa-solid fa-house' },
  { name: 'Estudos', to: '/area-do-aluno/estudar', icon: 'fa-solid fa-clock' },
  { name: 'Concursos', to: '/area-do-aluno/concursos', icon: 'fa-solid fa-graduation-cap' },
  { name: 'Histórico', to: '/area-do-aluno/historico-de-estudos', icon: 'fa-solid fa-chart-line' },
  { name: 'Matérias', to: '/area-do-aluno/materias', icon: 'fa-solid fa-book' },
  { name: 'Missões', to: '/area-do-aluno/missoes', icon: 'fa-solid fa-bullseye' },
  { name: 'Suporte', to: '/area-do-aluno/suporte', icon: 'fa-solid fa-headset' },
];

function goTo(link) {
  isMenuOpen.value = false;
  router.push(link);
}
</script>

<template>
  <nav class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-40">
    <!-- Logo / Título -->
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-graduation-cap text-primary text-xl"></i>
      <span class="font-bold text-lg text-gray-900">Estuday</span>
    </div>

    <!-- Botão menu mobile -->
    <button
      class="block sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      @click="isMenuOpen = true"
      aria-label="Abrir menu"
    >
      <i class="fa-solid fa-bars text-2xl text-primary"></i>
    </button>

    <!-- Menu desktop (opcional, pode ser expandido depois) -->
    <div class="hidden sm:flex gap-6 items-center">
      <template v-for="link in links" :key="link.to">
        <router-link
          :to="link.to"
          class="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
          active-class="text-primary font-bold"
        >
          <i :class="link.icon"></i>
          <span>{{ link.name }}</span>
        </router-link>
      </template>
    </div>

    <!-- Drawer Mobile -->
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click.self="isMenuOpen = false"
      >
        <aside
          class="absolute top-0 left-0 h-full w-64 bg-white shadow-xl rounded-r-2xl flex flex-col py-6 px-4 animate-slide-in"
        >
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-graduation-cap text-primary text-xl"></i>
              <span class="font-bold text-lg text-gray-900">Estuday</span>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              @click="isMenuOpen = false"
              aria-label="Fechar menu"
            >
              <i class="fa-solid fa-xmark text-2xl text-primary"></i>
            </button>
          </div>
          <nav class="flex flex-col gap-2">
            <template v-for="link in links" :key="link.to">
              <button
                @click="goTo(link.to)"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 font-medium transition-colors w-full text-left"
              >
                <i :class="link.icon + ' text-lg'" />
                <span>{{ link.name }}</span>
              </button>
            </template>
          </nav>
        </aside>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in {
  animation: slide-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
