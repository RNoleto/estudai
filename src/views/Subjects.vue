<script setup>
import { onMounted } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useUserStore } from '../stores/useUserStore';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Navbar from '../components/Navbar.vue';

//Acessando o store de subjections
const subjectStore = useSubjectStore();
const userStore = useUserStore();

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await subjectStore.fetchSubjects();
})
</script>

<template>
    <div class="h-screen">
        <Navbar />
        <div class="p-4 flex flex-col gap-4">
            <h3 class="text-4xl">Selecione as matérias que deseja estudar.</h3>
            <p class="text-md">Carreira: {{ userStore.careerName }}</p>
            <Search placeholder="Pesquise a matéria..." />
            <div class="flex gap-2">
                <div v-for="subject in subjectStore.subjects" :key="subject.id">
                    <OptionCard icon="basil:book-outline" :careerName="subject.name" />
                </div>
            </div>
            <div class="flex gap-2">
                <Button :to="{ name: 'Carreiras' }">Voltar</Button>
                <Button :to="{ name: 'Ciclo' }">Avançar</Button>
            </div>

        </div>
    </div>

</template>