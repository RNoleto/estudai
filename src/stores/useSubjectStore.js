import { defineStore } from "pinia";
import axios from "axios";

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        subjects:[],
    }),
    actions:{
        //Listar matérias da API
        async fetchSubjects(){
            try {
                const response = await axios.get('subjects');
                this.subjects = response.data;
            } catch (error) {
                console.error('Erro ao buscar matérias:', error);
            }
        }
    }
})