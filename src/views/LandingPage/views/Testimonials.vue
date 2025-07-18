<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Estudante de Engenharia',
    avatar: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    text: 'O Estuday revolucionou a forma como gerencio meu tempo de estudo. As dicas de IA são incríveis!'
  },
  {
    name: 'João Pereira',
    role: 'Concurseiro',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww',
    text: 'A interface é intuitiva e os insights me ajudaram a melhorar meu desempenho em concursos públicos.'
  },
  {
    name: 'Ana Costa',
    role: 'Universitária',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Com o Estuday, finalmente consegui organizar meus estudos e ver meu progresso de verdade!'
  },
  {
    name: 'Carlos Souza',
    role: 'Servidor Público',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Os relatórios e gráficos são excelentes para acompanhar minha evolução. Recomendo muito!'
  }
];

const current = ref(0);
const visibleCount = ref(1); // 1 mobile, 3 desktop
let autoplayInterval = null;
let pauseTimeout = null;

function updateVisibleCount() {
  if (window.innerWidth >= 1024) {
    visibleCount.value = 3;
  } else {
    visibleCount.value = 1;
  }
}

function next() {
  current.value = (current.value + 1) % testimonials.length;
  pauseAutoplay();
}
function prev() {
  current.value = (current.value - 1 + testimonials.length) % testimonials.length;
  pauseAutoplay();
}
function goTo(idx) {
  current.value = idx;
  pauseAutoplay();
}

function startAutoplay() {
  clearAutoplay();
  autoplayInterval = setInterval(() => {
    current.value = (current.value + 1) % testimonials.length;
  }, 6000);
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
  updateVisibleCount();
  window.addEventListener('resize', updateVisibleCount);
  startAutoplay();
});
onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCount);
  clearAutoplay();
  if (pauseTimeout) clearTimeout(pauseTimeout);
});

const cardsToShow = computed(() => {
  const total = testimonials.length;
  if (visibleCount.value === 1) {
    return [testimonials[current.value]];
  } else {
    // 3 cards: anterior, central, próximo
    const center = current.value;
    const left = (center - 1 + total) % total;
    const right = (center + 1) % total;
    return [testimonials[left], testimonials[center], testimonials[right]];
  }
});

const transitionName = ref('');
watch(current, (newVal, oldVal) => {
  if (newVal > oldVal || (oldVal === testimonials.length - 1 && newVal === 0)) {
    transitionName.value = 'slide-left';
  } else {
    transitionName.value = 'slide-right';
  }
});
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden z-0" id="testimonials">
    <div class="container mx-auto px-4 text-center relative z-1">
      <h2 class="text-primary text-3xl md:text-4xl font-bold mb-[100px]">
        O Que Nossos Usuários Dizem
      </h2>
      <div class="flex justify-center items-center gap-4 mb-8 z-1">
        <button @click="prev" class="bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow transition-all duration-200">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="flex-1 flex justify-center items-center h-80">
          <transition-group :name="transitionName" tag="div" class="flex gap-6 w-full h-80 items-end justify-center">
            <div v-for="(t, idx) in cardsToShow" :key="t.name + t.role + current" class="flex flex-col items-center justify-end mx-auto relative transition-all duration-500"
              :class="[
                visibleCount === 1 || idx === 1 ? 'z-20 scale-110 shadow-2xl w-full max-w-lg opacity-100 blur-0' : 'z-10 scale-90 opacity-60 blur-[2px] w-80',
                'h-80 rounded-2xl bg-white border-t-4 border-primary px-6 py-8'
              ]">
              <!-- Avatar sempre fora do blur -->
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 z-30 bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white">
                <img :src="t.avatar" :alt="'Foto de ' + t.name" class="rounded-full w-14 h-14 object-cover" />
              </div>
              <div class="mt-10 mb-4">
                <i class="fa-solid fa-quote-left text-2xl text-primary opacity-60"></i>
              </div>
              <p class="text-gray-700 italic mb-4 text-lg px-4">"{{ t.text }}"</p>
              <div class="flex flex-col items-center mb-6">
                <p class="font-semibold text-primary text-lg flex items-center gap-2">
                  <i class="fa-solid fa-user-graduate"></i> {{ t.name }}
                </p>
                <p class="text-sm text-gray-500">{{ t.role }}</p>
              </div>
            </div>
          </transition-group>
        </div>
        <button @click="next" class="bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full p-2 shadow transition-all duration-200">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      <div class="flex justify-center gap-2 mt-4">
        <button v-for="(t, idx) in testimonials" :key="t.name + '-dot'" @click="goTo(idx)" :class="['w-3 h-3 rounded-full', current === idx ? 'bg-primary' : 'bg-gray-300']"></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
  position: absolute;
}
.slide-left-enter-from {
  transform: translateX(120px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-120px);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-120px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(120px);
  opacity: 0;
}
@media (min-width: 1024px) {
  .max-w-lg {
    max-width: 420px;
  }
  .w-80 {
    width: 320px;
  }
}
</style>
  