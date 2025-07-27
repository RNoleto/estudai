<script setup>
import { ref, computed } from 'vue'
import { useAIStore } from '../stores/aiStore';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

const aiStore = useAIStore();
const generating = ref(false);

// --- [CORREÇÃO] ESTADO CENTRALIZADO PARA OS DADOS DO PLANO ---
const studyPlanData = ref(null); // Usaremos este para armazenar o JSON

// --- ESTADOS DO MODAL ---
const isModalOpen = ref(false);
const currentWeekIndex = ref(0);

// --- [REMOVIDO] Variáveis antigas que não são mais necessárias ---
// const generatedPlan = ref('');
// const weeklyTables = computed(...);
// const currentWeekContent = computed(...);

// Dados do cronograma (sem alterações)
const cargo = ref('')
const startDate = ref('')
const endDate = ref('')
const dailyHours = ref(4)
const method = ref('import')
const editalText = ref('')
const subjects = ref([])
const newSubject = ref('')
const availableDays = ref([
    { name: 'Domingo', value: 'sunday', checked: false },
    { name: 'Segunda-feira', value: 'monday', checked: true },
    { name: 'Terça-feira', value: 'tuesday', checked: true },
    { name: 'Quarta-feira', value: 'wednesday', checked: true },
    { name: 'Quinta-feira', value: 'thursday', checked: true },
    { name: 'Sexta-feira', value: 'friday', checked: true },
    { name: 'Sábado', value: 'saturday', checked: false }
])
const includeRevisions = ref(true)
const includeSimulados = ref(true)

// --- [CORREÇÃO] COMPUTED PROPERTIES BASEADAS NA NOVA ESTRUTURA JSON ---
const currentWeekData = computed(() => {
    if (!studyPlanData.value || !studyPlanData.value.weeks || studyPlanData.value.weeks.length === 0) {
        return null;
    }
    return studyPlanData.value.weeks[currentWeekIndex.value];
});

const totalWeeks = computed(() => {
    return studyPlanData.value?.weeks?.length || 0;
});

const canExport = computed(() => {
    return totalWeeks.value > 0 && !generating.value;
});

