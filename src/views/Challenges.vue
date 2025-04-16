<script setup>
import { computed, onMounted, ref } from 'vue';
import { useHead } from '@vueuse/head';
import { useUserStore } from '../stores/useUserStore';

import CardChallenger from '../components/CardChallenger.vue';

const userStore = useUserStore();

onMounted(async () => {
  try {
    await userStore.fetchUserStudyRecords();
  } catch (error) {
    console.error("Erro ao carregar dados de estudo:", error);
  }
});

// Mapeia todos os registros e converte o tempo de estudo para horas
const records = computed(() => {
  return userStore.userStudyRecords.map(record => {
    return {
      ...record,
      study_time: record.study_time / 3600, // Converte para horas
    };
  });
});

// Registros de hoje para as métricas diárias
const todayRecords = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return records.value.filter(record => {
    const recordDate = new Date(record.created_at).toISOString().split('T')[0];
    return recordDate === today && record.ativo === 1;
  });
});

// Métricas acumuladas (úteis para missões do tipo "Meta")
const totalStudyTime = computed(() =>
  records.value.reduce((acc, record) => acc + record.study_time, 0)
);

const totalQuestionsResolved = computed(() =>
  records.value.reduce((acc, record) => acc + record.questions_resolved, 0)
);

const totalQuestionsCorrects = computed(() =>
  records.value.reduce((acc, record) => acc + record.correct_answers, 0)
);

// Métricas diárias, extraídas apenas dos registros de hoje
const dailyStudyTime = computed(() =>
  todayRecords.value.reduce((acc, record) => acc + record.study_time, 0)
);

const dailyQuestionsResolved = computed(() =>
  todayRecords.value.reduce((acc, record) => acc + record.questions_resolved, 0)
);

const dailyQuestionsCorrects = computed(() =>
  todayRecords.value.reduce((acc, record) => acc + record.correct_answers, 0)
);

// Total de matérias estudadas hoje (já filtrando os registros de hoje)
const totalSubjectsStudied = computed(() => {
  const uniqueSubjects = new Set(
    todayRecords.value.map(record => {
      // Caso subject_id seja um objeto, extrai o ID corretamente
      return typeof record.subject_id === 'object' ? record.subject_id.id : record.subject_id;
    })
  );
  return uniqueSubjects.size;
});

