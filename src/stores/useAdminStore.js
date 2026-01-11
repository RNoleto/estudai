import { defineStore } from "pinia";
import api from "../services/api";
import { auth } from "../firebase";

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
        async getAuthHeaders() {
            const user = auth.currentUser;
            if (!user) return {};
            const token = await user.getIdToken();
            return {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
        },
        async fetchUsers(page = 1) {
            this.isUsersLoading = true;
            try {
                const config = await this.getAuthHeaders();
                const response = await api.get(`/users?page=${page}`, config);
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
                const config = await this.getAuthHeaders();
                const response = await api.get('/admin/stats', config);
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
                const config = await this.getAuthHeaders();
                const response = await api.get('/admin/charts/study-sessions', config);
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
                const config = await this.getAuthHeaders();
                const response = await api.get('/admin/charts/career-distribution', config);
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
                const config = await this.getAuthHeaders();
                const response = await api.get(`/users/${userId}`, config);
                return response.data;
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        },
        async updateUser(userId, userData) {
            try {
                const config = await this.getAuthHeaders();
                await api.put(`/users/${userId}`, userData, config);
                return true;
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                return false;
            }
        },
        async deleteUser(userId){
            const currentPage = this.pagination.current_page || 1;
            try{
                const config = await this.getAuthHeaders();
                await api.delete(`/users/${userId}`, config);

                this.fetchUsers(currentPage);
                return true;
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                return false;
            }
        }
    }
})