<script setup>
import { onMounted } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore';
import Career from '../components/ui/Career.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';

//Acessando o store de subjections
const subjectStore = useSubjectStore();

//Buscar as carreiras assim que o componente for montado
onMounted(async () => {
    await subjectStore.fetchSubjects();
})
</script>

<template>
    
        <h2 class="mb-4 font-bold text-xl">Selecione as matérias que deseja estudar.</h2>
        <Search placeholder="Pesquise a matéria..."/>
        <div class="mt-4 flex flex-wrap gap-2 w-full">
            <div v-for="subject in subjectStore.subjects" :key="subject.id">
                <Career icon="basil:book-outline" :careerName="subject.name" />
            </div>
        </div>
        <Button class="float-right">Avançar</Button>
    
</template>