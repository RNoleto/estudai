<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/useUserStore';

const userStore = useUserStore();

// Opções para o combobox
const options = [
  { label: 'Total de Questões Resolvidas', value: 'questionsResolved' },
  { label: 'Total de Respostas Corretas', value: 'correctAnswers' },
  { label: 'Total de Respostas Incorretas', value: 'incorrectAnswers' },
];

// Estado para a seleção do combobox
const selectedOption = ref(options[0].value);

// Estado para o tipo de exibição (contador ou porcentagem)
const displayAsPercentage = ref(false);

// Soma o total com base na seleção
const totalValue = computed(() => {
  const totalQuestions = userStore.userStudyRecords.reduce((sum, record) => sum + record.questionsResolved, 0);
  const selectedTotal = userStore.userStudyRecords.reduce(
    (sum, record) => sum + record[selectedOption.value],
    0
  );

  if (displayAsPercentage.value && totalQuestions > 0) {
    return ((selectedTotal / totalQuestions) * 100).toFixed(2) + '%';
  }

  return selectedTotal;
});
</script>

<template>
      <div class="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Estatísticas de Estudo</h2>
        <select
          v-model="selectedOption"
          class="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        >
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="flex items-center justify-between mb-4">
          <label class="text-sm text-gray-600">Exibir como porcentagem</label>
          <input type="checkbox" v-model="displayAsPercentage" class="form-checkbox text-blue-600" />
        </div>
        <!-- Classe condicional para colorir o valor -->
        <p 
          class="text-5xl font-extrabold" 
          :class="{
            'text-blue-600': selectedOption !== 'incorrectAnswers',
            'text-red-600': selectedOption === 'incorrectAnswers'
          }"
        >
          {{ totalValue }}
        </p>
      </div>
  </template>