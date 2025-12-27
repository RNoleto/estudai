import { defineStore } from "pinia";
import api from "../services/api";

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        subjects: [],
    }),
    actions: {
        //Listar matérias da API
        async fetchSubjects(forceRefresh = false) {
            if (this.subjects.length > 0 && !forceRefresh) {
                return;
            }
            try {
                const response = await api.get('subjects');
                this.subjects = response.data;
            } catch (error) {
                console.error('Erro ao buscar matérias:', error);
            }
        }
    }
})