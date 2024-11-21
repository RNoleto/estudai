<script setup>
import { onMounted } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore';
import Career from '../components/ui/Career.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Navbar from '../components/Navbar.vue';

//Acessando o store de subjections
const subjectStore = useSubjectStore();

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await subjectStore.fetchSubjects();
})
</script>

<template>
    <div class="w-full">
        <Navbar/>
        <div class="p-4 flex flex-col gap-4 h-screen">
            <h3 class="text-4xl">Selecione as matérias que deseja estudar.</h3>
            <p class="bg-red-500">Carreira selecionada aqui</p>
            <Search placeholder="Pesquise a matéria..."/>
            <div class="flex gap-2">
                <div v-for="subject in subjectStore.subjects" :key="subject.id">
                    <Career icon="basil:book-outline" :careerName="subject.name" />
                </div>
            </div>
            <div class="flex gap-2">
                <Button :to="{name:'Carreiras'}">Voltar</Button>
                <Button :to="{name: 'Ciclo'}">Avançar</Button>
            </div>

        </div>
    </div>
    
</template>