import { defineStore } from 'pinia';
import axios from 'axios';

export const useStudyStore = defineStore('study', {
    state: () => ({
        studySummary: {
            totalStudyTime: '',
            totalPauses: '',
            questionsResolved: '',
            totalQuestions: '',
            correctAnswers: '',
        },
        subject: '',
        topic: '',
        subjectList: [],
    }),
    actions: {
        async fetchSubjects() {
            try {
                const response = await axios.get('subjects');
                
                this.subjectList = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Erro ao buscar as matérias:', error);
                this.subjectList = [];
            }
        },
        updateStudySummary(summary) {
            this.studySummary = summary;
        },
        setSubject(subject) {
            this.subject = subject;
            
            
        },
        setTopic(topic) {
            this.topic = topic;
        }
    },
    getters: {
        correctAnswerPercentage: (state) => {
            if (state.studySummary.questionsResolved === 'yes' && state.studySummary.totalQuestions > 0) {
                return (state.studySummary.correctAnswers / state.studySummary.totalQuestions) * 100;
            }
            return 0;
        },
        incorrectAnswerPercentage: (state) => {
            if (state.studySummary.questionsResolved === 'yes' && state.studySummary.totalQuestions > 0) {
                return 100 - (state.studySummary.correctAnswers / state.studySummary.totalQuestions) * 100;
            }
            return 0;
        }
    }
});