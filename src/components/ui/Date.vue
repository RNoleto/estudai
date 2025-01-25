<script setup>
import { useCurrentDate } from '../../composables/useCurrentDate';

const { formatDate } = useCurrentDate();

const formattedDate1 = formatDate('dddd');           // "Sábado"
const formattedDate2 = formatDate('DD');   // "25 Janeiro 2025"
const formattedDate3 = formatDate('MO YYYY'); // "Sábado 25/01/2025"
</script>

<template>
    <div class="flex flex-col gap-1 border rounded-2xl px-2 py-4 text-center border-zinc-200 bg-white shadow-sm">
        <p class="text-sm">{{ formattedDate1 }}</p>
        <p class="text-4xl font-bold">{{ formattedDate2 }}</p>
        <p class="text-sm">{{ formattedDate3 }}</p>
      </div>
</template>