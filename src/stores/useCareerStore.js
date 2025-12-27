import { defineStore } from "pinia";
import api from "../services/api";

export const useCareerStore = defineStore('career', {
    state: () => ({
        careers: [],
    }),
    actions:{
        //Função para buscar as carreiras da API
        async fetchCareers(){
            try {
                const response = await api.get('careers');
                this.careers = response.data;
            } catch (error) {
                console.error('Erro ao buscar carreiras:', error);
            }
        },
        async createCareer(name){
            const icon = "wpf:administrator"; //Icone padrão Avatar com gravata
            try{
                const response = await api.post('careers', {name, icon});
                this.careers.push(response.data.data || response.data);
            } catch (error){
                console.error('Erro ao criar carreira pinia:', error);
            }
        }
    }
})