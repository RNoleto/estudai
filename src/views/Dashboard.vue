<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import StudyTimeRecord from '../layouts/StudyTimeRecord.vue';
import StudyStatisticsRecords from '../layouts/StudyStatisticsRecords.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';

const userStore = useUserStore();

onMounted(async () =>{
    await userStore.checkUserCareer();
});

// Estados para controlar a abertura dos menus colapsáveis
const isMenu1Open = ref(false);
const isMenu2Open = ref(false);

// Funções para alternar os estados dos menus
const toggleMenu1 = () => (isMenu1Open.value = !isMenu1Open.value);
const toggleMenu2 = () => (isMenu2Open.value = !isMenu2Open.value);
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-4 text-lg font-bold border-b">Área do Aluno</div>
      <nav class="p-4">
        <!-- Menu Principal 1 -->
        <div>
          <button
            @click="toggleMenu1"
            class="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-home"></i>
              <span>Início</span>
            </div>
            <i class="fas" :class="isMenu1Open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div
            v-if="isMenu1Open"
            class="pl-8 mt-2 space-y-2"
          >
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
          </div>
        </div>

        <!-- Menu Principal 2 -->
        <div class="mt-4">
          <button
            @click="toggleMenu2"
            class="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-chart-bar"></i>
              <span>Relatórios</span>
            </div>
            <i class="fas" :class="isMenu2Open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
          <div
            v-if="isMenu2Open"
            class="pl-8 mt-2 space-y-2"
          >
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 1</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Submenu 2</a>
          </div>
        </div>

        <!-- Menu Principal 3 -->
        <a
          href="#"
          class="flex items-center gap-2 px-4 py-2 mt-4 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-cog"></i>
          <span>Configurações</span>
        </a>
      </nav>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="flex-1 p-6">
      <h1 class="text-2xl font-semibold text-gray-800">Bem-vindo à Área do Aluno</h1>
      <h2>Sua carreira: {{ userStore.careerName }}</h2>
      <p class="mt-4 text-gray-600">
        Aqui você pode gerenciar informações e visualizar dados importantes.
      </p>
      <div class="grid grid-cols-12 gap-2">
        <StudyTimeRecord class="col-span-2"/>
        <StudyStatisticsRecords class="col-span-2"/>
        <SubjectSummaryTable class="col-span-8"/>
      </div>
    </main>
  </div>
</template>
