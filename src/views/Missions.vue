<script setup>
import { computed, onMounted, ref } from 'vue';
import { useHead } from '@vueuse/head';

import { useUserStore } from '../stores/useUserStore';

const userStore = useUserStore();

onMounted(async () => {
    try{
        await userStore.fetchUserStudyRecords();
    } catch (error) {
        console.error("Erro ao carregar dados de estudo:", error);
    }
})

const records = computed(() => {
    return userStore.userStudyRecords.map(record => {
        return {
            ...record,
            // Formatando o tempo de estudo para horas
            study_time: record.study_time / 3600, // Convertendo para horas
        };
    });
});

// Somando tempo de estudo
const totalStudyTime = computed(() => 
    records.value.reduce((acc, record) => acc + record.study_time, 0)
)

// Somando total de questões
const totalQuestionsResolved = computed(() =>
    records.value.reduce((acc, record) => acc + record.questions_resolved, 0)
)

// Somando total de questões corretas
const totalQuestionsCorrects = computed(() =>
    records.value.reduce((acc, record) => acc + record.correct_answers, 0)
)

// Definindo as missões e condições
const missions = ref([
    { id: 1, icon: 'fa-solid fa-chart-line' , title: 'Estudar 3h', type: 'Diária', requiredStudyTime: 3, completed: false },
    { id: 2, icon: 'fa-solid fa-chart-line' , title: "Resolver 100 Questões", type: 'Meta', requiredQuestions: 100, completed: false }

    
])


// Computed para atualizar o status das missões
const completedMissions = computed(() => {
    //Criar uma cópia atualizada das missões
    return missions.value.map(mission => {
        if(mission.requiredStudyTime !== undefined){
            mission.completed = totalStudyTime.value >= mission.requiredStudyTime
        }
        if(mission.requiredQuestions !== undefined){
            mission.completed = totalQuestionsResolved.value >= mission.requiredQuestions
        }
        return mission
    })
})
</script>

<template>
    <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
        <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Minhas <span
            class="text-primary">missões.</span>
        </h3>
        <p>Missões diarias</p>
        <div class="flex flex-wrap gap-2">              
            <div 
                v-for="mission in completedMissions"
                :key="mission.id"
                class="flex flex-col items-center space-y-2 border p-4 rounded-lg shadow transition duration-200 ease-in-out hover:shadow-lg"
                :class="mission.completed ? 'bg-green-100 border-green-300' : 'bg-white'"
            >
                <i :class="mission.icon" class="text-2xl text-gray-700"></i>
                <p>{{ mission.title }}</p>
            </div>

            <!-- <div class="flex flex-col">
                <pre>Tempo total: {{ totalStudyTime }}</pre>
                <pre>Total de questões resolvidas: {{ totalQuestions }}</pre>
                <pre>Total de questões corretas: {{ totalQuestionsCorrects }}</pre>
            </div> -->
        </div>
    </div>
</template>

<style scoped>

</style>