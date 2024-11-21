<script setup>
import { onMounted, ref } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import { useUserStore } from '../stores/useUserStore';
import Career from '../components/ui/Career.vue';
import Button from '../components/ui/Button.vue';

import Navbar from '../components/Navbar.vue';

//Instanciar os stores
const userStore = useUserStore();
const careersStore = useCareerStore();

const selectedCareer = ref(null);

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await careersStore.fetchCareers();
    await userStore.fetchUserId();
});

onMounted(() => {
  userStore.fetchUserId(); // Obtém o ID do usuário autenticado
});

// Função para selecionar uma carreira
const selectCareer = (career) => {
    selectedCareer.value = career;
};
</script>

<template>
    <Navbar />
    <div class="p-4 flex flex-col gap-4 h-screen">
        <h3 class="text-4xl">Selecione a sua carreira</h3>
        <p>ID do usuário logado: {{ userStore.userId }}</p>
        <div class="flex flex-wrap gap-2">
            <div v-for="career in careersStore.careers" :key="career.id" @click="selectCareer(career)">
                <Career :icon="career.icon" :careerName="career.name" :class="{'border-2 border-blue-500' : career === selectedCareer }" />
            </div>
        </div>
        <Button 
            :to="{ name: 'Materias' }"
            :disabled="!selectedCareer"
            class="disabled:opacity-50"
        >
            Avançar
        </Button>
    </div>

</template>
