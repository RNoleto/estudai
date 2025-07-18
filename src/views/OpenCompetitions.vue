<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useHead } from '@vueuse/head'

import Card from '../components/Card.vue'
import Search from '../components/ui/Search.vue'

const searchTerm = ref('')
const competitions = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get('https://rnoleto.github.io/webscraper-concursos/concursos.json')
    const data = response.data
    competitions.value = Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error('Erro ao buscar concursos:', error)
  } finally {
    loading.value = false
  }
})

const filteredCompetitions = computed(() => {
  return competitions.value.filter(concurso => {
    return concurso.titulo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      concurso.regiao.toLowerCase().includes(searchTerm.value.toLowerCase())
  })
})

useHead({
  title: "Estuday | Concursos Públicos Abertos - Encontre Oportunidades Atualizadas",
  meta: [
    { name: 'description', content: "Confira os concursos públicos abertos organizados de forma clara e atualizada. Veja cargos, salários, vagas e períodos de inscrição em tempo real com o Estuday." },
    { property: 'og:title', content: "Estuday | Concursos Públicos Abertos - Encontre Oportunidades Atualizadas" },
    { property: 'og:description', content: "Confira os concursos públicos abertos organizados de forma clara e atualizada. Veja cargos, salários, vagas e períodos de inscrição em tempo real com o Estuday." },
    { property: 'og:image', content: "https://estuday.com.br/img/metaImg.webp" },
    { property: 'og:url', content: "https://estuday.com.br/area-do-aluno/concursos" },
    { name: 'twitter:title', content: "Estuday | Concursos Públicos Abertos - Encontre Oportunidades Atualizadas" },
    { name: 'twitter:description', content: "Confira os concursos públicos abertos organizados de forma clara e atualizada. Veja cargos, salários, vagas e períodos de inscrição em tempo real com o Estuday." },
    { name: 'twitter:image', content: "https://estuday.com.br/img/metaImg.webp" },
    { name: 'keywords', content: "concursos públicos, concursos abertos, cargos, salários, edital, oportunidades, carreira pública, estudar para concurso" }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pt-20 sm:pt-6">
      <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">         <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              Concursos <span class="text-primary">Abertos</span>
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Encontre oportunidades atualizadas de concursos públicos organizadas de forma clara e eficiente.
            </p>
            <p class="mt-2 text-xs text-gray-500 italic">             Fonte de pesquisa: PCI Concursos
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
      
      <!-- Search Section -->
      <div class="mb-6">
        <Search 
          placeholder="Pesquise o concurso..." 
          v-model="searchTerm"
          class="max-w-md"       />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
          <i class="fa-solid fa-spinner fa-spin text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Carregando concursos...</h3>
        <p class="text-gray-500">       Buscando as melhores oportunidades para você.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="competitions.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
          <i class="fa-solid fa-search text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum concurso encontrado</h3>
        <p class="text-gray-500">       Não foi possível carregar os concursos no momento. Tente novamente mais tarde.
        </p>
      </div>

      <!-- Competitions Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  <Card 
          v-for="concurso in filteredCompetitions" 
          :key="concurso.index" 
          icon="fa-solid fa-graduation-cap" 
          :title="concurso.regiao"
          class="bg-white hover:shadow-md transition-shadow duration-200"
        >
          <template #content>
            <!-- Título do Concurso -->
            <div class="flex-1 space-y-3">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm leading-tight">
                  {{ concurso.titulo }}
                </h3>
              </div>
              
              <!-- Resumo -->
              <div v-if="concurso.resumo" class="text-sm text-gray-600">
                <p>{{ concurso.resumo }}</p>
              </div>
              
              <!-- Informações do Concurso -->
              <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Inscrição:</span>
                  <span class="text-gray-900">{{ concurso.periodo_inscricao }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Situação:</span>
                  <span class="text-gray-900">{{ concurso.situacao }}</span>
                </div>
              </div>
            </div>
          </template>
          
          <template #footer>
            <div class="space-y-3">              <!-- Link do Edital -->
              <div v-if="concurso.link_edital?.length" class="border-t border-gray-100 pt-3">
                <p class="text-xs font-semibold text-primary mb-2">Último edital atualizado:</p>
                <div class="space-y-1">
                  <a 
                    v-if="concurso.link_edital.length > 0"
                    :href="concurso.link_edital[0].url" 
                    target="_blank"
                    class="text-xs text-primary hover:text-primary/80 underline transition-colors"
                  >
                   {{ concurso.link_edital[0].titulo }}
                  </a>
                </div>
              </div>
              
              <!-- Link Ver Mais -->
              <div class="flex justify-end">
                <a 
                  :href="concurso.link" 
                  target="_blank"
                  class="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Ver mais detalhes
                  <i class="fa-solid fa-external-link-alt ml-1"></i>
                </a>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- No Results State -->
      <div v-if="!loading && competitions.length > 0 && filteredCompetitions.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center mt-6">
        <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
          <i class="fa-solid fa-search text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum concurso encontrado</h3>
        <p class="text-gray-500">       Tente ajustar os termos de pesquisa para encontrar concursos que correspondam aos seus critérios.
        </p>
      </div>
    </div>
  </div>
</template>