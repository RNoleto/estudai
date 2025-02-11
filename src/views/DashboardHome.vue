<script setup>
import { computed, onMounted, ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import StudyTimeRecord from '../layouts/StudyTimeRecord.vue';
import StudyStatisticsRecords from '../layouts/StudyStatisticsRecords.vue';
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
        return ((selectedTotal / totalQuestions) * 100).toFixed(2) + '%';
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
        <div class="flex flex-col p-4 mt-12 gap-4 h-screen sm:mt-0">
            <div class="flex flex-col gap-2">
                <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Resumo dos <span class="text-primary">estudos.</span></h3>
                <p class="text-md text-gray-700">Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..." }}</p>
            </div>
            <div v-if="!hasStudyRecords" class="text-center text-gray-700">
                <p>Você não tem dados de estudos no momento!</p>
            </div>
            <div v-else>
                <div class="hidden sm:flex sm:flex-wrap sm:gap-2">
                    <StudyTimeRecord />
                    <StudyStatisticsRecords />
                    <SubjectSummaryTable />
                </div>
                <!-- Aqui fica os campos Mobile -->
                <div class="sm:hidden">
                    <div class="grid grid-cols-2 gap-2 h-min-[500px]">
                        <!-- Card de tempo de estudo -->
                        <Card title="Tempo de estudo">
                            <template #content>
                                <p>{{ formatStudyTime(totalStudyTime) }}</p>
                            </template>
                            <template #footer>
                                <p>Acompanhe o seu progresso!</p>
                            </template>
                        </Card>
                        <!-- Card de restões respondidas -->
                        <Card title="Questões respondidas">
                            <!-- Slote content -->
                            <template #content>
                                <p :class="{
                                    'text-blue-600': selectedOption === 'questions_resolved',
                                    'text-green-600': selectedOption === 'correct_answers',
                                    'text-red-600': selectedOption === 'incorrect_answers'
                                }">
                                    {{ totalValue }}
                                </p>
                            </template>
                            <!-- Slot fields -->
                            <template #fields>
                                <!-- Select para opções -->
                                <select v-model="selectedOption"
                                    class="w-full text-xs p-1 border border-gray-200 rounded-md focus:ring focus:ring-blue-300">
                                    <option v-for="option in options" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </template>
                            <!-- Checkbox para porcentagem -->
                            <div class="flex items-center py-2 gap-1">
                                <input type="checkbox" v-model="displayAsPercentage" class="form-checkbox text-blue-600" />
                                <label class="text-xs text-gray-600">Exibir como porcentagem</label>
                            </div>
                            <template #footer>
                                <!-- Checkbox para porcentagem -->
                                <div class="flex items-center justify-center gap-1">
                                    <input type="checkbox" v-model="displayAsPercentage"
                                        class="form-checkbox text-blue-600" />
                                    <label class="text-xs text-gray-600">Exibir como porcentagem</label>
                                </div>
                            </template>
                        </Card>
                        <SubjectSummaryTable/>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>