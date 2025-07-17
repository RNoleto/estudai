<script setup>
import { computed, onMounted, ref } from 'vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';
import Card from '../components/Card.vue';
import SubjectBarChart from '../layouts/SubjectBarChart.vue';

import IconButton from '../components/ui/IconButton.vue';

import { useHead } from '@vueuse/head';


import { useUserStore } from '../stores/useUserStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';

const userStore = useUserStore();
const { formatStudyTime } = useTimeFormatter();

const totalStudyTime = computed(() => {
    return userStore.userStudyRecords.reduce((sum, record) => sum + record.study_time, 0);
});

const hasStudyRecords = ref(false);

// Opções para o combobox
const options = [
    { label: 'Questões resolvidas', value: 'questions_resolved' },
    { label: 'Questões corretas', value: 'correct_answers' },
    { label: 'Questões incorretas', value: 'incorrect_answers' },
];

const TotalUniqueTopics = computed(() => {
    const uniqueTopics = new Set();

    userStore.userStudyRecords.forEach(record => {
        if (record.subject_id && record.topic) {
            const key = `${record.subject_id}-${record.topic}`;
            uniqueTopics.add(key);
        }
    })

    return uniqueTopics.size;
})

// Estado para a seleção do combobox
const selectedOption = ref(options[0].value);

// Estado para o tipo de exibição (contador ou porcentagem)
const displayAsPercentage = ref(false);

// Soma o total com base na seleção
const totalValue = computed(() => {
    const totalQuestions = userStore.userStudyRecords.reduce((sum, record) => sum + record.questions_resolved, 0);
    const selectedTotal = userStore.userStudyRecords.reduce(
        (sum, record) => sum + record[selectedOption.value],
        0
    );

    if (displayAsPercentage.value && totalQuestions > 0) {
        return ((selectedTotal / totalQuestions) * 100).toFixed(0) + '%';
    }

    return selectedTotal;
});

onMounted(async () => {
    try {
        await userStore.fetchUserStudyRecords();
        const activeRecords = userStore.userStudyRecords.filter(record => record.ativo === 1);
        hasStudyRecords.value = activeRecords.length > 0;
    } catch (error) {
        console.error(error);
    }
})

useHead({
    title: "Estuday | Resumo de Estudos - Seu Desempenho e Progresso",
    meta: [
        {
            name: "description",
            content: "Acompanhe seu desempenho nos estudos! Veja o total de tempo estudado, questões respondidas, acertos e erros, além das matérias revisadas. Organize seu aprendizado e evolua com o Estuday!"
        },
        {
            property: "og:title",
            content: "Estuday | Seu Gerenciador de Estudos Personalizado"
        },
        {
            property: "og:description",
            content: "Acompanhe seu desempenho nos estudos! Veja o total de tempo estudado, questões respondidas, acertos e erros, além das matérias revisadas. Organize seu aprendizado e evolua com o Estuday!"
        },
        {
            property: "og:image",
            content: "https://estuday.com.br/img/metaImg.webp"
        },
        {
            property: "og:url",
            content: "https://estuday.com.br"
        },
        {
            name: "twitter:title",
            content: "Estuday | Resumo de Estudos - Seu Desempenho e Progresso"
        },
        {
            name: "twitter:description",
            content: "Acompanhe seu desempenho nos estudos! Veja o total de tempo estudado, questões respondidas, acertos e erros, além das matérias revisadas. Organize seu aprendizado e evolua com o Estuday!"
        },
        {
            name: "twitter:image",
            content: "https://estuday.com.br/img/metaImg.webp"
        },
        {
            name: "keywords",
            content: "gerenciador de estudos, organização de estudos, acompanhamento de desempenho, planejamento de estudos, eficiência nos estudos, metricas de estudos, concursos públicos, editais, edital, Estuday"
        }
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
              Resumo dos <span class="text-primary">estudos</span>
            </h1>
            <p class="mt-1 text-sm text-gray-600 sm:text-base">
              Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..." }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total de Matérias -->
        <Card 
          icon="fa-solid fa-book" 
          title="Total de Matérias"
          class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <template #content>
            <p class="text-blue-700 text-2xl font-bold">{{ userStore.userSubjects.length }}</p>
          </template>
        </Card>

        <!-- Total de Tópicos -->
        <Card 
          icon="fa-solid fa-tags" 
          title="Total de Tópicos"
          class="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <template #content>
            <p class="text-green-700 text-2xl font-bold">{{ TotalUniqueTopics }}</p>
          </template>
        </Card>

        <!-- Tempo de Estudo -->
        <Card 
          title="Tempo de Estudo" 
          icon="fa-solid fa-stopwatch-20"
          class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        >
          <template #content>
            <p class="text-purple-700 text-lg font-bold">{{ formatStudyTime(totalStudyTime) }}</p>
          </template>
        </Card>

        <!-- Questões Respondidas -->
        <Card 
          title="Questões Respondidas" 
          icon="fa-solid fa-pen-clip"
          class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        >
          <template #content>
            <div class="flex flex-col gap-3">
              <!-- Controles -->
              <div class="flex flex-col gap-2">
                <label class="text-xs font-medium text-gray-700">
                  Tipo de Questão:
                </label>
                <select 
                  v-model="selectedOption"
                  class="text-xs p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="displayAsPercentage"
                    id="percentage-toggle"
                    class="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <label for="percentage-toggle" class="text-xs text-gray-700">
                    Exibir como porcentagem
                  </label>
                </div>
              </div>
              
              <!-- Valor -->
              <p class="text-2xl font-bold" :class="{
                'text-primary': selectedOption === 'questions_resolved',
                'text-baseBlue': selectedOption === 'correct_answers',
                'text-baseRed': selectedOption === 'incorrect_answers'
              }">
                {{ totalValue }}
              </p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts and Tables Section -->
      <div v-if="hasStudyRecords" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <!-- Subject Summary Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-table text-primary"></i>
            Resumo por Matéria
          </h2>
          <SubjectSummaryTable />
        </div>

        <!-- Subject Bar Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-chart-bar text-primary"></i>
            Gráfico de Desempenho
          </h2>
          <SubjectBarChart />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
          <i class="fa-solid fa-chart-line text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum registro encontrado</h3>
        <p class="text-gray-500 mb-6">
          Comece a estudar para ver estatísticas e gráficos do seu desempenho.
        </p>
        <IconButton 
          icon="fa-solid fa-plus" 
          color="primary" 
          size="sm" 
          aria-label="Adicionar"
          tooltip="Adicionar novo item" 
          @click="suaFuncaoAqui" 
        />
      </div>
    </div>
  </div>
</template>