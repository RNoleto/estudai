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
        info: adminStore.dashboardStats.totalUsers 
    },
    // Informações ainda não implementadas no backend
    // { title: 'Usuários ativos', icon: 'fa-solid fa-check', info: '30' },
    // { title: 'Usuários inativos', icon: 'fa-solid fa-circle-xmark', info: '21' },
    { 
        title: 'Cadastro do ultimo usuário', 
        icon: 'fa-solid fa-calendar', 
        info: adminStore.dashboardStats.latestRegistrationDate || 'N/A' 
    }
])

onMounted(() => {
    adminStore.fetchDashboardStats();
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
                    <i :class="item.icon"></i>
                    <p>{{ item.title }}</p>
                </template>
                <template #content>
                    <p>{{ item.info }}</p>
                </template>
            </Card>
        </div>
        
        <!-- Gráfico de sessões -->
        <StudySessionChart class="w-full mb-4" />
        <CareerDistributionChart class="w-full mb-4" />
        
        <div class="mt-2">
            <p>Essa tela tera as seguintes informações GERAIS:</p>
            <ul class="p-2">
                <li># OK - Usar cards e Graficos</li>
                <li># OK - 4/5 cards para usuários (totais, ativos, inativos premium e ultimo cadastro)</li>
                <li># OK - Criar graficos abaixo</li>
                <li># Usuários cadastrados por mês</li>
                <li># Ativo/inativo/premium</li>
                <li># Crescimento total ao longo do tempo</li>
            </ul>
            <ul class="p-2">
                <li># Total de carreiras cadastradas</li>
                <li># Rank de carreira com total de usuários em cada uma</li>
            </ul>
            <p>Ainda é um rascunho de tela com base nas infos do banco de dados</p>
        </div>
    </div>
</template>