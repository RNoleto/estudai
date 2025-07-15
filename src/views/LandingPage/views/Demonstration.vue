<script setup>
import { ref } from 'vue';

const activeTab = ref(0);

const features = [
  {
    id: 0,
    title: "Gerenciamento de Tempo",
    icon: "fa-solid fa-stopwatch",
    description: "Controle preciso do tempo dedicado aos estudos",
    details: [
      "Modo foco para máxima concentração",
      "Registro manual de tempo de estudo",
      "Histórico detalhado de sessões",
      "Métricas diárias e semanais"
    ],
    color: "text-primary"
  },
  {
    id: 1,
    title: "Resolução de Questões",
    icon: "fa-solid fa-pen-clip",
    description: "Acompanhe seu desempenho em questões",
    details: [
      "Registro de questões respondidas",
      "Controle de acertos e erros",
      "Análise de performance por matéria",
      "Relatórios de progresso"
    ],
    color: "text-secondary"
  },
  {
    id: 2,
    title: "Inteligência Artificial",
    icon: "fa-solid fa-brain",
    description: "Insights personalizados com IA",
    details: [
      "Análise inteligente de desempenho",
      "Recomendações personalizadas",
      "Relatórios gerados por IA",
      "Sugestões de melhoria"
    ],
    color: "text-tertiary"
  },
  {
    id: 3,
    title: "Gestão de Carreiras",
    icon: "fa-solid fa-briefcase",
    description: "Organize sua preparação profissional",
    details: [
      "Seleção de carreiras específicas",
      "Gestão de matérias por carreira",
      "Acompanhamento de editais",
      "Foco em concursos públicos"
    ],
    color: "text-baseGreen"
  },
  {
    id: 4,
    title: "Histórico e Relatórios",
    icon: "fa-solid fa-chart-line",
    description: "Visualize seu progresso detalhadamente",
    details: [
      "Dashboard com métricas completas",
      "Gráficos de evolução",
      "Relatórios por período",
      "Comparativos de desempenho"
    ],
    color: "text-baseBlue"
  },
  {
    id: 5,
    title: "Concursos Abertos",
    icon: "fa-solid fa-book",
    description: "Acompanhe oportunidades de carreira",
    details: [
      "Lista atualizada de concursos",
      "Informações de inscrição",
      "Filtros por região e área",
      "Status dos editais"
    ],
    color: "text-baseYellow"
  }
];

const selectTab = (index) => {
  activeTab.value = index;
};
</script>

<template>
  <section class="py-16 bg-gradient-to-br from-gray-50 to-white" id="demonstration">
    <div class="container mx-auto px-4">
      <!-- Header da Seção -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Funcionalidades <span class="text-primary">Principais</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Descubra como o Estuday pode transformar sua preparação para concursos com ferramentas inteligentes e personalizadas
        </p>
      </div>

      <!-- Navegação por Tabs -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button
          v-for="feature in features"
          :key="feature.id"
          @click="selectTab(feature.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300',
            activeTab === feature.id
              ? 'bg-primary text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-600 hover:bg-baseGreen hover:text-white border border-gray-200'
          ]"
        >
          <i :class="feature.icon" class="mr-2"></i>
          {{ feature.title }}
        </button>
      </div>

      <!-- Conteúdo das Funcionalidades -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Informações da Funcionalidade -->
          <div class="space-y-6">
            <div class="flex items-center space-x-4">
              <div :class="['text-4xl', features[activeTab].color]">
                <i :class="features[activeTab].icon"></i>
              </div>
              <div>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800">
                  {{ features[activeTab].title }}
                </h3>
                <p class="text-lg text-gray-600">
                  {{ features[activeTab].description }}
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-700">Principais Recursos:</h4>
              <ul class="space-y-3">
                <li
                  v-for="(detail, index) in features[activeTab].details"
                  :key="index"
                  class="flex items-start space-x-3"
                >
                  <div class="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span class="text-gray-700">{{ detail }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-4">
              <button class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-baseGreen transition duration-300 shadow-lg">
                Experimente Agora
              </button>
            </div>
          </div>

          <!-- Imagem/Ilustração -->
          <div class="relative">
            <div class="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-80 flex items-center justify-center">
              <div class="text-center">
                <div :class="['text-8xl mb-4', features[activeTab].color]">
                  <i :class="features[activeTab].icon"></i>
                </div>
                <h4 class="text-xl font-semibold text-gray-700">
                  {{ features[activeTab].title }}
                </h4>
                <p class="text-gray-600 mt-2">
                  {{ features[activeTab].description }}
                </p>
              </div>
            </div>
            
            <!-- Elementos decorativos -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-tertiary/20 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-white rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-primary mb-2">100%</div>
          <div class="text-gray-600">Gratuito</div>
        </div>
        <div class="text-center p-6 bg-white rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-primary mb-2">24/7</div>
          <div class="text-gray-600">Disponível</div>
        </div>
        <div class="text-center p-6 bg-white rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-primary mb-2">IA</div>
          <div class="text-gray-600">Inteligente</div>
        </div>
        <div class="text-center p-6 bg-white rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-primary mb-2">∞</div>
          <div class="text-gray-600">Possibilidades</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animações suaves para transições */
.grid {
  transition: all 0.3s ease-in-out;
}

/* Efeito hover nos cards de estatísticas */
.shadow-lg:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

/* Gradiente animado no fundo */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
  