// Definindo as missões e suas condições
const missions = ref([
  //Missões Diárias de tempo
  { id: 1, icon: 'fa-solid fa-stopwatch', title: 'Estudar 1h', type: 'Diária', requiredStudyTime: 1, completed: false },
  { id: 2, icon: 'fa-solid fa-stopwatch', title: 'Estudar 2h', type: 'Diária', requiredStudyTime: 2, completed: false },
  { id: 3, icon: 'fa-solid fa-stopwatch', title: 'Estudar 3h', type: 'Diária', requiredStudyTime: 3, completed: false },
  { id: 4, icon: 'fa-solid fa-stopwatch', title: 'Estudar 4h', type: 'Diária', requiredStudyTime: 4, completed: false },
  //Missões Diárias para Questões
  { id: 5, icon: 'fa-solid fa-chart-line', title: 'Resolver 50 Questões', type: 'Diária', requiredQuestions: 50, completed: false },
  { id: 6, icon: 'fa-solid fa-chart-line', title: 'Resolver 100 Questões', type: 'Diária', requiredQuestions: 100, completed: false },
  { id: 7, icon: 'fa-solid fa-chart-line', title: 'Resolver 150 Questões', type: 'Diária', requiredQuestions: 150, completed: false },
  { id: 8, icon: 'fa-solid fa-chart-line', title: 'Resolver 200 Questões', type: 'Diária', requiredQuestions: 200, completed: false },
  //Missões Diárias para Questões Corretas
  { id: 9, icon: 'fa-solid fa-chart-line', title: 'Acertar 50 Questões', type: 'Diária', requiredCorrectAnswers: 50, completed: false },
  { id: 10, icon: 'fa-solid fa-chart-line', title: 'Acertar 100 Questões', type: 'Diária', requiredCorrectAnswers: 100, completed: false },
  { id: 11, icon: 'fa-solid fa-chart-line', title: 'Acertar 150 Questões', type: 'Diária', requiredCorrectAnswers: 150, completed: false },
  { id: 12, icon: 'fa-solid fa-chart-line', title: 'Acertar 200 Questões', type: 'Diária', requiredCorrectAnswers: 200, completed: false },
  //Missões Diárias para matérias estudadas
  { id: 13, icon: 'fa-solid fa-stopwatch', title: 'Estudar 2 matérias', type: 'Diária', requiredSubjects: 2, completed: false },
  { id: 14, icon: 'fa-solid fa-stopwatch', title: 'Estudar 3 matérias', type: 'Diária', requiredSubjects: 3, completed: false },
  { id: 15, icon: 'fa-solid fa-stopwatch', title: 'Estudar 4 matérias', type: 'Diária', requiredSubjects: 4, completed: false },
  { id: 16, icon: 'fa-solid fa-stopwatch', title: 'Estudar 5 matérias', type: 'Diária', requiredSubjects: 5, completed: false },
  //Metas de tempo (geralmente mais longas)
  { id: 17, icon: 'fa-solid fa-stopwatch', title: "Estudar 10h", type: 'Meta', requiredStudyTime: 10, completed: false },
  { id: 18, icon: 'fa-solid fa-stopwatch', title: "Estudar 20h", type: 'Meta', requiredStudyTime: 20, completed: false },
  { id: 19, icon: 'fa-solid fa-stopwatch', title: "Estudar 30h", type: 'Meta', requiredStudyTime: 30, completed: false },
  { id: 20, icon: 'fa-solid fa-stopwatch', title: "Estudar 40h", type: 'Meta', requiredStudyTime: 40, completed: false },
  //Metas de questões (geralmente mais cansativas)
  { id: 21, icon: 'fa-solid fa-chart-line', title: "Resolver 500 Questões", type: 'Meta', requiredQuestions: 500, completed: false },
  { id: 22, icon: 'fa-solid fa-chart-line', title: "Resolver 600 Questões", type: 'Meta', requiredQuestions: 600, completed: false },
  { id: 23, icon: 'fa-solid fa-chart-line', title: "Resolver 700 Questões", type: 'Meta', requiredQuestions: 700, completed: false },
  { id: 24, icon: 'fa-solid fa-chart-line', title: "Resolver 800 Questões", type: 'Meta', requiredQuestions: 800, completed: false },
  //Metas de questões corretas (geralmente mais difíceis)
  { id: 25, icon: 'fa-solid fa-chart-line', title: "Acertar 300 Questões", type: 'Meta', requiredCorrectAnswers: 300, completed: false },
  { id: 26, icon: 'fa-solid fa-chart-line', title: "Acertar 400 Questões", type: 'Meta', requiredCorrectAnswers: 400, completed: false },
  { id: 27, icon: 'fa-solid fa-chart-line', title: "Acertar 500 Questões", type: 'Meta', requiredCorrectAnswers: 500, completed: false },
  { id: 28, icon: 'fa-solid fa-chart-line', title: "Acertar 600 Questões", type: 'Meta', requiredCorrectAnswers: 600, completed: false },
]);

// Atualizando as missões com base nas métricas correspondentes
const updatedMissions = computed(() => {
  return missions.value.map(mission => {
    const updatedMission = { ...mission };

    if (mission.type === 'Diária') {
      if (mission.requiredStudyTime !== undefined) {
        updatedMission.completed = dailyStudyTime.value >= mission.requiredStudyTime;
      }
      if (mission.requiredQuestions !== undefined) {
        updatedMission.completed = dailyQuestionsResolved.value >= mission.requiredQuestions;
      }
      if (mission.requiredCorrectAnswers !== undefined) {
        updatedMission.completed = dailyQuestionsCorrects.value >= mission.requiredCorrectAnswers;
      }
      if (mission.requiredSubjects !== undefined) {
        updatedMission.completed = totalSubjectsStudied.value >= mission.requiredSubjects;
      }
    } else if (mission.type === 'Meta') {
      // Utiliza os valores acumulados para as metas
      if (mission.requiredStudyTime !== undefined) {
        updatedMission.completed = totalStudyTime.value >= mission.requiredStudyTime;
      }
      if (mission.requiredQuestions !== undefined) {
        updatedMission.completed = totalQuestionsResolved.value >= mission.requiredQuestions;
      }
      if (mission.requiredCorrectAnswers !== undefined) {
        updatedMission.completed = totalQuestionsCorrects.value >= mission.requiredCorrectAnswers;
      }
    }

    return updatedMission;
  });
});

