<script setup>
  defineProps({
    text: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <div class="relative group">
    <slot></slot>
    <!-- Mostra o tooltip apenas quando o mouse está sobre o elemento -->
    <div class="absolute left-2/3 -translate-y-3/4 mt-2 p-2 bg-black text-white rounded shadow-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      {{ text }}
    </div>
  </div>
</template>
