import { defineStore } from 'pinia';

export const useStudyStore = defineStore('study', {
    state: () => ({
        studySummary: {
            totalStudyTime: '',
            totalPauses: 0,
            questionsResolved: '',
            totalQuestions: 0,
            correctAnswers: 0,
        },
        subject: '',
        topic: '',
        subjectList: ['Direito Administrativo', 'Matemática', 'Informática', 'Direito Constitucional'], // Lista de matérias fakes
    }),
    actions: {
        updateStudySummary(summary){
            this.studySummary = summary;
        },
        setSubject(subject){
            this.subject = subject;
        },
        setTopic(topic){
            this.topic = topic;
        }
    },
});