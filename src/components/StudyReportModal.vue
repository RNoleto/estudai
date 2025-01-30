<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useAIStore } from "../stores/aiStore"; // Importe sua store de IA

const userStore = useUserStore();
const aiStore = useAIStore();
const isOpen = ref(false);
const studyRecords = ref([]);
const insights = ref("");
const localLoading = ref(false);

onMounted(async () => {
    await userStore.fetchUserStudyRecords();
    studyRecords.value = userStore.userStudyRecords;
});

watch(() => userStore.userStudyRecords, (newRecords) => {
    studyRecords.value = newRecords;
});

const openModal = async () => {
    isOpen.value = true;
    await userStore.fetchUserStudyRecords();
    await generateAIInsights();
};

const closeModal = () => {
    isOpen.value = false;
    aiStore.$reset(); // Limpa o estado da IA ao fechar
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const generateBaseInsights = () => {
    // ... (mantenha sua lógica atual de generateInsights aqui)
};

const generateAIInsights = async () => {
    if (!studyRecords.value.length) {
        insights.value = "Nenhum dado de estudo encontrado. Tente estudar por pelo menos 30 minutos para gerar insights!";
        return;
    }

    localLoading.value = true;
    
    try {
        // Construir o prompt com dados formatados
        const studyData = studyRecords.value.map(record => `
            Matéria: ${record.subjectName}
            Tópico: ${record.topic || 'N/A'}
            Tempo de estudo: ${formatTime(record.study_time)}
            Acertos: ${record.correct_answers}
            Erros: ${record.incorrect_answers}
        `).join('\n');

        const prompt = `Atue como um tutor especialista em aprendizagem. Analise os seguintes dados de estudo e gere insights detalhados:
        
        Dados do Estudante:
        ${studyData}
        
        Gere um relatório com:
        1. Análise de desempenho por matéria
        2. Sugestões de melhoria baseadas nas estatísticas
        3. Recomendações personalizadas de estudo
        4. Formate a resposta usando markdown básico`;

        await aiStore.sendMessage(prompt);
        
        if (aiStore.error) {
            insights.value = "Erro ao gerar insights. Tente novamente mais tarde.";
        } else {
            insights.value = aiStore.response;
        }
    } catch (error) {
        console.error("Erro na geração de insights:", error);
        insights.value = "Não foi possível gerar insights no momento. Tente novamente mais tarde.";
    } finally {
        localLoading.value = false;
    }
};

defineExpose({ openModal });
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div class="flex justify-between items-center border-b pb-2">
                <h2 class="text-xl font-bold">Relatório de Estudos & Insights</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <!-- Estado de Carregamento -->
            <div v-if="localLoading" class="mt-4 p-4 text-center">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                <p class="mt-2 text-gray-600">Analisando seus dados com IA...</p>
            </div>

            <!-- Insights Gerados -->
            <div v-else class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 class="text-lg font-semibold text-blue-700 mb-2">🧠 Coach de Estudos Inteligente</h3>
                <div class="prose max-w-none" v-html="insights"></div>
            </div>

            <!-- Tabela de Registros -->
            <div v-if="studyRecords.length > 0" class="mt-4">
                <table class="w-full border-collapse border border-gray-200">
                    <!-- Mantenha sua tabela existente -->
                </table>
            </div>

            <p v-else class="text-center text-gray-500 mt-4">Nenhum registro de estudo encontrado.</p>

            <div class="mt-4 flex justify-end">
                <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>