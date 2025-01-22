<script setup>
defineProps({
    title: {
        type: String,
        required: true,
        default: "Card Title"
    },
    content: {
        type: String,
        required: true,
        default: "Card Content"
    },
    footer: {
        type: String,
        required: true,
        default: "Card Footer"
    }
});
</script>

<template>
    <!-- Mobile First -->
    <div class="border rounded-lg shadow-md border-zinc-200 p-2 bg-white text-xs">
        <p class="text-sm">{{ title }}</p>
        <p>{{ content }}</p>
        <p>{{ footer }}</p>
    </div>
</template>