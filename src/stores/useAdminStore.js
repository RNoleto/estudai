import { defineStore } from "pinia";
import axios from 'axios';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        dashboardStats: {
            users: [],
            pagination: {},
            isUsersLoading: false,
            totalUsers: 0,
            latestRegistrationDate: null,
            totalCareers: 0,
            totalSubjects: 0,
            totalHoursStudy: 0,
        },
        studySessionChartData: {
            labels: [],
            datasets: [],
        },
        careerDistributionChartData: {
            labels: [],
            datasets: [],
        },
        isLoading: false,
        isChartLoading: false,
        isCareerChartLoading: false,
    }),

    getters:{

    },

    actions:{
        async fetchUsers(page = 1) {
            this.isUsersLoading = true;
            try {
                const response = await axios.get(`/users?page=${page}`);
                this.users = response.data.data;
                delete response.data.data;
                this.pagination = response.data;
            } catch (error) { // <-- A variável 'error' é definida aqui
                // E agora pode ser usada aqui dentro
                console.error('Erro ao buscar usuários:', error);
            } finally {
                this.isUsersLoading = false;
            }
        },
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
        },
        async fetchStudySessionChartData() {
            this.isChartLoading = true;
            try {
                const response = await axios.get('/admin/charts/study-sessions');
                // Se a resposta vier vazia, preenche com dados padrão para não quebrar o gráfico
                if (response.data && response.data.labels.length > 0) {
                    this.studySessionChartData = response.data;
                } else {
                    // Garante que o gráfico não quebre se a API não retornar dados
                    this.studySessionChartData = { labels: [], datasets: [] };
                }
            } catch (error) {
                console.error('Erro ao buscar dados do gráfico de sessões:', error);
            } finally {
                this.isChartLoading = false;
            }
        },
        async fetchCareerDistributionData() {
            this.isCareerChartLoading = true;
            try {
                const response = await axios.get('/admin/charts/career-distribution');
                this.careerDistributionChartData = response.data;
            } catch (error) {
                console.error('Erro ao buscar dados de distribuição de carreiras:', error);
                this.careerDistributionChartData = { labels: [], datasets: [] };
            } finally {
                this.isCareerChartLoading = false;
            }
        },
        async fetchUser(userId) {
            try {
                const response = await axios.get(`/users/${userId}`);
                return response.data;
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        },
        async updateUser(userId, userData) {
            try {
                await axios.put(`/users/${userId}`, userData);
                return true;
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                return false;
            }
        },
        async deleteUser(userId){
            const currentPage = this.pagination.current_page || 1;
            try{
                await axios.delete(`/users/${userId}`);

                this.fetchUsers(currentPage);
                return true;
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                return false;
            }
        }
    }
})