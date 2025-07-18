<script setup>
import History from '../layouts/History.vue';
import { useHead } from '@vueuse/head';

useHead({
  title: 'Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA',
  meta: [
    { name: 'description', content: 'Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!' },
    { property: 'og:title', content: 'Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA' },
    { property: 'og:description', content: 'Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!' },
    { property: 'og:image', content: 'https://estuday.com.br/img/metaImg.webp' },
    { property: 'og:url', content: 'https://estuday.com.br/area-do-aluno/historico-de-estudos' },
    { name: 'twitter:title', content: 'Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA' },
    { name: 'twitter:description', content: 'Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!' },
    { name: 'twitter:image', content: 'https://estuday.com.br/img/metaImg.webp' },
    { name: 'keywords', content: 'concursos públicos, gestão do tempo de estudo, organização de estudos, preparação para concurso, questões de concurso, acompanhamento de desempenho, planejamento de estudos' }
  ]
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pt-20 sm:pt-6">
      <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Histórico de <span class="text-primary">estudos</span>
            </h1>
            <p class="mt-1 text-sm text-gray-600 sm:text-base">
              Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <i class="fa-solid fa-chart-line text-primary"></i>
          Análise de Desempenho
        </h2>
        <History />
      </div>
    </div>
  </div>
</template> 