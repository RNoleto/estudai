<template>
  <div class="card">
    <!-- Seletor de semana -->
    <select v-model="selectedWeek" @change="updateChartData" class="p-inputtext p-component">
      <option v-for="(week, index) in weeks" :key="index" :value="week.number">
        Semana {{ week.number }} ({{ week.startDate }} - {{ week.endDate }})
      </option>
    </select>
    <!-- Gráfico -->
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "primevue/chart";
import { useUserStore } from "../stores/useUserStore";
import { useTimeFormatter } from "../composables/useTimeFormatter";
const { formatStudyTime } = useTimeFormatter();

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const chartData = ref({});
const chartOptions = ref({});
const selectedWeek = ref(null);
const weeks = ref([]);

const userStore = useUserStore();

// Retorna o primeiro domingo do ano
const getFirstSundayOfYear = (year) => {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay(); // 0 para domingo
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const firstSunday = new Date(jan1);
  firstSunday.setDate(jan1.getDate() + daysToSunday);
  return firstSunday;
};

// Calcula o número da semana considerando que a semana começa no domingo
// Se a data for anterior ao primeiro domingo, retorna 0
const getWeekNumber = (date) => {
  const year = date.getFullYear();
  const firstSunday = getFirstSundayOfYear(year);
  if (date < firstSunday) return 0;
  const diff = date - firstSunday; // em milissegundos
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
};

// Retorna as datas de início e fim da semana (de domingo a sábado) com base no primeiro domingo do ano
const getStartAndEndDatesOfWeek = (weekNumber, year) => {
  const firstSunday = getFirstSundayOfYear(year);
  const startOfWeek = new Date(firstSunday);
  startOfWeek.setDate(firstSunday.getDate() + (weekNumber - 1) * 7);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const startDateFormatted = startOfWeek.toLocaleDateString('pt-BR', options);
  const endDateFormatted = endOfWeek.toLocaleDateString('pt-BR', options);
  
  return { startDate: startDateFormatted, endDate: endDateFormatted };
};

// Agrupa os registros de estudo por semana
const groupByWeek = (userStudyRecords) => {
  const weeksData = {};
  userStudyRecords.forEach(record => {
    const studyDate = new Date(record.created_at);
    const weekNumber = getWeekNumber(studyDate);
    if (weekNumber === 0) return; // Ignora registros antes do primeiro domingo
    if (!weeksData[weekNumber]) {
      weeksData[weekNumber] = new Array(7).fill(0);
    }
    const dayIndex = studyDate.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    weeksData[weekNumber][dayIndex] += record.study_time;
  });
  console.log("Dados agrupados por semana:", weeksData);
  return weeksData;
};

// Atualiza os dados do gráfico com base na semana selecionada
const updateChartData = () => {
  const weeksData = groupByWeek(userStore.userStudyRecords || []);
  const studyData = weeksData[selectedWeek.value] || new Array(7).fill(0);
  // Aqui, os dados permanecem numéricos (por exemplo, tempo em segundos ou minutos)
  const formattedStudyData = studyData.map(value => value);
  
  const documentStyle = getComputedStyle(document.documentElement);
  chartData.value = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Tempo de estudos",
        backgroundColor: documentStyle.getPropertyValue("--p-cyan-500"),
        borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
        data: formattedStudyData
      }
    ]
  };
  console.log("Dados do gráfico:", chartData.value);
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--p-text-muted-color");
  const surfaceBorder = documentStyle.getPropertyValue("--p-content-border-color");
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: { color: textColor }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return formatStudyTime(tooltipItem.raw);
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: textColorSecondary, font: { weight: 500 } },
        grid: { display: false, drawBorder: false }
      },
      y: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false }
      }
    }
  };
};

// Inicializa os dados: agrupa os registros, gera o array de semanas e filtra semanas futuras
const initialize = () => {
  const weeksData = groupByWeek(userStore.userStudyRecords || []);
  
  // Cria o array de semanas disponíveis a partir das chaves de weeksData
  // Em seguida, filtra para não incluir semanas cujo início seja posterior à data atual
  const currentDate = new Date();
  weeks.value = Object.keys(weeksData)
    .map(weekNumber => {
      const { startDate, endDate } = getStartAndEndDatesOfWeek(weekNumber, new Date().getFullYear());
      return { number: parseInt(weekNumber), startDate, endDate };
    })
    .filter(week => {
      // Converter a data formatada (dd/mm/yyyy) em objeto Date
      const parts = week.startDate.split('/');
      const start = new Date(parts[2], parts[1] - 1, parts[0]);
      return start <= currentDate;
    });
    
  console.log("Semanas disponíveis:", weeks.value);
  
  if (weeks.value.length > 0) {
    selectedWeek.value = weeks.value[0].number;
    updateChartData();
  }
  
  chartOptions.value = setChartOptions();
};

onMounted(() => {
  initialize();
});
</script>
