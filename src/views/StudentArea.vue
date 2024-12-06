<script setup>
import StudyTimeRecord from '../layouts/StudyTimeRecord.vue';
import StudyStatisticsRecords from '../layouts/StudyStatisticsRecords.vue';
import SubjectSummaryTable from '../layouts/SubjectSummaryTable.vue';
</script>

<template>
    <div class="p-4">
        <h1>Área do aluno</h1>
        <div class="flex flex-wrap gap-4">
            <StudyTimeRecord/>
            <StudyStatisticsRecords />
            <SubjectSummaryTable />
        </div>
    </div>
</template>