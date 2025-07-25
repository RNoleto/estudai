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
} from 'chart.js'

import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Dados de exemplo para mock
const chartData = {
  labels: ['17 Jul', '18 Jul', '19 Jul', '20 Jul', '21 Jul', '22 Jul', '23 Jul'],
  datasets: [
    {
      label: 'Sessões de Estudo',
      data: [15, 23, 12, 30, 27, 18, 35],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 7
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Sessões de Estudo por Dia'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5
      }
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 h-[350px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
