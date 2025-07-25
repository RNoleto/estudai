<script setup>
import { ref, computed } from 'vue'
import { useAIStore } from '../stores/aiStore';
import { marked } from 'marked';

const aiStore = useAIStore();
const generatedPlan = ref('');
const generating = ref(false);

// Dados do cronograma
const cargo = ref('')
const startDate = ref('')
const endDate = ref('')
const dailyHours = ref(2)
const method = ref('manual') // 'manual' ou 'import'
const editalText = ref('')

// Matérias com tópicos
const subjects = ref([])
const newSubject = ref('')
const newTopic = ref('')
const selectedSubjectIndex = ref(null)

const weeklyTables = computed(() => {
  return generatedPlan.value.split(/(?=📅 Semana \d+)/g) // mantém o cabeçalho
})

const exportToPDF = async () => {
  const element = document.getElementById('study-plan')
  if (!element) return

  const { default: html2pdf } = await import('html2pdf.js')

  html2pdf()
    .set({
      margin: 0.5,
      filename: 'cronograma-de-estudos.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    })
    .from(element)
    .save()
}


// Dias da semana disponíveis para estudar
const availableDays = ref([
    { name: 'Domingo', value: 'sunday', checked: false },
    { name: 'Segunda-feira', value: 'monday', checked: true },
    { name: 'Terça-feira', value: 'tuesday', checked: true },
    { name: 'Quarta-feira', value: 'wednesday', checked: true },
    { name: 'Quinta-feira', value: 'thursday', checked: true },
    { name: 'Sexta-feira', value: 'friday', checked: true },
    { name: 'Sábado', value: 'saturday', checked: false }
])

// Opções extras
const includeRevisions = ref(true)
const includeSimulados = ref(false)

// Adicionar nova matéria (sem tópicos ainda)
const addSubject = () => {
    if (newSubject.value && !subjects.value.some(s => s.name === newSubject.value)) {
        subjects.value.push({
            name: newSubject.value,
            topics: [],
            newTopic: ''
        })
        newSubject.value = ''
    }
}

// Adicionar tópico à matéria selecionada
const addTopicToSubject = (index) => {
    const subject = subjects.value[index]
    if (
        subject.newTopic &&
        !subject.topics.includes(subject.newTopic)
    ) {
        subject.topics.push(subject.newTopic)
        subject.newTopic = ''
    }
}

const generateStudyPlanWithAI = async () => {
    generating.value = true
    generatedPlan.value = ''
    aiStore.$reset()

    // Organizar dados
    const selectedDays = availableDays.value
        .filter(day => day.checked)
        .map(d => d.name)
        .join(', ')

    const resumoMaterias = subjects.value.map(subject => {
        const diasComTopicos = Object.entries(subject.topicsByDay || {})
            .map(([dia, topicos]) => {
                const lista = topicos.length ? topicos.join(', ') : 'Sem tópicos definidos'
                return `  - ${dia}: ${lista}`
            }).join('\n')
        return `- ${subject.name}:\n${diasComTopicos}`
    }).join('\n')

    const prompt = `
    Você é um especialista em planejamento de estudos para concursos públicos.

Com base nas informações abaixo, crie um CRONOGRAMA DE ESTUDOS semanal em formato de tabela, até que todo o conteúdo listado seja completamente estudado.

⚠️ INSTRUÇÕES IMPORTANTES:
- Você **DEVE incluir todas as disciplinas mencionadas no conteúdo abaixo**, sem ignorar nenhuma (por exemplo: "Legislação e Ética", "Língua Inglesa", etc.).
- Distribua todas as matérias de forma **equilibrada e proporcional ao longo das semanas**.
- **A carga horária diária deve ser preenchida com múltiplas disciplinas por dia**, especialmente quando o aluno dispõe de 3h, 4h ou mais por dia. Evite repetir apenas uma matéria por dia.
- O número de tarefas por dia deve ser proporcional à carga horária. Por exemplo:
  - 2h/dia → 2 tarefas (1h cada)
  - 4h/dia → 3 a 4 tarefas (1h a 1h20 cada)
  - 6h/dia → 4 ou mais tarefas
- Se o aluno ativou "revisões" ou "simulados", inclua essas atividades **ao longo das semanas**, sempre respeitando a carga horária diária.
- O conteúdo está completo. NÃO solicite nenhum dado adicional.
- NÃO inclua tarefas como lazer, descanso ou pausas.

📘 FORMATO DAS TABELAS:
Cada semana deve conter uma tabela com o seguinte modelo:

| TAREFA | DISCIPLINA             | ATIVIDADES |
|--------|------------------------|------------|
| 01     | Nome da Matéria        | Estudo da aula X; revisão da aula Y; resolução de 30 questões... |

🔁 Continue gerando SEMANAS até cobrir todo o conteúdo.

📌 Após cada tabela semanal, escreva:
- Um **bloco com recomendações práticas** para o aluno naquela semana.
- Uma **mensagem motivacional curta**.

📌 Ao final da última semana:
- Faça um breve texto de encerramento com incentivo e dicas finais para a véspera da prova.

DADOS DO PLANO:
- Cargo: ${cargo.value}
- Início dos estudos: ${startDate.value}
- Data da prova: ${endDate.value}
- Horas por dia: ${dailyHours.value}
- Dias da semana disponíveis: ${selectedDays}
- Incluir revisões periódicas? ${includeRevisions.value ? 'Sim' : 'Não'}
- Incluir simulados? ${includeSimulados.value ? 'Sim' : 'Não'}

🧠 CONTEÚDO PROGRAMÁTICO COMPLETO:
${resumoMaterias}
`.trim()

    try {
        await aiStore.sendMessage(prompt)

        if (aiStore.error) {
            generatedPlan.value = 'Erro ao gerar plano com IA.'
        } else {
            generatedPlan.value = marked(aiStore.response)
        }
    } catch (err) {
        console.error(err)
        generatedPlan.value = 'Ocorreu um erro ao gerar o plano de estudos.'
    } finally {
        generating.value = false
    }
}
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

        <div class="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <form class="space-y-6">
                <!-- Cargo -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Cargo</label>
                    <input type="text" v-model="cargo" class="mt-1 block w-full border rounded p-2">
                </div>
                <!-- Datas -->
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

                <!-- Dias da semana disponíveis -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dias disponíveis para estudar</label>
                    <div class="flex flex-wrap gap-3">
                        <label v-for="day in availableDays" :key="day.value" class="flex items-center gap-2">
                            <input type="checkbox" v-model="day.checked" />
                            {{ day.name }}
                        </label>
                    </div>
                </div>

                <!-- Revisões e Simulados -->
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

                <!-- Horas por dia -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Horas por dia</label>
                    <input type="number" min="1" v-model="dailyHours" class="mt-1 block w-full border rounded p-2" />
                </div>

                <!-- Método de inserção -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Como você deseja montar seu cronograma?</label>
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

                <!-- Conteúdo manual -->
                <div v-if="method === 'manual'" class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700">Matérias</label>
                    <div class="flex items-center gap-2">
                        <input v-model="newSubject" type="text" placeholder="Nova matéria"
                            class="border rounded p-2 flex-1" />
                        <button type="button" @click="addSubject"
                            class="bg-primary text-white px-4 py-2 rounded">Adicionar</button>
                    </div>
                    <!-- Matérias e tópicos -->
                    <div v-for="(subject, index) in subjects" :key="index" class="border rounded p-4 bg-gray-50 space-y-2">
                        <h3 class="font-semibold text-gray-800">{{ subject.name }}</h3>

                        <!-- Lista de tópicos -->
                        <ul class="list-disc list-inside text-sm text-gray-700 ml-2">
                            <li v-for="(topic, i) in subject.topics" :key="i">{{ topic }}</li>
                        </ul>

                        <!-- Input para adicionar novo tópico -->
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

                <!-- Conteúdo importado -->
                <div v-if="method === 'import'">
                    <label class="block text-sm font-medium text-gray-700">Cole aqui o conteúdo do edital</label>
                    <textarea v-model="editalText" rows="6" class="mt-1 block w-full border rounded p-2"
                        placeholder="Cole o conteúdo aqui..."></textarea>
                </div>

                <!-- Botão para gerar cronograma -->
                <div class="pt-4">
                    <button type="button" @click="generateStudyPlanWithAI"
                        class="bg-primary text-white px-6 py-3 rounded w-full sm:w-auto" :disabled="generating">
                        {{ generating ? 'Gerando com IA...' : 'Gerar cronograma com IA' }}
                    </button>
                </div>
            </form>

            <!-- Exportar PDF -->
            <div v-if="weeklyTables.length" class="mt-6 text-right">
              <button @click="exportToPDF" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Exportar para PDF
              </button>
            </div>

            <!-- Exibição modular por semana -->
            <div id="study-plan" class="mt-4 space-y-6">
              <div v-for="(week, index) in weeklyTables" :key="index" class="bg-blue-50 border border-blue-200 p-4 rounded text-sm prose max-w-none" v-html="week" />
            </div>
        </div>
    </div>
</template>
