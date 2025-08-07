<script setup>
import { computed, onMounted } from 'vue';
import Card from '../components/ui/Card.vue';

// Componentes de Gráficos
import StudySessionChart from '../components/charts/StudySessionChart.vue';
import CareerDistributionChart from '../components/charts/CareerDistributionChart.vue';

import { useAdminStore } from '../../../stores/useAdminStore';

const adminStore = useAdminStore();

const cardData = computed(() => [
    { 
        title: 'Total de usuários', 
        icon: 'fa-solid fa-users', 
        info: adminStore.dashboardStats.totalUsers || 'N/A'
    },
    { 
        title: 'Cadastro do ultimo usuário', 
        icon: 'fa-solid fa-user-plus', 
        info: adminStore.dashboardStats.latestRegistrationDate || 'N/A' 
    },
    {
        title: 'Total de carreiras',
        icon: 'fa-solid fa-briefcase',
        info: adminStore.dashboardStats.totalCareers || 'N/A'
    },
    {
        title: 'Total de Matérias',
        icon: 'fa-solid fa-book',
        info: adminStore.dashboardStats.totalSubjects || 'N/A'
    },
    {
        title: 'Total de Horas',
        icon: 'fa-solid fa-stopwatch-20',
        info: adminStore.dashboardStats.totalHoursStudy || 'N/A'
    }
])

onMounted(() => {
    adminStore.fetchDashboardStats();
    adminStore.fetchStudySessionChartData();
    adminStore.fetchCareerDistributionData();
});

</script>

<template>
    <header class="bg-white text-center shadow-md p-4 md:p-6">
        <p class="font-bold">Administrador | Home</p>
    </header>
    <div class="min-h-screen p-4 md:p-8">
        <div class="flex flex-1 gap-2 flex-wrap mb-4">
            <Card class="flex-1" v-for="item in cardData" :key="item.name">
                <template #title>
                    <div class="flex items-center gap-2 text-xs text-zinc-600">
                        <i :class="item.icon"></i>
                        <p>{{ item.title }}</p>
                    </div>
                </template>
                <template #content>
                    <p>{{ item.info }}</p>
                </template>
            </Card>
        </div>
            <div v-if="adminStore.isChartLoading" class="bg-white rounded-xl shadow p-4 h-[350px] flex items-center justify-center">
                <p class="text-gray-500">Carregando dados do gráfico...</p>
            </div>
            <StudySessionChart 
                v-else 
                :chart-data="adminStore.studySessionChartData" 
                class="w-full mb-4" 
            />
            <div v-if="adminStore.isCareerChartLoading" class="bg-white rounded-xl shadow p-4 h-[350px] flex items-center justify-center">
                <p class="text-gray-500">Carregando dados do gráfico...</p>
            </div>
            <CareerDistributionChart
                v-else
                :chart-data="adminStore.careerDistributionChartData"
                class="w-full mb-4"
            />
    </div>
</template>