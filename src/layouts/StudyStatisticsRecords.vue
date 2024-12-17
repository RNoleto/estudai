<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

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
  <div v-if="isLoading" class="bg-zinc-50 w-[293px] grid content-center justify-center shadow-md rounded-lg">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor" />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill" />
    </svg>
    <span class="sr-only">Loading...</span>
  </div>
  <div v-else class="bg-white shadow-md rounded-lg p-6 text-center">
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
</template>