// Separando missões diárias e metas
const dailyMissions = computed(() => {
  return updatedMissions.value.filter(mission => mission.type === 'Diária');
});

const metaMissions = computed(() => {
  return updatedMissions.value.filter(mission => mission.type === 'Meta');
});

// Função para calcular o progresso da missão em porcentagem
function getMissionProgress(mission) {
  if (mission.type === 'Diária') {
    if (mission.requiredStudyTime !== undefined) {
      const progress = (dailyStudyTime.value / mission.requiredStudyTime) * 100;
      return Math.min(progress, 100);
    }
    if (mission.requiredQuestions !== undefined) {
      const progress = (dailyQuestionsResolved.value / mission.requiredQuestions) * 100;
      return Math.min(progress, 100);
    }
    if (mission.requiredCorrectAnswers !== undefined) {
      const progress = (dailyQuestionsCorrects.value / mission.requiredCorrectAnswers) * 100;
      return Math.min(progress, 100);
    }
    if (mission.requiredSubjects !== undefined) {
      const progress = (totalSubjectsStudied.value / mission.requiredSubjects) * 100;
      return Math.min(progress, 100);
    }
  } else if (mission.type === 'Meta') {
    if (mission.requiredStudyTime !== undefined) {
      const progress = (totalStudyTime.value / mission.requiredStudyTime) * 100;
      return Math.min(progress, 100);
    }
    if (mission.requiredQuestions !== undefined) {
      const progress = (totalQuestionsResolved.value / mission.requiredQuestions) * 100;
      return Math.min(progress, 100);
    }
    if (mission.requiredCorrectAnswers !== undefined) {
      const progress = (totalQuestionsCorrects.value / mission.requiredCorrectAnswers) * 100;
      return Math.min(progress, 100);
    }
  }
  return 0;
}

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
    <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">
      Minhas <span class="text-primary">missões.</span>
    </h3>
    <p>Missões diárias</p>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <CardChallenger 
        v-for="mission in dailyMissions"
        :key="mission.id"
        :title="mission.title"
        :icon="mission.icon"
        :progress="getMissionProgress(mission)"
        :class="mission.completed ? 'bg-green-100 border-green-300' : 'bg-white'"
      />
    </div>
    <p>Metas</p>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <CardChallenger 
        v-for="mission in metaMissions"
        :key="mission.id"
        :title="mission.title"
        :icon="mission.icon"
        :progress="getMissionProgress(mission)"
        :class="mission.completed ? 'bg-green-100 border-green-300' : 'bg-white'"
      />
    </div>
    <h1>Apenas informativo</h1>
    <div class="flex gap-10">
      <div class="border border-gray-300 p-2 rounded-lg shadow-sm bg-white">
        <p class="my-2">Valores fornecidos GLOBAIS pelo Sistema</p>
        <pre>Tempo total: {{ totalStudyTime.toFixed(2) }} horas</pre>
        <pre>Questões resolvidas: {{ totalQuestionsResolved }}</pre>
        <pre>Questões corretas: {{ totalQuestionsCorrects }}</pre>
      </div>
      <div class="border border-gray-300 p-2 rounded-lg shadow-sm bg-white">
        <p class="my-2">Dados do DIA gerado pelo sistema</p>
        <pre>Tempo total: {{ dailyStudyTime.toFixed(2) }} horas</pre>
        <pre>Questões resolvidas: {{ dailyQuestionsResolved }}</pre>
        <pre>Questões corretas: {{ dailyQuestionsCorrects }}</pre>
        <pre>Matérias estudadas: {{ totalSubjectsStudied }}</pre>
      </div>
    </div>
  </div>
</template>
