<script setup>
import { ref, computed } from 'vue';
import { tv } from 'tailwind-variants';
import { RouterLink } from 'vue-router';

// Definindo os estilos do botão
const button = tv({
    base: 'flex items-center justify-center gap-2 rounded-md text-sm font-medium mt-2 shadow-sm shadow-zinc-200',
    variants: {
        variant: {
            primary: 'bg-black text-zinc-50 hover:bg-zinc-600 ring-zinc-500',
            secondary: 'bg-zinc-500 text-zinc-50 hover:bg-zinc-400 ring-zinc-900',
            delete: 'bg-red-500 text-red-50 hover:bg-red-600 ring-red-500',
        },
        size: {
            default: 'px-4 py-2.5',
            full: 'w-full py-2',
            sm: 'px-3 py-1.5',
            xs: 'px-1.5 py-1',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'default',
    },
});

// Propriedades do Botão
const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'default',
    },
    to: {
        type: [String, Object],
        Required: false,
    }
});

// Referência para o botão
const buttonRef = ref(null);

// Computed para aplicar classes do botão
const buttonClass = computed(() => button({ variant: props.variant, size: props.size }));
</script>

<template>
    <RouterLink v-if="to" :to="to">
        <button
            ref="buttonRef"
            :class="buttonClass"
            v-bind="$attrs"
        >
        <slot></slot>
        </button>
    </RouterLink>
    <button v-else :class="buttonClass">
        <slot></slot>
    </button>
</template>