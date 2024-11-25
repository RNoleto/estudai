<script setup>
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import OptionCard from '../components/ui/OptionCard.vue';
import Navbar from '../components/Navbar.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import { onMounted, ref, computed } from 'vue';

const { formattedDate } = useCurrentDate();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

// Estado para o termo de busca
const searchTerm = ref('');

onMounted(async () => {
    await userStore.fetchUserSubjects();
    await subjectStore.fetchSubjects();
});

// Computed para filtrar matérias selecionadas com base no termo de busca
const filteredSubjects = computed(() => {
    return subjectStore.subjects
        .filter((subject) => userStore.userSubjects.includes(subject.id)) // Apenas matérias do usuário
        .filter((subject) =>
            subject.name.toLowerCase().includes(searchTerm.value.toLowerCase()) // Filtrar pelo termo
        );
});
</script>

<template>
    <div class="h-screen">
        <Navbar />
        <div class="p-4 flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <h3 class="text-4xl">Monte seu ciclo de estudo.</h3>
                <p class="text-sm">{{ formattedDate }}</p>
            </div>
            <p>Carreira: {{ userStore.careerName }}</p>

            <!-- Componente Search com v-model -->
            <Search v-model="searchTerm" />

            <!-- Lista filtrada -->
            <div class="flex flex-wrap gap-2">
                <OptionCard
                    v-for="subject in filteredSubjects"
                    :key="subject.id"
                    :icon="'basil:book-outline'"
                    :careerName="subject.name"
                />
            </div>

            <div class="flex gap-2">
                <Button class="float-right" :to="{ name: 'Materias' }">Voltar</Button>
                <Button class="float-right" :to="{ name: 'Estudar' }">Avançar</Button>
            </div>
        </div>
    </div>
</template>
