<template>
  <div class="card">
    <!-- Seletor de semana -->
    <select v-model="selectedWeek" @change="updateChartData" class="p-inputtext p-component">
      <option v-for="(week, index) in weeks" :key="index" :value="week.number">
        Semana {{ week.number }} ({{ week.startDate }} - {{ week.endDate }})
      </option>
    </select>

    <!-- Seletor de métrica -->
    <select v-model="selectedMetric" @change="updateChartData" class="p-inputtext p-component mt-2">
      <option v-for="option in metricOptions" :key="option.value" :value="option.value">
        {{ option.label }}
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
const selectedMetric = ref("study_time");
const metricOptions = ref([
  { label: "Tempo de estudo", value: "study_time" },
  { label: "Total de questões", value: "questions_resolved" },
  { label: "Questões corretas", value: "correct_answers" },
  { label: "Questões incorretas", value: "incorrect_answers" }
]);

const userStore = useUserStore();

// Função para obter o primeiro domingo do ano
const getFirstSundayOfYear = (year) => {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay(); // 0 para domingo
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const firstSunday = new Date(jan1);
  firstSunday.setDate(jan1.getDate() + daysToSunday);
  return firstSunday;
};

// Calcula o número da semana baseado no primeiro domingo do ano
const getWeekNumber = (date) => {
  const year = date.getFullYear();
  const firstSunday = getFirstSundayOfYear(year);
  if (date < firstSunday) return 0;
  const diff = date - firstSunday;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
};

// Retorna as datas de início e fim da semana (domingo a sábado)
const getStartAndEndDatesOfWeek = (weekNumber, year) => {
  const firstSunday = getFirstSundayOfYear(year);
  const startOfWeek = new Date(firstSunday);
  startOfWeek.setDate(firstSunday.getDate() + (weekNumber - 1) * 7);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return {
    startDate: startOfWeek.toLocaleDateString('pt-BR', options),
    endDate: endOfWeek.toLocaleDateString('pt-BR', options)
  };
};

// Agrega os registros por semana e por métrica
const aggregateByWeek = (records) => {
  const result = {};
  records.forEach(record => {
    const studyDate = new Date(record.created_at);
    const weekNumber = getWeekNumber(studyDate);
    if (weekNumber === 0) return; // Ignora registros antes do primeiro domingo
    if (!result[weekNumber]) {
      result[weekNumber] = {
        study_time: new Array(7).fill(0),
        questions_resolved: new Array(7).fill(0),
        correct_answers: new Array(7).fill(0),
        incorrect_answers: new Array(7).fill(0)
      };
    }
    const dayIndex = studyDate.getDay();
    result[weekNumber].study_time[dayIndex] += record.study_time;
    result[weekNumber].questions_resolved[dayIndex] += record.questions_resolved;
    result[weekNumber].correct_answers[dayIndex] += record.correct_answers;
    result[weekNumber].incorrect_answers[dayIndex] += record.incorrect_answers;
  });
  console.log("Dados agregados por semana:", result);
  return result;
};

// Atualiza o gráfico com base na semana e métrica selecionadas
const updateChartData = () => {
  const aggregatedData = aggregateByWeek(userStore.userStudyRecords || []);
  const weekData = aggregatedData[selectedWeek.value] || {
    study_time: new Array(7).fill(0),
    questions_resolved: new Array(7).fill(0),
    correct_answers: new Array(7).fill(0),
    incorrect_answers: new Array(7).fill(0)
  };
  
  const metricData = weekData[selectedMetric.value].map(value => value);
  const documentStyle = getComputedStyle(document.documentElement);

  // Define cores para cada métrica
  const metricColors = {
    study_time: { background: "#2196f3", border: "#2196f3" },
    questions_resolved: { background: "#4caf50", border: "#4caf50" },
    correct_answers: { background: "#2196f3", border: "#2196f3" },
    incorrect_answers: { background: "#f44336", border: "#f44336" }
  };

  chartData.value = {
    labels: daysOfWeek,
    datasets: [
      {
        label: metricOptions.value.find(opt => opt.value === selectedMetric.value).label,
        backgroundColor: metricColors[selectedMetric.value].background,
        borderColor: metricColors[selectedMetric.value].border,
        data: metricData
      }
    ]
  };

  console.log("Dados do gráfico:", chartData.value);
};

// Define opções do gráfico com tooltip ajustado para cada métrica
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
            // Se a métrica for tempo, formata; caso contrário, mostra o número
            if (selectedMetric.value === "study_time") {
              return formatStudyTime(tooltipItem.raw);
            } else {
              return tooltipItem.raw;
            }
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

// Inicializa os dados, agrupando registros por semana e filtrando semanas futuras
const initialize = () => {
  const aggregated = aggregateByWeek(userStore.userStudyRecords || []);
  const currentDate = new Date();
  weeks.value = Object.keys(aggregated)
    .map(weekNum => {
      const { startDate, endDate } = getStartAndEndDatesOfWeek(weekNum, new Date().getFullYear());
      return { number: parseInt(weekNum), startDate, endDate };
    })
    .filter(week => {
      const parts = week.startDate.split('/');
      // Converter a data de início (dd/mm/yyyy) para um objeto Date
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
