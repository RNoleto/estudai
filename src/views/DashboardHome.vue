<script setup>
import { computed, onMounted, ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';
import Head from '../components/Head.vue';
import Card from '../components/Card.vue';
import SubjectBarChart from '../layouts/SubjectBarChart.vue';


import { useUserStore } from '../stores/useUserStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';

const userStore = useUserStore();
const { formatStudyTime } = useTimeFormatter();

const totalStudyTime = computed(() => {
    return userStore.userStudyRecords.reduce((sum, record) => sum + record.study_time, 0);
});

const hasStudyRecords = ref(false);

// Opções para o combobox
const options = [
    { label: 'Questões resolvidas', value: 'questions_resolved' },
    { label: 'Questões corretas', value: 'correct_answers' },
    { label: 'Questões incorretas', value: 'incorrect_answers' },
];

const TotalUniqueTopics = computed(() => {
    const uniqueTopics = new Set();

    userStore.userStudyRecords.forEach(record => {
        if(record.subject_id && record.topic){
            const key = `${record.subject_id}-${record.topic}`;
            uniqueTopics.add(key);
        }
    })

    return uniqueTopics.size;
})

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
        return ((selectedTotal / totalQuestions) * 100).toFixed(0) + '%';
    }

    return selectedTotal;
});

onMounted(async () => {
    try {
        await userStore.fetchUserStudyRecords();
        const activeRecords = userStore.userStudyRecords.filter(record => record.ativo === 1);
        hasStudyRecords.value = activeRecords.length > 0;
    } catch (error) {
        console.error(error);
    }
})
</script>

<template>
    <Head 
        title="Estuday | Resumo de Estudos - Seu Desempenho e Progresso"
        description="Acompanhe seu desempenho nos estudos! Veja o total de tempo estudado, questões respondidas, acertos e erros, além das matérias revisadas. Organize seu aprendizado e evolua com o Estuday!"
        image="https://estuday.com.br/img/wallpaper.png"
        url="https://estuday.com.br"
    />
    <DefaultLayout backgroundOpacity="opacity-20">
        <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
            <div class="flex flex-col gap-2">
                <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Resumo dos <span
                        class="text-primary">estudos.</span></h3>
                <p class="text-md text-gray-700">Carreira: {{ userStore.careerName ? userStore.careerName :
                    "Carregando..." }}</p>
            </div>
            <div>
                <div class="grid grid-cols-6 gap-2 sm:flex sm:flex-row sm:justify-normal sm:flex-wrap sm:gap-2">
                        <!-- Card com total de questões -->
                        <Card icon="fa-solid fa-book" title="Total de matérias" class="col-span-3">
                            <template #content>
                                {{ userStore.userSubjects.length }}
                            </template>
                        </Card>
                        <!-- Card com total de topicos estudados -->
                         <Card icon="fa-solid fa-tags" title="Total de tópicos" class="col-span-3">
                            <template #content>
                                {{ TotalUniqueTopics }}
                            </template>
                         </Card>
                        <!-- Card de tempo de estudo -->
                        <Card title="Tempo de estudo" icon="fa-solid fa-stopwatch-20" class="col-span-2">
                            <template #content>
                                {{ formatStudyTime(totalStudyTime) }}
                            </template>
                        </Card>
                        <!-- Card com questões respondidas -->
                        <Card title="Questões respondidas" icon="fa-solid fa-pen-clip" class="col-span-4">
                            <template #content>
                                <div class="flex flex-col-reverse sm:flex-row w-full items-end gap-4 justify-between">
                                    <div class="flex  flex-col gap-2">
                                        <select v-model="selectedOption"
                                            class="text-xs text-gray-500 p-1 border border-tertiary rounded-lg">
                                            <option v-for="option in options" :key="option.value" :value="option.value">
                                                {{ option.label }}
                                            </option>
                                        </select>
                                        <div class="flex items-center gap-1">
                                            <input type="checkbox" v-model="displayAsPercentage"
                                                class="form-checkbox text-blue-600" />
                                            <label class="text-xs text-gray-600">Exibir como porcentagem</label>
                                        </div>
                                    </div>
                                    <!-- Classe condicional para colorir o valor -->
                                    <p class="text-2xl sm:text-5xl font-extrabold" :class="{
                                        'text-primary': selectedOption === 'questions_resolved',
                                        'text-baseBlue': selectedOption === 'correct_answers',
                                        'text-baseRed': selectedOption === 'incorrect_answers'
                                    }">
                                        {{ totalValue }}
                                    </p>
                                </div>
                            </template>
                        </Card>
                </div>
                <div v-if="hasStudyRecords" class="mt-2">
                    <!-- <SubjectBarChart /> -->
                    <SubjectSummaryTable />
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>