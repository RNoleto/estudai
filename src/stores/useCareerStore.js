import { defineStore } from "pinia";
import axios from "axios";
import { auth } from "../firebase";

export const useCareerStore = defineStore('career', {
    state: () => ({
        careers: [],
    }),
    actions:{
        async getAuthHeaders() {
            const user = auth.currentUser;
            if(!user) return {};
            const token = await user.getIdToken();
            return {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        },
        //Função para buscar as carreiras da API
        async fetchCareers(){
            try {
                const config = await this.getAuthHeaders();
                const response = await axios.get('careers', config);
                this.careers = response.data;
            } catch (error) {
                console.error('Erro ao buscar carreiras:', error);
            }
        },
        async createCareer(name){
            const icon = "wpf:administrator"; //Icone padrão Avatar com gravata
            try{
                const config = await this.getAuthHeaders();
                const response = await axios.post('careers', {name, icon}, config);
                this.careers.push(response.data.data || response.data);
            } catch (error){
                console.error('Erro ao criar carreira pinia:', error);
            }
        }
    }
})