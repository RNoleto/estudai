<script setup>
import { computed } from 'vue';

const props = defineProps({
  studyRecords: {
    type: Array,
    required: true
  },
  daysToShow: {
    type: Number,
    default: 30
  }
});


// Garante que o último dia da régua é sempre o dia de hoje (local)
const today = new Date();
today.setHours(0, 0, 0, 0); // Zera hora para evitar problemas de fuso

const studyDatesSet = computed(() => {
  return new Set(props.studyRecords.map(r => {
    const d = new Date(r.created_at);
    d.setHours(0, 0, 0, 0); // Zera hora para comparar só a data
    return d.toISOString().slice(0, 10);
  }));
});

const daysArray = computed(() => {
  // O último item será sempre o dia de hoje
  return Array.from({ length: props.daysToShow }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (props.daysToShow - 1 - i));
    date.setHours(0, 0, 0, 0);
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      studied: studyDatesSet.value.has(iso)
    };
  });
});

const streakRecord = computed(() => {
  let maxStreak = 0;
  let currentStreak = 0;
  let prevStudied = false;
  for (const day of daysArray.value) {
    if (day.studied) {
      currentStreak = prevStudied ? currentStreak + 1 : 1;
      maxStreak = Math.max(maxStreak, currentStreak);
      prevStudied = true;
    } else {
      currentStreak = 0;
      prevStudied = false;
    }
  }
  return maxStreak;
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-calendar-check text-primary"></i>
        <span class="font-semibold text-gray-900">Constância dos Estudos (últimos {{ daysToShow }} dias)</span>
      </div>
      <div class="text-sm text-gray-600">Recorde: <span class="font-bold text-green-700">{{ streakRecord }}</span> dias seguidos</div>
    </div>
    <div class="flex flex-wrap gap-1 mt-2">
      <span v-for="(day, idx) in daysArray" :key="day.date"
        :title="new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) + (day.studied ? ' - Estudou' : ' - Não estudou')"
        class="w-4 h-4 rounded-full border"
        :class="day.studied ? 'bg-baseGreen border-tertiary' : 'bg-secRed border-baseRed opacity-60'">
        <!-- Icones para os marcadores -->
        <!-- <i class="fa-solid fa-check text-white text-xs" v-if="day.studied"></i>
        <i class="fa-solid fa-xmark text-white text-xs" v-else></i> -->
      </span>
    </div>
  </div>
</template>
