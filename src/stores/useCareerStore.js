import { defineStore } from "pinia";
import axios from "axios";

export const useCareerStore = defineStore('career', {
    state: () => ({
        careers: [],
    }),
    actions:{
        //Função para buscar as carreiras da API
        async fetchCareers(){
            try {
                const response = await axios.get('careers');
                this.careers = response.data;
            } catch (error) {
                console.error('Erro ao buscar carreiras:', error);
            }
        }
    }
})