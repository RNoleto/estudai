import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    career: null,
  }),

  actions: {
    // Função para carregar o ID do usuário logado usando o Clerk
    async fetchUserId() {
      try {
        const { userId } = await useAuth();
        if (userId) {
          this.userId = userId; // Armazena o ID do usuário no estado
          console.log("ID do usuário armazenado no estado:", this.userId);
        } else {
          console.error("Não foi possível obter o ID do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },

    // Salva o ID da carreira selecionada e do usuário
    async saveUserCareer(careerId) {
      this.career = careerId;
      const userCareerData = {
        userId: this.userId,
        careerId: careerId,
      };
      localStorage.setItem('userCareerData', JSON.stringify(userCareerData));
      console.log("Carreira armazenada no estado:", this.career);
    }
  },
});
