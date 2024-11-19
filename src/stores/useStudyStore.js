import { defineStore } from 'pinia';
import axios from 'axios';

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
        subjectList: [],
    }),
    actions: {
        async fetchSubjects() {
            try {
                const response = await axios.get('subjects');
                console.log(response.data); 
                this.subjectList = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Erro ao buscar as matérias:', error);
                this.subjectList = [];
            }
        },
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