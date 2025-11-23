import { defineStore } from "pinia";
import axios from "axios";

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        subjects:[],
    }),
    actions:{
        //Listar matérias da API
        async fetchSubjects(forceRefresh = false) {
            if (this.subjects.length > 0 && !forceRefresh) {
                console.log("Matérias já carregadas, evitando requisição duplicada.");
                return; // Já temos as matérias carregadas, não faz nada
            }
            try {
                const response = await axios.get('subjects');
                this.subjects = response.data;
            } catch (error) {
                console.error('Erro ao buscar matérias:', error);
            }
        }
    }
})