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

// 1. Defina a propriedade que o componente irá receber
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    // Valor padrão para evitar erros antes dos dados carregarem
    default: () => ({ labels: [], datasets: [] }) 
  }
});

// Os dados mockados foram removidos. O gráfico agora depende da prop.

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Sessões de Estudo por Dia (Últimos 7 dias)'
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
    <!-- 2. Use a prop 'chartData' para alimentar o componente Line -->
    <Line :data="props.chartData" :options="chartOptions" />
  </div>
</template>