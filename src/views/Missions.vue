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

// Tempo total de estudos
const totalStudyTime = computed(() => 
    records.value.reduce((acc, record) => acc + record.study_time, 0)
)

// Total de questões respondidas
const totalQuestionsResolved = computed(() =>
    records.value.reduce((acc, record) => acc + record.questions_resolved, 0)
)

// Total de questões corretas
const totalQuestionsCorrects = computed(() =>
    records.value.reduce((acc, record) => acc + record.correct_answers, 0)
)

// Total de matérias estudadas hoje
const totalSubjectsStudied = computed(() => {
  //Retornar a data de hoje no formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  //Filtrar registros
  const todayRecords = records.value.filter(record => {
    const recordDate = new Date(record.created_at).toISOString().split('T')[0];
    return recordDate === today && record.ativo === 1;
  });

  // Extrair o subject_id de cada registro do dia e colocar em um Set para obter somente os registros unicos
  const uniqueSubjects = new Set(todayRecords.map(record => record.subject_id));

  return uniqueSubjects.size;
});

// Definindo as missões e condições
const missions = ref([
    { id: 1, icon: 'fa-solid fa-chart-line' , title: 'Estudar 3h', type: 'Diária', requiredStudyTime: 3, completed: false },
    { id: 2, icon: 'fa-solid fa-chart-line' , title: "Resolver 100 Questões", type: 'Meta', requiredQuestions: 100, completed: false },
    { id: 3, icon: 'fa-solid fa-chart-line' , title: "50 Questões Corretas", type: 'Meta', requiredCorrectAnswers: 50, completed: false },
    { id: 4, icon: 'fa-solid fa-chart-line' , title: 'Estudar 2 matérias', type: 'Diária', requiredSubjects: 2, completed: false }
])

// Computed para atualizar o status das missões
const updatedMissions = computed(() => {
  return missions.value.map(mission => {
    const updatedMission = { ...mission };

    if (mission.requiredStudyTime !== undefined) {
      updatedMission.completed = totalStudyTime.value >= mission.requiredStudyTime;
    }
    if (mission.requiredQuestions !== undefined) {
      updatedMission.completed = totalQuestionsResolved.value >= mission.requiredQuestions;
    }
    if (mission.requiredCorrectAnswers !== undefined) {
      updatedMission.completed = totalQuestionsCorrects.value >= mission.requiredCorrectAnswers;
    }
    if (mission.requiredSubjects !== undefined) {
      updatedMission.completed = totalSubjectsStudied.value >= mission.requiredSubjects;
    }

    return updatedMission;
  });
});

const dailyMissions = computed(() => {
  return updatedMissions.value.filter(mission => mission.type === 'Diária');
});

const metaMissions = computed(() => {
  return updatedMissions.value.filter(mission => mission.type === 'Meta');
});


useHead({
  title: "Estuday | Suas Metas de Estudo Concluídas",
  meta: [
    {
      name: "description",
      content: "Acompanhe seu progresso e cumpra suas metas de estudo com o Estuday. Organize seu tempo, estude de forma eficiente e alcance seus objetivos."
    },
    {
      property: "og:title",
      content: "Estuday | Suas Metas de Estudo Cumpridas"
    },
    {
      property: "og:description",
      content: "Acompanhe seu progresso e cumpra suas metas de estudo com o Estuday. Organize seu tempo, estude de forma eficiente e alcance seus objetivos."
    },
    {
      property: "og:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      property: "og:url",
      content: "https://estuday.com.br"
    },
    {
      name: "twitter:title",
      content: "Estuday | Suas Metas de Estudo Concluídas"
    },
    {
      name: "twitter:description",
      content: "Acompanhe seu progresso e cumpra suas metas de estudo com o Estuday. Organize seu tempo, estude de forma eficiente e alcance seus objetivos."
    },
    {
      name: "twitter:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      name: "keywords",
      content: "metas de estudo, progresso de estudo, eficiência nos estudos, estudei, Estuday"
    }
  ]
});
</script>

<template>
    <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
        <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Minhas <span
            class="text-primary">missões.</span>
        </h3>
        <p>Missões diarias</p>
        <div class="flex flex-wrap gap-2">              
            <div 
                v-for="mission in dailyMissions"
                :key="mission.id"
                class="flex flex-col items-center space-y-2 border p-4 rounded-lg shadow transition duration-200 ease-in-out hover:shadow-lg"
                :class="mission.completed ? 'bg-green-100 border-green-300' : 'bg-white'"
            >
                <i :class="mission.icon" class="text-2xl text-gray-700"></i>
                <p>{{ mission.title }}</p>
            </div>
        </div>
        <p>Metas</p>
        <div>
            <div class="flex flex-wrap gap-2">
                <div 
                v-for="mission in metaMissions"
                :key="mission.id"
                class="flex flex-col items-center space-y-2 border p-4 rounded-lg shadow transition duration-200 ease-in-out hover:shadow-lg"
                :class="mission.completed ? 'bg-green-100 border-green-300' : 'bg-white'"
            >
                <i :class="mission.icon" class="text-2xl text-gray-700"></i>
                <p>{{ mission.title }}</p>
            </div>
            </div>
        </div>
        <div class="flex flex-col">
            <p class="my-2">Referencias do Sistema</p>
            <pre>Tempo total: {{ totalStudyTime }} horas</pre>
            <pre>Total de questões resolvidas: {{ totalQuestionsResolved }}</pre>
            <pre>Total de questões corretas: {{ totalQuestionsCorrects }}</pre>
            <pre>Total de matérias estudadas hoje: {{ totalSubjectsStudied }}</pre>
        </div>
    </div>
</template>

<style scoped>

</style>