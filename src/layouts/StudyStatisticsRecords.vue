<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import IsLoading from "../components/ui/IsLoading.vue"

const userStore = useUserStore();

// Opções para o combobox
const options = [
  { label: 'Questões resolvidas', value: 'questions_resolved' },
  { label: 'Questões corretas', value: 'correct_answers' },
  { label: 'Questões incorretas', value: 'incorrect_answers' },
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
  <!-- <IsLoading v-if="isLoading" />     -->
  <div>
    <div class="bg-white shadow-md flex flex-col gap-1 items-center rounded-2xl border border-tertiary px-2 py-4 text-center sm:justify-center sm:p-6 sm:min-h-[250px]">
      <h2 class="text-sm sm:text-xl font-medium text-gray-700">Questões respondidas</h2>
      <select v-model="selectedOption"
        class="w-full text-xs p-1 border border-tertiary rounded-lg">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <!-- Classe condicional para colorir o valor -->
      <p class="text-2xl sm:text-5xl font-extrabold" :class="{
        'text-primary': selectedOption === 'questions_resolved',
        'text-green-600': selectedOption === 'correct_answers',
        'text-red-600': selectedOption === 'incorrect_answers'
      }">
        {{ totalValue }}
      </p>
      <div class="flex items-center py-2 gap-1">
        <input type="checkbox" v-model="displayAsPercentage" class="form-checkbox text-blue-600" />
        <label class="text-xs text-gray-600">Exibir como porcentagem</label>
      </div>
    </div>
  </div>
</template>