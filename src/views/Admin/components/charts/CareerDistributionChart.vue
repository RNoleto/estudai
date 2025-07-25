<script setup>
import { onMounted, computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useCareerStore } from '../../../../stores/useCareerStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const careerStore= useCareerStore()

onMounted(() => {
    if(!careerStore.careers.length){
        careerStore.fetchCareers()
    }
})

const labels = computed(() => 
    careerStore.careers.map(c => c.name)
)

const dataValues = computed(() => 
    careerStore.careers.map(() => matchMedia.floor(Math.random() * 200) + 10)
)

// MOCK dos dados, depois consumir por dados reais no banco de dados
const chartData = {
    labels: labels.value,
    datasets: [
        {
            label: 'Usuários por Carreira',
            data: [220, 180, 150, 90, 65, 100, 20, 189, 250, 88, 0, 65, 33, 18, 95, 58, 66, 75, 98, 10, 3, 52, 3, 16 ], //Valores Mockados, substituir por dataValues.value
            backgroundColor: '#10B981',
            borderRadius: 8,
            barThickness: 15
        }
    ]
}

const chartOptions = {
    indexAxis: 'x', // barras horizontais
    responsive: true,
    maintainAspectRation: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Distribuição de Estudos por Carreira'
        }
    },
    scales:{
        x: {
            beginAtZero: true,
            ticks: {
                stepSize: 50
            }
        }
    }    
}
</script>

<template>
    <div class="bg-white rounded-xl shadow p-4 h-[350px]">
        <Bar :data="chartData" :options="chartOptions"/>
    </div>
</template>