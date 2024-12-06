<script setup>
import { computed } from 'vue';

import { useTimeFormatter } from '../composables/useTimeFormatter';
const { formatStudyTime } = useTimeFormatter();

import { useUserStore } from '../stores/useUserStore';

const userStore = useUserStore();

// Agrupa e soma os dados por 'subjectName'
const summarizedData = computed(() => {
    const summary = userStore.userStudyRecords.reduce((acc, record) => {
        const { subjectName, studyTime, totalPauses, questionsResolved, correctAnswers, incorrectAnswers } = record;

        if (!acc[subjectName]) {
            acc[subjectName] = {
                subjectName,
                totalStudyTime: 0,
                totalPauses: 0,
                totalQuestionsResolved: 0,
                totalCorrectAnswers: 0,
                totalIncorrectAnswers: 0,
            };
        }

        acc[subjectName].totalStudyTime += studyTime;
        acc[subjectName].totalPauses += totalPauses;
        acc[subjectName].totalQuestionsResolved += questionsResolved;
        acc[subjectName].totalCorrectAnswers += correctAnswers;
        acc[subjectName].totalIncorrectAnswers += incorrectAnswers;

        return acc;
    }, {});

    return Object.values(summary);
});
</script>

<template>
    <table class="border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="px-4 py-2 text-left">Matérias</th>
                <th class="px-4 py-2 text-left">Tempo de Estudo</th>
                <th class="px-4 py-2 text-left">Pausas</th>
                <th class="px-4 py-2 text-left">Questões Resolvidas</th>
                <th class="px-4 py-2 text-left">Respostas Corretas</th>
                <th class="px-4 py-2 text-left">Respostas Incorretas</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(subject, index) in summarizedData"
                :key="subject.subjectName"
                :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
                class="border-b last:border-b-0 hover:bg-gray-200"
            >
                <td class="px-4 py-2 text-gray-700 border">{{ subject.subjectName }}</td>
                <td class="px-4 py-2 text-gray-700 border">{{ formatStudyTime(subject.totalStudyTime) }}</td>
                <td class="px-4 py-2 text-gray-700 border">{{ subject.totalPauses }}</td>
                <td class="px-4 py-2 text-gray-700 border">{{ subject.totalQuestionsResolved }}</td>
                <td class="px-4 py-2 text-gray-700 border">{{ subject.totalCorrectAnswers }}</td>
                <td class="px-4 py-2 text-gray-700 border">{{ subject.totalIncorrectAnswers }}</td>
            </tr>
        </tbody>
    </table>
</template>