// Função para cores (sem alterações)
const getSubjectColor = (subject) => {
    const colors = [
        'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800',
        'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800', 'bg-indigo-100 text-indigo-800',
        'bg-red-100 text-red-800', 'bg-sky-100 text-sky-800',
    ];
    const key = subject.toLowerCase().replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

// Funções do Modal e Navegação (agora usando 'totalWeeks')
const nextWeek = () => {
    if (currentWeekIndex.value < totalWeeks.value - 1) {
        currentWeekIndex.value++;
    }
};

const previousWeek = () => {
    if (currentWeekIndex.value > 0) {
        currentWeekIndex.value--;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};

// Funções de CRUD de matérias (sem alterações)
const addSubject = () => {
    if (newSubject.value && !subjects.value.some(s => s.name === newSubject.value)) {
        subjects.value.push({ name: newSubject.value, topics: [], newTopic: '' });
        newSubject.value = '';
    }
};

const addTopicToSubject = (index) => {
    const subject = subjects.value[index];
    if (subject.newTopic && !subject.topics.includes(subject.newTopic)) {
        subject.topics.push(subject.newTopic);
        subject.newTopic = '';
    }
};

const exportToPDF = () => {
    const element = document.getElementById("currentWeekContent");
    if (!element) return;
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `cronograma-semana-${currentWeekIndex.value + 1}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
};

// --- [CORREÇÃO] FUNÇÃO PRINCIPAL ATUALIZADA PARA USAR JSON ---
const generateStudyPlanWithAI = async () => {
    generating.value = true;
    studyPlanData.value = null; // Limpa os dados antigos
    aiStore.$reset();

    const selectedDays = availableDays.value
        .filter(day => day.checked)
        .map(d => d.name)
        .join(', ');

    let programContent = '';
    if (method.value === 'import') {
        programContent = editalText.value;
    } else {
        programContent = subjects.value.map(subject => {
            const topicList = subject.topics.length > 0
                ? subject.topics.map(topic => `  - ${topic}`).join('\n')
                : '  - (Nenhum tópico específico listado)';
            return `${subject.name}:\n${topicList}`;
        }).join('\n\n');
    }

    // O prompt continua o mesmo, pedindo JSON
    const prompt = `
Você é um especialista em planejar cronogramas de estudo para concursos. Sua tarefa é criar um cronograma detalhado e retornar os dados em formato JSON.

<instrucoes_gerais>
- Crie um cronograma semanal até que TODO o conteúdo programático seja coberto.
- Cada tarefa de estudo deve durar entre 40-50 minutos.
- Intercale diferentes disciplinas no mesmo dia.
- O JSON deve ser a ÚNICA coisa na sua resposta. Não use markdown (como \`\`\`json). Sua resposta deve começar com { e terminar com }.
</instrucoes_gerais>

<formato_json_obrigatorio>
Use EXATAMENTE esta estrutura JSON. Preencha os valores.

{
  "weeks": [
    {
      "weekNumber": 1,
      "dateRange": "DD/MM/YYYY a DD/MM/YYYY",
      "schedule": [
        {
          "dayName": "Segunda-feira",
          "tasks": [
            { "taskName": "Tarefa 1", "subject": "NOME DA DISCIPLINA", "activity": "Descrição da atividade..." },
            { "taskName": "Tarefa 2", "subject": "NOME DA DISCIPLINA", "activity": "Descrição da atividade..." }
          ]
        }
      ],
      "recommendations": "Texto com recomendações práticas para a semana (em markdown).",
      "motivation": "Frase motivacional curta."
    }
  ],
  "finalMessage": "Texto de encerramento e dicas finais (em markdown)."
}
</formato_json_obrigatorio>

<dados_aluno>
- Cargo Almejado: ${cargo.value}
- Período de Estudos: de ${startDate.value || 'data de início não informada'} até ${endDate.value || 'data da prova não informada'}
- Horas de Estudo por Dia: ${dailyHours.value} horas
- Dias Disponíveis: ${selectedDays}
- Incluir Revisões Periódicas: ${includeRevisions.value ? 'Sim' : 'Não'}
- Incluir Simulados: ${includeSimulados.value ? 'Sim' : 'Não'}
</dados_aluno>

<conteudo_programatico>
${programContent}
</conteudo_programatico>
`.trim();

    try {
        await aiStore.sendMessage(prompt);

        if (aiStore.error) {
            throw new Error("A IA retornou um erro.");
        }

        // --- [NOVA LÓGICA DE LIMPEZA] ---
        // Pega a resposta crua da IA
        let rawResponse = aiStore.response;

        // Procura pelo conteúdo real do JSON, ignorando os blocos de markdown
        const jsonMatch = rawResponse.match(/{[\s\S]*}/);

        if (jsonMatch && jsonMatch[0]) {
            // Se encontrou, faz o parse apenas da parte que corresponde ao JSON
            const cleanedJson = jsonMatch[0];
            studyPlanData.value = JSON.parse(cleanedJson);
        } else {
            // Se nem isso encontrou, a resposta está completamente errada
            throw new Error("Não foi possível extrair um objeto JSON da resposta da IA.");
        }
        // --- FIM DA LÓGICA DE LIMPEZA ---

        // Abre o modal na primeira semana
        currentWeekIndex.value = 0;
        isModalOpen.value = true;

    } catch (err) {
        console.error("Erro ao gerar ou processar o plano:", err);
        alert("Ocorreu um erro ao gerar o plano. A IA pode ter retornado um formato inválido. Por favor, verifique o console e tente novamente.");
    } finally {
        generating.value = false;
    }
};
</script>


<template>
    <div class="min-h-screen bg-gray-50">
        <div class="bg-white border-b border-gray-200 px-4 py-4 sm:py-6 sm:px-6 lg:px-8 pt-16 sm:pt-6">
            <div class="mx-auto">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex-1 min-w-0">
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 lg:text-3xl xl:text-4xl">
                            Cronograma de <span class="text-primary">Estudos</span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <form class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Cargo</label>
                    <input type="text" v-model="cargo" class="mt-1 block w-full border rounded p-2">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Data de início</label>
                        <input type="date" v-model="startDate" class="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Data da prova</label>
                        <input type="date" v-model="endDate" class="mt-1 block w-full border rounded p-2" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dias disponíveis para estudar</label>
                    <div class="flex flex-wrap gap-3">
                        <label v-for="day in availableDays" :key="day.value" class="flex items-center gap-2">
                            <input type="checkbox" v-model="day.checked" />
                            {{ day.name }}
                        </label>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label class="flex items-center gap-2">
                        <input type="checkbox" v-model="includeRevisions" />
                        Incluir revisões periódicas
                    </label>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" v-model="includeSimulados" />
                        Incluir simulados no cronograma
                    </label>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Horas por dia</label>
                    <input type="number" min="1" v-model="dailyHours" class="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Como você deseja montar seu
                        cronograma?</label>
                    <div class="mt-2 flex gap-4">
                        <label class="flex items-center gap-2">
                            <input type="radio" value="manual" v-model="method" />
                            Preencher manualmente
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="radio" value="import" v-model="method" />
                            Importar conteúdo do edital
                        </label>
                    </div>
                </div>

                <div v-if="method === 'manual'" class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700">Matérias</label>
                    <div class="flex items-center gap-2">
                        <input v-model="newSubject" type="text" placeholder="Nova matéria"
                            class="border rounded p-2 flex-1" />
                        <button type="button" @click="addSubject"
                            class="bg-primary text-white px-4 py-2 rounded">Adicionar</button>
                    </div>
                    <div v-for="(subject, index) in subjects" :key="index"
                        class="border rounded p-4 bg-gray-50 space-y-2">
                        <h3 class="font-semibold text-gray-800">{{ subject.name }}</h3>
                        <ul class="list-disc list-inside text-sm text-gray-700 ml-2">
                            <li v-for="(topic, i) in subject.topics" :key="i">{{ topic }}</li>
                        </ul>
                        <div class="flex gap-2 mt-2">
                            <input v-model="subject.newTopic" type="text" placeholder="Novo tópico"
                                class="border rounded p-2 flex-1" />
                            <button type="button" @click="addTopicToSubject(index)"
                                class="bg-blue-500 text-white px-3 py-2 rounded">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="method === 'import'">
                    <label class="block text-sm font-medium text-gray-700">Cole aqui o conteúdo do edital</label>
                    <textarea v-model="editalText" rows="6" class="mt-1 block w-full border rounded p-2"
                        placeholder="Cole o conteúdo aqui..."></textarea>
                </div>

                <div class="pt-4">
                    <button type="button" @click="generateStudyPlanWithAI"
                        class="bg-primary text-white px-6 py-3 rounded w-full sm:w-auto" :disabled="generating">
                        {{ generating ? 'Gerando com IA...' : 'Gerar cronograma com IA' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="isModalOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">

            <div class="flex justify-between items-center p-4 border-b">
                <h2 class="text-xl font-bold text-gray-800">Seu Cronograma de Estudos</h2>
                <button @click="closeModal"
                    class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            </div>

            <div class="p-6 overflow-y-auto" id="currentWeekContent">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-primary">📅 Semana {{ currentWeekData.weekNumber }}: {{
                        currentWeekData.dateRange }}</h3>
                </div>

                <table class="w-full text-left schedule-table-clean">
                    <thead>
                        <tr>
                            <th
                                class="p-3 text-sm font-semibold text-gray-500 uppercase border-b-2 border-gray-200 w-1/6">
                                Dia da Semana</th>
                            <th
                                class="p-3 text-sm font-semibold text-gray-500 uppercase border-b-2 border-gray-200 w-1/12 text-center">
                                Tarefa</th>
                            <th
                                class="p-3 text-sm font-semibold text-gray-500 uppercase border-b-2 border-gray-200 w-1/4">
                                Disciplina</th>
                            <th class="p-3 text-sm font-semibold text-gray-500 uppercase border-b-2 border-gray-200">
                                Atividades Propostas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="day in currentWeekData.schedule" :key="day.dayName">
                            <tr v-for="(task, taskIndex) in day.tasks" :key="task.taskName"
                                class="border-b border-gray-100">

                                <td v-if="taskIndex === 0" :rowspan="day.tasks.length"
                                    class="p-4 font-bold text-primary-dark align-middle">
                                    {{ day.dayName }}
                                </td>

                                <td class="p-4 align-middle text-center">
                                    <span
                                        class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
                                        {{ task.taskName.split(' ')[1] || '•' }}
                                    </span>
                                </td>

                                <td class="p-4 align-middle">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold"
                                        :class="getSubjectColor(task.subject)">
                                        {{ task.subject }}
                                    </span>
                                </td>

                                <td class="p-4 text-gray-700 align-middle">{{ task.activity }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>

                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="font-bold text-lg mb-2">💡 Recomendações Práticas</h4>
                        <div class="prose prose-sm" v-html="marked(currentWeekData.recommendations || '')"></div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="font-bold text-lg mb-2">🚀 Mensagem Motivacional</h4>
                        <div class="prose prose-sm" v-html="marked(currentWeekData.motivation || '')"></div>
                    </div>
                </div>
                <div v-if="currentWeekIndex === totalWeeks - 1 && studyPlanData.finalMessage"
                    class="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 class="font-bold text-lg mb-2">🏁 Encerramento e Dicas Finais</h4>
                    <div class="prose prose-sm" v-html="marked(studyPlanData.finalMessage || '')"></div>
                </div>
            </div>

            <div
                class="flex flex-col sm:flex-row justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg gap-4">
                <div class="flex items-center gap-4">
                    <button @click="previousWeek" :disabled="currentWeekIndex === 0"
                        class="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400">
                        &larr; Anterior
                    </button>
                    <span class="font-medium text-gray-700 text-center">
                        Semana {{ currentWeekIndex + 1 }} de {{ totalWeeks }}
                    </span>
                    <button @click="nextWeek" :disabled="currentWeekIndex >= totalWeeks"
                        class="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400">
                        Próxima &rarr;
                    </button>
                </div>

                <div class="flex items-center gap-2">
                    <button @click="exportToPDF" v-if="canExport"
                        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Exportar Semana p/ PDF
                    </button>
                    <button @click="closeModal" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#studyPlanContent {
    page-break-inside: avoid;
    overflow-wrap: break-word;
    word-break: break-word;
}

h2,
h3,
p,
li {
    page-break-inside: avoid;
}
</style>
