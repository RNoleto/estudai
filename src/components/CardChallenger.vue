<script setup>
defineProps({
    title: {
        type: String,
        required: true,
        default: "Desafio de Estudo",
    },
    icon: {
        type: String,
        required: false,
        default: "fa-solid fa-bullseye",
    },
    progress: {
        type: Number,
        required: false,
        default: 0,
    }
});
</script>

<template>
    <div class="rounded-lg">
        <slot name="title">
            <div class="flex flex-col items-center text-center space-y-2 border border-secondary p-4 rounded-lg overflow-hidden shadow transition duration-200 ease-in-out hover:shadow-lg">
                <i :class="icon" class="text-4xl"></i>
                <p class="sm:text-lg sm:font-semibold">{{ title }}</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-zinc-300">
                    <div class="bg-baseBlue h-2.5 rounded-full transition-all duration-500" :style="{ width: progress + '%' }"></div>
                </div>
                <p class="text-sm text-gray-600">{{ progress.toFixed(2) }}%</p>
            </div>
        </slot>
    </div>
</template>