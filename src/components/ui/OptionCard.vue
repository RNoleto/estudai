<script setup>
import { Icon } from '@iconify/vue';
import { tv } from 'tailwind-variants';
import { computed } from 'vue';

// Definindo os estilos do OptionCard usando tv (tailwind-variants)
const optionCard = tv({
  base: 'p-2 flex items-center gap-2 rounded-lg shadow-sm shadow-black cursor-pointer',
  variants: {
    variant: {
      primary: 'bg-gray-900 text-white sm:hover:bg-blue-600',
      secondary: 'bg-gray-500 text-white sm:hover:bg-gray-600',
      selected: 'bg-blue-700 text-white sm:hover:bg-blue-900',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

// Propriedades do OptionCard
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  careerName: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
  },
});

// Computed para gerar as classes dinâmicas
const optionCardClass = computed(() => optionCard({ variant: props.variant }));
</script>

<template>
  <div :class="optionCardClass" :style="{ pointerEvents: variant === 'disabled' ? 'none' : 'auto' }">
    <!-- Ícone -->
    <div class="bg-white p-1 rounded-full flex justify-center items-center">
      <Icon :icon="icon" class="text-zinc-900 transform-none" />
    </div>
    <!-- Nome da carreira -->
    <p class="text-white">{{ careerName }}</p>
  </div>
</template>
