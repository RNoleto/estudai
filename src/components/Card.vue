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
  <div class="flex flex-col p-[10px] bg-white shadow-md rounded-2xl border border-secondary">
    <!-- Título com ícone dinâmico -->
    <slot name="title">
      <div class="flex items-center gap-2 text-gray-500 font-medium">
        <i :class="icon" class="text-md"></i>
        <p class="text-sm sm:text-lg">{{ title }}</p>
      </div>
    </slot>

    <!-- Slot para campos opcionais -->
    <div class="flex flex-col gap-2">
      <slot name="fields"></slot>
    </div>

    <!-- Slot para o conteúdo com estilos padrão -->
    <div class="flex justify-end text-2xl mt-2 font-bold sm:text-4xl text-primary">
      <slot name="content">Conteúdo padrão</slot>
    </div>

    <!-- Footer só aparece se tiver conteúdo -->
    <div v-if="$slots.footer || footer" class="text-xs text-gray-600 mt-2">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
