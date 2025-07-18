<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default: "Card Title",
  },
  footer: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
    default: "fa-solid fa-ghost", // Ícone padrão
  },
});
</script>

<template>
  <div class="flex flex-col p-3 sm:p-4 bg-white shadow-md rounded-xl sm:rounded-2xl border min-h-[120px] sm:min-h-[140px]">
    <!-- Título com ícone dinâmico -->
    <slot name="title">
      <div class="flex items-center gap-2 text-gray-500 font-medium mb-2 sm:mb-3">
        <i :class="icon" class="text-sm sm:text-base"></i>
        <p class="text-xs sm:text-sm lg:text-base leading-tight">{{ title }}</p>
      </div>
    </slot>

    <!-- Slot para campos opcionais -->
    <div class="flex flex-col gap-1 sm:gap-2">
      <slot name="fields"></slot>
    </div>

    <!-- Slot para o conteúdo com estilos padrão -->
    <div class="flex text-lg sm:text-xl md:text-2xl lg:text-3xl mt-auto font-bold text-primary">
      <slot name="content">Conteúdo padrão</slot>
    </div>

    <!-- Footer só aparece se tiver conteúdo -->
    <div v-if="$slots.footer || footer" class="text-xs text-gray-600 mt-2">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
