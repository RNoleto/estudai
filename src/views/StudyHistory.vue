<script setup>
import History from '../layouts/History.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

</script>

<template>
    <DefaultLayout backgroundOpacity="opacity-20">
        <div class="flex flex-col mt-12 gap-4 p-4 sm:mt-0">
            <h3 class="text-xl font-bold text-gray-700 sm:text-4xl">Histórico de <span class="text-primary">estudos.</span></h3>
            <History />
        </div>
    </DefaultLayout>
</template>