<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const prints = [
  { src: '/img/landingpage/img-home.png', alt: 'Dashboard do Estuday', legend: 'Dashboard completo com visão geral dos estudos', icon: 'fa-solid fa-chart-line' },
  { src: '/img/landingpage/img-materias.png', alt: 'Gestão de Matérias', legend: 'Organize e acompanhe suas matérias', icon: 'fa-solid fa-book' },
  { src: '/img/landingpage/img-carreiras.png', alt: 'Seleção de Carreiras', legend: 'Escolha e personalize sua carreira', icon: 'fa-solid fa-briefcase' },
  { src: '/img/landingpage/img-desafios.png', alt: 'Desafios de Estudo', legend: 'Supere desafios e evolua', icon: 'fa-solid fa-bolt' },
  { src: '/img/landingpage/img-insights.png', alt: 'Insights Inteligentes', legend: 'Receba dicas e análises automáticas', icon: 'fa-solid fa-brain' },
  { src: '/img/landingpage/img-historico.png', alt: 'Histórico de Estudos', legend: 'Acompanhe todo seu progresso', icon: 'fa-solid fa-clock-rotate-left' },
  { src: '/img/landingpage/img-concursos.png', alt: 'Concursos Abertos', legend: 'Veja concursos e oportunidades', icon: 'fa-solid fa-list-check' },
  { src: '/img/landingpage/img-estudar.png', alt: 'Modo Estudo', legend: 'Foque no que importa', icon: 'fa-solid fa-stopwatch' }
];

const current = ref(0);
let autoplayInterval = null;
let pauseTimeout = null;

function next() {
  current.value = (current.value + 1) % prints.length;
  pauseAutoplay();
}
function prev() {
  current.value = (current.value - 1 + prints.length) % prints.length;
  pauseAutoplay();
}
function goTo(idx) {
  current.value = idx;
  pauseAutoplay();
}

function startAutoplay() {
  clearAutoplay();
  autoplayInterval = setInterval(() => {
    current.value = (current.value + 1) % prints.length;
  }, 4000);
}
function clearAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
  autoplayInterval = null;
}
function pauseAutoplay() {
  clearAutoplay();
  if (pauseTimeout) clearTimeout(pauseTimeout);
  pauseTimeout = setTimeout(() => {
    startAutoplay();
  }, 8000);
}

onMounted(() => {
  startAutoplay();
});
onUnmounted(() => {
  clearAutoplay();
  if (pauseTimeout) clearTimeout(pauseTimeout);
});

const visiblePrints = computed(() => {
  // Para desktop: central + laterais
  const total = prints.length;
  const center = current.value;
  const left = (center - 1 + total) % total;
  const right = (center + 1) % total;
  return [prints[left], prints[center], prints[right]];
});
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-primary/5 to-secondary/10 relative overflow-hidden z-0" id="prints-showcase">
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0"></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Experimente o <span class="text-primary">Estuday</span> visualmente
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Veja como é fácil e intuitivo acompanhar seu progresso e organizar seus estudos.
        </p>
      </div>
      <!-- Desktop: Grid com destaque -->
      <div class="hidden md:flex justify-center items-center gap-6 mb-8 h-80">
        <div v-for="(print, idx) in visiblePrints" :key="print.src" class="relative group transition-all duration-500"
          :class="[
            idx === 1 ? 'z-20 scale-110 shadow-2xl w-[520px] h-80' : 'z-10 scale-90 blur-[2px] opacity-60 w-48 h-32',
            'rounded-2xl overflow-hidden bg-white border border-gray-200',
            'flex flex-col items-center justify-end'
          ]">
          <img :src="print.src" :alt="print.alt" class="object-contain w-full h-full transition-all duration-500" />
          <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
            <i :class="print.icon" class="text-lg"></i>
            <span class="text-xs md:text-base">{{ print.legend }}</span>
          </div>
        </div>
      </div>
      <!-- Mobile: Um print por vez -->
      <div class="md:hidden flex flex-col items-center mb-8">
        <div class="relative w-full max-w-xs aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          <img :src="prints[current].src" :alt="prints[current].alt" class="object-contain w-full h-full transition-all duration-500" />
          <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center gap-2 text-white">
            <i :class="prints[current].icon" class="text-lg"></i>
            <span class="text-xs">{{ prints[current].legend }}</span>
          </div>
          <button @click="prev" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow transition-all duration-200">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button @click="next" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow transition-all duration-200">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div class="flex gap-2 mt-4 justify-center">
          <button v-for="(print, idx) in prints" :key="print.src" @click="goTo(idx)" :class="['w-3 h-3 rounded-full', current === idx ? 'bg-primary' : 'bg-gray-300']"></button>
        </div>
      </div>
      <div class="text-center mt-8">
        <a href="/login" class="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-baseGreen transition duration-300">
          Experimente grátis
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16/9;
}
</style> 