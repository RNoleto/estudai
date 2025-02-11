<script setup>
import { computed, onMounted, ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';

import Card from '../components/Card.vue';

import { useUserStore } from '../stores/useUserStore';
const userStore = useUserStore();

import { useTimeFormatter } from '../composables/useTimeFormatter';
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
    <DefaultLayout backgroundOpacity="opacity-20">
        <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
            <div class="flex flex-col gap-2">
                <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Resumo dos <span
                        class="text-primary">estudos.</span></h3>
                <p class="text-md text-gray-700">Carreira: {{ userStore.careerName ? userStore.careerName :
                    "Carregando..." }}</p>
            </div>
            <div v-if="!hasStudyRecords" class="text-center text-gray-700">
                <p>Você não tem dados de estudos no momento!</p>
            </div>
            <div v-else>
                <div class="flex flex-col justify-between gap-2 sm:flex sm:flex-row sm:justify-normal sm:flex-wrap sm:gap-2">
                    <!-- Card de tempo de estudo -->
                    <Card title="Tempo de estudo" icon="fa-solid fa-stopwatch-20">
                        <template #content>
                            {{ formatStudyTime(totalStudyTime) }}
                        </template>
                    </Card>
                    <!-- Card com questões respondidas -->
                    <Card title="Questões respondidas" icon="fa-solid fa-pen-clip">
                        <template #content>
                            <div class="flex w-full items-end gap-4 justify-between">
                                <select v-model="selectedOption" class="text-xs p-1 border border-tertiary rounded-lg">
                                    <option v-for="option in options" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
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
                        <template #footer>
                            <div class="flex items-center gap-1">
                                <input type="checkbox" v-model="displayAsPercentage" class="form-checkbox text-blue-600" />
                                <label class="text-xs text-gray-600">Exibir como porcentagem</label>
                            </div>
                        </template>
                    </Card>
                    <div class="hidden sm:block">
                        <SubjectSummaryTable />
                    </div>
                </div>
                <div class="sm:hidden block mt-2">
                    <SubjectSummaryTable />
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>