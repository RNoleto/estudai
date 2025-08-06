import { defineStore } from "pinia";
import axios from 'axios';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        dashboardStats: {
            totalUsers: 0,
            latestRegistrationDate: null,
        },
        isLoading: false,
    }),

    getters:{

    },

    actions:{
        async fetchDashboardStats(){
            this.isLoading = true;
            try {
                const response = await axios.get('/admin/stats');
                this.dashboardStats = response.data;
            } catch (error) {
                console.error('Erro ao buscar estatísticas do dashboard:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
})