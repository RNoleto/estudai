<template>
    <section class="py-16 bg-gray-50" id="signatures">
      <div class="container mx-auto px-4">
        <h2 class="text-primary text-3xl md:text-4xl font-bold text-center mb-12">
          Escolha o Plano Ideal para Você
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Plano Gratuito -->
          <div class="border rounded-lg p-6 shadow-lg">
            <h3 class="text-2xl font-bold text-primary mb-4">Gratuito</h3>
            <p class="text-gray-600 mb-6">
              Experimente o Estuday gratuitamente e gerencie seu tempo de estudo de forma prática.
            </p>
            <ul class="text-primary mb-6 space-y-2">
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-baseGreen mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Gerenciamento de tempo de estudo
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-baseGreen mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Registro de questões respondidas
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-baseGreen mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Acesso a relatórios básicos
              </li>
            </ul>
            <button class="w-full bg-primary text-white py-3 rounded-full hover:bg-baseGreen transition duration-300">
              Comece Gratuitamente
            </button>
          </div>
  
          <!-- Plano Premium com Destaque -->
          <div class="relative border rounded-lg p-6 shadow-2xl bg-gradient-to-r from-primary to-secondary transform scale-105">
            <!-- Badge de destaque -->
            <div class="absolute top-0 right-0 mt-4 mr-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              Mais Popular
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Premium</h3>
            <p class="text-white mb-6">
              Desbloqueie todos os recursos avançados do Estuday, incluindo insights com IA para potencializar seus estudos.
            </p>
            <ul class="mb-6 space-y-2">
              <li class="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Todos os recursos do plano gratuito
              </li>
              <li class="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Insights personalizados com IA
              </li>
              <li class="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Relatórios avançados de desempenho
              </li>
              <li class="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Suporte prioritário
              </li>
            </ul>
            <button class="w-full bg-white text-primary py-3 rounded-full hover:bg-gray-100 transition duration-300">
              Assine Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // Esse componente é estático; para dinamizar, integre com sua API ou store.
  </script>
  
  <style scoped>
  /* Se necessário, personalize ainda mais os estilos aqui */
  </style>
  