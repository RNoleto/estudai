<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import IsLoading from "../components/ui/IsLoading.vue"

const userStore = useUserStore();

// Opções para o combobox
const options = [
  { label: 'Total de Questões Resolvidas', value: 'questions_resolved' },
  { label: 'Total de Respostas Corretas', value: 'correct_answers' },
  { label: 'Total de Respostas Incorretas', value: 'incorrect_answers' },
];

// Estado para a seleção do combobox
const selectedOption = ref(options[0].value);

// Estado para o tipo de exibição (contador ou porcentagem)
const displayAsPercentage = ref(false);

// Soma o total com base na seleção
const totalValue = computed(() => {
  const totalQuestions = userStore.userStudyRecords.reduce((sum, record) => sum + record.questions_resolved, 0);
  const selectedTotal = userStore.userStudyRecords.reduce(
    (sum, record) => sum + record[selectedOption.value],
    0
  );

  if (displayAsPercentage.value && totalQuestions > 0) {
    return ((selectedTotal / totalQuestions) * 100).toFixed(2) + '%';
  }

  return selectedTotal;
});

const isLoading = ref(true);

onMounted(async () => {
  try {
    await userStore.fetchUserStudyRecords();
  } catch (error) {
    console.error("Erro ao carregar tempo de estudo:", error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <IsLoading v-if="isLoading" />    
  <div v-else>
    <div class="bg-white shadow-md rounded-lg p-6 text-center min-h-[250px]">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Estatísticas de Estudo</h2>
      <select v-model="selectedOption"
        class="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="flex items-center justify-between mb-4">
        <label class="text-sm text-gray-600">Exibir como porcentagem</label>
        <input type="checkbox" v-model="displayAsPercentage" class="form-checkbox text-blue-600" />
      </div>
      <!-- Classe condicional para colorir o valor -->
      <p class="text-5xl font-extrabold" :class="{
        'text-blue-600': selectedOption === 'questions_resolved',
        'text-green-600': selectedOption === 'correct_answers',
        'text-red-600': selectedOption === 'incorrect_answers'
      }">
        {{ totalValue }}
      </p>
    </div>
  </div>
</template>