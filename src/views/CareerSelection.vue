<script setup>
import { onMounted } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import Career from '../components/ui/Career.vue';
import Button from '../components/ui/Button.vue';

//Acessando o store de carreiras
const careersStore = useCareerStore();

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await careersStore.fetchCareers();
})
</script>

<template>
    <div class="max-w-[1200px] bg-zinc-300 p-[60px] shadow-sm shadow-zinc-200 rounded-md">
        <h2 class="mb-4 font-bold text-xl">Selecione a sua carreira</h2>
        <div class="flex flex-wrap gap-2 w-full">
            <div v-for="career in careersStore.careers" :key="career.id">
                <Career :icon="career.icon" :careerName="career.name"/>
            </div>
        </div>
    <Button class="float-right">Avançar</Button>
    </div>
</template>
