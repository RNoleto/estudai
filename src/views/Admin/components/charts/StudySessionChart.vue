<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({ labels: [], datasets: [] }) 
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Dados Gerais de Estudos (Últimos 7 dias)'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Deixar o Chart.js calcular o passo é geralmente melhor
      }
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 h-[350px]">
    <Line :data="props.chartData" :options="chartOptions" />
  </div>
</template>