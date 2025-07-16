<script setup>
const props = defineProps({
  icon: { required: true }, // Ex: 'fa-solid fa-plus'
  size: { default: 'md' }, // 'sm', 'md', 'lg'
  color: { default: 'primary' }, // 'primary', 'secondary', 'danger', etc
  ariaLabel: { default: '' },
  tooltip: { default: '' },
  disabled: { default: false },
  outlined: { default: false }, // Novo: permite borda
});

const emits = defineEmits(['click']);

const sizeClasses = {
  xs: 'w-8 h-8 text-base',
  sm: 'w-9 h-9 text-base', // aumentei área de clique
  md: 'w-11 h-11 text-xl',
  lg: 'w-14 h-14 text-2xl',
};

const colorClasses = {
  primary: 'text-baseBlue bg-white hover:bg-baseBlue/10 focus:ring-baseBlue',
  secondary: 'text-zinc-700 bg-white hover:bg-zinc-100 focus:ring-zinc-400',
  danger: 'text-terRed bg-white hover:bg-terRed/10 focus:ring-terRed',
};

const borderClasses = (props) => props.outlined ? 'border border-zinc-200' : '';
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses[size],
      colorClasses[color],
      borderClasses(props),
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95',
      'duration-150',
    ]"
    :aria-label="ariaLabel || tooltip"
    :title="tooltip"
    :disabled="disabled"
    type="button"
    tabindex="0"
    @keyup.enter="!disabled && $emit('click', $event)"
    @keyup.space="!disabled && $emit('click', $event)"
    @click="$emit('click', $event)"
  >
    <i :class="icon" aria-hidden="true"></i>
    <slot />
  </button>
</template>