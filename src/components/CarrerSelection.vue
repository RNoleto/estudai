<script setup>
import Career from './ui/Career.vue';
</script>

<template>
    <div class="bg-zinc-300 p-[60px] shadow-sm shadow-zinc-200 rounded-md">
        <h2 class="mb-4">Selecione a sua carreira</h2>
        <div class="flex flex-wrap gap-2 w-full">
            <!-- Espaço para o componente -->
            <Career icon="material-symbols:military-tech" careerName="Militar" />
            <Career icon="mdi:school" careerName="Professor" />
            <Career icon="mdi:bank" careerName="Bancária" />
        </div>
    </div>
</template>
