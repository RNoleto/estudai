<script setup>
</script>

<template>
    <section class="py-16 bg-white" id="demonstration">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-8">
          Funcionalidades Principais
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1: Gerenciamento de Tempo -->
          <div class="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow">
            <div class="mb-4">
              <!-- Ícone placeholder: substitua pelo seu SVG ou componente de ícone -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Gerenciamento de Tempo</h3>
            <p class="text-gray-600">
              Controle e monitore o tempo dedicado aos seus estudos de forma prática e eficiente.
            </p>
          </div>
          <!-- Card 2: Resolução de Questões -->
          <div class="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow">
            <div class="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4M7 7h10M7 17h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Resolução de Questões</h3>
            <p class="text-gray-600">
              Registre e acompanhe suas respostas, analise acertos e erros para melhorar seu desempenho.
            </p>
          </div>
          <!-- Card 3: Insights com IA -->
          <div class="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow">
            <div class="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Insights com IA</h3>
            <p class="text-gray-600">
              Receba recomendações personalizadas e métricas inteligentes para otimizar seus estudos.
            </p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // Esse componente é estático, mas você pode adicionar interatividade se necessário.
  </script>
  
  <style scoped>
  /* Se desejar customizar ainda mais os estilos além do Tailwind, adicione aqui */
  </style>
  