<script setup>
import { Icon } from '@iconify/vue';
import { tv } from 'tailwind-variants';
import { computed } from 'vue';

// Definindo os estilos do OptionCard usando tv (tailwind-variants)
const optionCard = tv({
  base: 'p-2 flex items-center gap-2 rounded-lg shadow-sm shadow-zinc-300 cursor-pointer group',
  variants: {
    variant: {
      primary: 'bg-white text-gray-600 border-[1px] border-gray-300 sm:hover:bg-[#42D3DD] hover:text-white', 
      secondary: 'bg-gray-500 text-white sm:hover:bg-gray-600',
      selected: 'bg-[#21BFCA] text-white sm:hover:bg-[#42D3DD]', 
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

// Computed para as classes do ícone
const iconClass = computed(() => {
  return props.variant === 'selected'
    ? 'bg-white text-[#21BFCA]'
    : 'bg-gray-600 text-white group-hover:bg-white group-hover:text-[#21BFCA]';
});
</script>

<template>
  <div 
    :class="optionCardClass" 
    :style="{ pointerEvents: variant === 'disabled' ? 'none' : 'auto' }"
  >
    <!-- Ícone -->
    <div 
      :class="`p-1 rounded-full flex justify-center items-center transition-colors ${iconClass}`"
    >
      <Icon :icon="icon" class="transition-colors" />
    </div>
    <!-- Nome da carreira -->
    <p>{{ careerName }}</p>
  </div>
</template>
