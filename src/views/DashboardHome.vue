<script setup>
import { onMounted, ref } from 'vue';
import StudyTimeRecord from '../layouts/StudyTimeRecord.vue';
import StudyStatisticsRecords from '../layouts/StudyStatisticsRecords.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';

import { useUserStore } from '../stores/useUserStore';
const userStore = useUserStore();

const hasStudyRecords = ref(false);

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
    <div class="flex flex-col gap-4 p-2">
        <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold sm:text-4xl">Resumo dos estudos</h3>
            <p>Carreira: {{ userStore.careerName ? userStore.careerName : "Carregando..."  }}</p>
        </div>
        <div v-if="!hasStudyRecords" class="text-center text-gray-700">
            <p>Você não tem dados de estudos no momento!</p>
        </div>
        <div v-else class="flex flex-wrap gap-2 min-h-[250px]">
            <StudyTimeRecord />
            <StudyStatisticsRecords  />
            <SubjectSummaryTable />
        </div>
    </div>
</template>