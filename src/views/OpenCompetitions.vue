<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

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
</script>

<template>
        <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
            <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Concursos <span
                class="text-primary">Abertos.</span>
            </h3>
            <p class="text-sm italic text-gray-700">Fonte de pesquisa PCI Concursos</p>

            <Search placeholder="Pesquise o concurso..." v-model="searchTerm" />
            
            <div v-if="loading">Carregando concursos...</div>
            <div v-else-if="competitions.length === 0">Nenhum concurso encontrado.</div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3">
                <Card v-for="concurso in filteredCompetitions" :key="concurso.index" icon="fa-solid fa-book" :title="concurso.regiao" class="flex justify-between">
                    <!-- <img :src="concurso.imagem" alt="Imagem do concurso" /> -->
                    <template #content>
                        <div class="text-sm justify-start w-full space-y-1 text-gray-600">
                            <p>{{ concurso.titulo }}</p>
                            <p class="font-normal">{{ concurso.resumo }}</p>
                            <div class="flex justify-between font-normal">
                                <p><strong>Inscrição:</strong> {{ concurso.periodo_inscricao }}</p>
                                <p><strong>Situação:</strong> {{ concurso.situacao }}</p>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div v-if="concurso.link_edital?.length">
                            <p class="text-sm font-bold text-primary">Ultimo edital atualizado:</p>
                            <ul class="mt-2 space-y-2">
                                <!-- Listando todos os anexos -->
                                <!-- <li v-for="(edital, i) in concurso.link_edital" :key="i">
                                    <a :href="edital.url" target="_blank">{{ edital.titulo }}</a>
                                </li> -->
                                <!-- Pegando apenas o ultimo anexo -->
                                <li v-if="concurso.link_edital.length > 0">
                                    <a :href="concurso.link_edital[0].url" target="_blank">{{ concurso.link_edital[0].titulo }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="flex mt-2 text-sm font-bold text-primary justify-end">
                            <a :href="concurso.link" target="_blank">Ver mais</a>
                        </div>
                    </template>

                </Card>
            </div>
        </div>
</template>