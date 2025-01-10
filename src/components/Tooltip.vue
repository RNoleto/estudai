<script setup>
import { ref } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
})

const show = ref(false);
</script>

<template>
    <div class="relative group">
        <slot></slot>
        <div
            v-if="show"
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-sm p-2 rounded shadow-lg"
        >
            {{ text }}
        </div>
    </div>
</template>