import { defineStore } from 'pinia';

export const useStudyStore = defineStore('study', {
    state: () => ({
        studySummary: {
            totalStudyTime: '',
            totalPauses: 0,
            questionsResolved: 'no',
            totalQuestions: 0,
            correctAnswers: 0,
        },
    }),
    actions: {
        updateStudySummary(summary){
            this.studySummary = summary;
        },
    },
});