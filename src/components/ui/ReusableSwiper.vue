<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Swiper } from 'swiper';
import { EffectCoverflow ,Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
  slides: {
    type: Array,
    required: true, // Uma lista de slides deve ser passada como prop
  },
  direction: {
    type: String,
    default: 'horizontal', // Pode ser 'horizontal' ou 'vertical'
  },
  loop: {
    type: Boolean,
    default: true, // Define se o Swiper deve dar loop
  },
  autoplay: {
    type: Boolean,
    default: false, // Define se os slides devem avançar automaticamente
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    default: true,
  },
  navigation: {
    type: Boolean,
    default: true,
  }
});

let swiperInstance = null;

onMounted(() => {
  swiperInstance = new Swiper('.swiper', {
    modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
    effect:"coverflow",
    slidesPerView: "3",
    spaceBetween: "1",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: -50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    direction: props.direction,
    loop: props.loop,
    autoplay: props.autoplay ? { delay: 3000 } : false,
    pagination: props.pagination 
        ? {
            el: '.swiper-pagination',
            clickable: true,
        }
        : false,
    navigation: props.navigation 
        ? {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        } 
        : false,
  });
});

onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy();
    swiperInstance = null;
  }
});
</script>

<template>
        <div class="swiper ">
          <!-- Container de slides -->
          <div class="swiper-wrapper">
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="swiper-slide flex content-center bg-red-500"
            >
              <slot :slide="slide">
                <div class="bg-yellow-100 text-center content-center h-[50px]">
                    {{ slide }}
                </div>
              </slot>
            </div>
          </div>
      
          <!-- Paginação -->
          <div class="swiper-pagination"></div>
      
          <!-- Botões de navegação -->
          <div v-if="navigation" class="swiper-button-prev"></div>
          <div v-if="navigation" class="swiper-button-next"></div>
        </div>
</template>

<style scoped>
.swiper {
  width: 300px; /* Largura dinâmica */
  max-width: 330px; /* Largura máxima */
  height: 250px;
}
</style>
