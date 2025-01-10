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
    <!-- Tooltip ajustado -->
    <div 
      class="absolute left-1/4 transform -translate-x-1/2 translate-y-[-150%] mt-2 p-2 bg-black text-white rounded shadow-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
/* Garante que o tooltip fique acima de outros elementos */
.z-50 {
  z-index: 50;
}
</style>
