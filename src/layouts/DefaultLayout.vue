<template>
    <div class="relative w-full h-full">
      <!-- Background: imagem que ocupa toda a tela -->
      <div 
        class="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-300"
        :class="backgroundOpacity"
        style="background-image: url('../../public/img/wallpaper.png');"
      ></div>
      <!-- Conteúdo da página (slot padrão) -->
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    /**
     * Permite definir a opacidade do background via classes do Tailwind (ex.: 'opacity-50', 'opacity-100', etc.)
     */
    backgroundOpacity: {
      type: String,
      default: 'opacity-100'
    }
  });
  </script>
  