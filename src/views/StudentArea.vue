<script setup>
import StudyTimeRecord from '../layouts/StudyTimeRecord.vue';
import StudyStatisticsRecords from '../layouts/StudyStatisticsRecords.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';

import Button from '../components/ui/Button.vue';

import { useUserStore } from '../stores/useUserStore';
const userStore = useUserStore();

</script>

<template>
    <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-col gap-2">
            <h2 class="text-4xl font-bold">Área do aluno</h2>
            <p>Carreira: {{ userStore.careerName }}</p>
            <Button variant="primary" size="default" class="w-[220px]">Editar as minhas informações</Button>
        </div>
        <div class="flex flex-wrap gap-4">
            <StudyTimeRecord/>
            <StudyStatisticsRecords />
            <SubjectSummaryTable/>
        </div>
    </div>
</template>