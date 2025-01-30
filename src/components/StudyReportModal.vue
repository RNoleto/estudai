<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "../stores/useUserStore";

const userStore = useUserStore();
const isOpen = ref(false);

// Computed para acessar os registros de estudo
const studyRecords = ref([]);
const insights = ref("");

onMounted(async () => {
    await userStore.fetchUserStudyRecords();
    console.log("Dados carregados:", userStore.userStudyRecords); // Debug
    studyRecords.value = userStore.userStudyRecords;
});

watch(() => userStore.userStudyRecords, (newRecords) => {
    console.log("Novos registros:", newRecords); // Debug
    studyRecords.value = newRecords;
});

// Função para abrir o modal e gerar insights
const openModal = async () => {
  isOpen.value = true;
  await userStore.fetchUserStudyRecords();
  generateInsights();
};

// Fechar o modal
const closeModal = () => {
  isOpen.value = false;
};

// Formatar tempo de estudo de segundos para HH:MM:SS
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// Função para gerar insights baseados nos dados do usuário
const generateInsights = () => {
  if (!studyRecords.value.length) {
    insights.value = "Nenhum dado de estudo encontrado. Tente estudar por pelo menos 30 minutos para gerar insights!";
    return;
  }

  let totalTime = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let weakestSubject = null;
  let lowestScore = Infinity;

  // Analisando os dados de estudo
  studyRecords.value.forEach(record => {
    totalTime += record.study_time;
    totalCorrect += record.correct_answers;
    totalIncorrect += record.incorrect_answers;

    let successRate = record.correct_answers / (record.correct_answers + record.incorrect_answers);
    if (successRate < lowestScore) {
      lowestScore = successRate;
      weakestSubject = record.subjectName;
    }
  });

  let totalQuestions = totalCorrect + totalIncorrect;
  let accuracyRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
  let avgStudyTime = totalTime / studyRecords.value.length;

  // Criando sugestões personalizadas
  let tips = [];

  if (totalTime < 1800) {
    tips.push("Tente estudar pelo menos 30 minutos por dia para melhorar a retenção do conteúdo.");
  }

  if (accuracyRate < 70) {
    tips.push("Revise os conceitos básicos antes de avançar para tópicos mais difíceis.");
  } else if (accuracyRate > 90) {
    tips.push("Ótimo desempenho! Que tal desafiar-se com questões mais avançadas?");
  }

  if (weakestSubject) {
    tips.push(`Seu maior desafio parece ser **${weakestSubject}**. Tente revisar esse assunto com mais atenção.`);
  }

  insights.value = `📊 **Resumo do estudo:**  
  - Tempo total de estudo: **${formatTime(totalTime)}**  
  - Taxa de acerto: **${accuracyRate}%**  
  - Tempo médio por sessão: **${formatTime(avgStudyTime)}**  
  - Matéria mais desafiadora: **${weakestSubject || "Nenhuma específica"}**  

  🔍 **Sugestões para melhorar:**  
  ${tips.length ? tips.map(t => `- ${t}`).join("\n  ") : "Continue assim, ótimo trabalho!"}`;
};

defineExpose({ openModal });

</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full">
      <!-- Título e botão de fechar -->
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="text-xl font-bold">Relatório de Estudos & Insights</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <!-- Insights do Coach de Estudos -->
      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 class="text-lg font-semibold text-blue-700">📢 Coach de Estudos</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ insights }}</p>
      </div>

      <!-- Lista de registros -->
      <div v-if="studyRecords.length > 0" class="mt-4">
        <table class="w-full border-collapse border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-200 p-2 text-left">Matéria</th>
              <th class="border border-gray-200 p-2">Tópico</th>
              <th class="border border-gray-200 p-2">Tempo</th>
              <th class="border border-gray-200 p-2">Acertos</th>
              <th class="border border-gray-200 p-2">Erros</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in studyRecords" :key="record.id" class="border border-gray-200">
              <td class="p-2">{{ record.subjectName }}</td>
              <td class="p-2">{{ record.topic || 'N/A' }}</td>
              <td class="p-2">{{ formatTime(record.study_time) }}</td>
              <td class="p-2">{{ record.correct_answers }}</td>
              <td class="p-2">{{ record.incorrect_answers }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensagem caso não tenha registros -->
      <p v-else class="text-center text-gray-500 mt-4">Nenhum registro de estudo encontrado.</p>

      <!-- Botão de fechar -->
      <div class="mt-4 flex justify-end">
        <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Fechar</button>
      </div>
    </div>
  </div>
</template>
