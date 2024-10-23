<script setup>
import Career from './ui/Career.vue';
import Button from './ui/Button.vue';
</script>

<template>
    <div class="max-w-[1200px] bg-zinc-300 p-[60px] shadow-sm shadow-zinc-200 rounded-md">
        <h2 class="mb-4 font-bold text-xl">Selecione a sua carreira</h2>
        <div class="flex flex-wrap gap-2 w-full">
            <Career icon="material-symbols:military-tech" careerName="Militar" />
            <Career icon="mdi:school" careerName="Educação" />
            <Career icon="mdi:bank" careerName="Bancária" />
            <Career icon="mdi:bank" careerName="Fiscal" />
            <Career icon="wpf:administrator" careerName="AFO" />
        </div>
    <Button class="float-right">Avançar</Button>
    </div>
</template>
