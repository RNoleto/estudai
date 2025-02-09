<script setup>
import { ref, computed } from 'vue';
import { tv } from 'tailwind-variants';
import { RouterLink } from 'vue-router';

// Definindo os estilos do botão
const button = tv({
    base: 'flex items-center justify-center gap-2 rounded-lg text-sm font-medium shadow-sm shadow-zinc-200',
    variants: {
        variant: {
            base: 'bg-[#21BFCA] text-white font-bold px-[16px] py-[10px] border-[#2EC1CB] hover:bg-[#42D3DD]', //Novo Layout
            baseDisable: 'bg-white text-[#21BFCA] font-bold px-[16px] py-[10px] border-[1px] border-[#2EC1CB] hover:bg-[#42D3DD]', //NovoLaout
            primary: 'bg-gray-900 text-zinc-50 hover:bg-blue-600 ring-blue-500',
            secondary: 'bg-zinc-500 text-zinc-50 hover:bg-zinc-400 ring-zinc-900',
            delete: 'bg-red-500 text-red-50 hover:bg-red-600 ring-red-500',
            play: 'bg-blue-500 text-blue-50 hover:bg-blue-600 ring-blue-500',
            disable: 'bg-gray-400 text-gray-50 cursor-not-allowed',
            ia: 'bg-green-500 text-white hover:bg-green-600 ring-green-500',
        },
        size: {
            default: 'px-4 py-2.5',
            full: 'w-full py-2',
            sm: 'px-3 py-2',
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