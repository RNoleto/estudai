import { defineStore } from "pinia";
import axios from "axios";
import { auth } from "../firebase";

export const useSubjectStore = defineStore('subject', {
    state: () => ({
        subjects: [],
    }),
    actions: {
        async getAuthHeaders() {
            const user = auth.currentUser;
            if (!user) return {};
            const token = await user.getIdToken();
            return {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        },
        //Listar matérias da API
        async fetchSubjects(forceRefresh = false) {
            if (this.subjects.length > 0 && !forceRefresh) {
                return;
            }
            try {
                const config = await this.getAuthHeaders();
                const response = await axios.get('subjects', config);
                this.subjects = response.data;
            } catch (error) {
                console.error('Erro ao buscar matérias:', error);
            }
        }
    }
})