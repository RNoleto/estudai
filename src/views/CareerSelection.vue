<script setup>
import { onMounted } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import Career from '../components/ui/Career.vue';
import Button from '../components/ui/Button.vue';

import Navbar from '../components/Navbar.vue';

//Acessando o store de carreiras
const careersStore = useCareerStore();

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await careersStore.fetchCareers();
})
</script>

<template>
    <div class="w-full">
        <Navbar />
    </div>
    <div class="h-screen">
        <div class="w-full bg-red-400 p-5">
            <h3>Selecione a sua carreira</h3>
            <div class="flex gap-2">
                <div v-for="career in careersStore.careers" :key="career.id">
                    <Career :icon="career.icon" :careerName="career.name"/>
                </div>
            </div>
            <Button :to="{ name: 'Materias'}">Avançar</Button>
        </div>
    </div>
</template>
