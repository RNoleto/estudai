<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({ labels: [], datasets: [] })
  }
});

const chartOptions = {
  indexAxis: 'x',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Usuários por Carreira'
    }
  },
  scales: {
    y: { // O eixo Y é o dos valores (contagem de usuários)
      beginAtZero: true
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 h-[350px]">
    <Bar :data="props.chartData" :options="chartOptions"/>
  </div>
</template>