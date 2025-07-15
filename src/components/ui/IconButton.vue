<script setup>
const props = defineProps({
  icon: { type: String, required: true }, // Ex: 'fa-solid fa-plus'
  size: { type: String, default: 'md' }, // 'sm', 'md', 'lg'
  color: { type: String, default: 'primary' }, // 'primary', 'secondary', 'danger', etc
  ariaLabel: { type: String, default: '' },
  tooltip: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

const emits = defineEmits(['click']);

const sizeClasses = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
};

const colorClasses = {
  primary: 'text-white bg-primary hover:bg-blue-700',
  secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300',
  danger: 'text-white bg-red-500 hover:bg-red-600',
};
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses[size],
      colorClasses[color],
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95',
    ]"
    :aria-label="ariaLabel || tooltip"
    :title="tooltip"
    :disabled="disabled"
    type="button"
    @click="$emit('click', $event)"
  >
    <i :class="icon"></i>
    <slot />
  </button>
</template>