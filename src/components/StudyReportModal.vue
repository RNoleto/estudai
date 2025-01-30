<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useAIStore } from "../stores/aiStore"; 
import { marked } from "marked";

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
    aiStore.$reset();
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const generateAIInsights = async () => {
    if (!studyRecords.value.length) {
        insights.value = "Nenhum dado de estudo encontrado. Tente estudar por pelo menos 30 minutos para gerar insights!";
        return;
    }

    localLoading.value = true;
    
    try {
        const studyData = studyRecords.value.map(record => `Matéria: ${record.subjectName}\nTópico: ${record.topic || 'N/A'}\nTempo de estudo: ${formatTime(record.study_time)}\nAcertos: ${record.correct_answers}\nErros: ${record.incorrect_answers}`).join('\n');

        const prompt = `Atue como um tutor especialista em aprendizagem. Analise os seguintes dados de estudo e gere insights detalhados:\n\nDados do Estudante:\n${studyData}\n\nGere um relatório com:\n1. Análise de desempenho por matéria\n2. Sugestões de melhoria baseadas nas estatísticas\n3. Recomendações personalizadas de estudo\n4. Formate a resposta usando markdown básico`;

        await aiStore.sendMessage(prompt);
        
        if (aiStore.error) {
            insights.value = "Erro ao gerar insights. Tente novamente mais tarde.";
        } else {
            insights.value = marked(aiStore.response); // Use marked para converter o markdown em HTML
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
        <div class="bg-white p-6 rounded-lg shadow-lg">
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
                <div class="prose max-w-none w-[1200px] h-[600px] overflow-hidden overflow-y-scroll text-base" v-html="insights"></div> <!-- Renderiza o HTML gerado pelo Markdown -->
            </div>

            <!-- Tabela de Registros -->
            <div v-if="studyRecords.length > 0" class="mt-4">
                <table class="w-full border-collapse border border-gray-200">
                    <!-- Tabela de registros -->
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

<style scoped>
/* Estilos gerais para a tabela */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

/* Estilos para as células da tabela */
th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #e1e1e1;
}

/* Cabeçalho da tabela */
th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
}

/* Linhas alternadas para melhorar a legibilidade */
tr:nth-child(even) {
    background-color: #f9f9f9;
}

/* Estilos para os links, se houver algum */
a {
    color: #1a73e8;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Estilo para o título da seção */
h3 {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 10px;
}

/* Estilo para os parágrafos e listas */
p, ul {
    font-size: 0.875rem;
    color: #4a5568;
}

ul {
    list-style-type: disc;
    padding-left: 20px;
}

/* Para o carregamento */
div.animate-spin {
    margin: auto;
}
</style>
