import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

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
          this.userId = userId.value; // Armazena o ID do usuário no estado
        } else {
          console.error("Não foi possível obter o ID do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },

    // Função para verificar se o usuário já tem uma carreira salva
    async checkUserCareer() {
      try {
        if (!this.userId) {
          console.error("ID do usuário não encontrado");
          return false;
        }

        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira
        const response = await axios.get(`user-career/${this.userId}`);

        if (response.status === 200 && response.data) {
          console.log("Carreira já atribuída ao usuário:", response.data);
          return true; // O usuário já tem uma carreira salva
        }

        return false; // O usuário ainda não tem uma carreira atribuída
      } catch (error) {
        console.error("Erro ao verificar carreira do usuário:", error);
        return false; // Caso haja erro, consideramos que não existe uma carreira
      }
    },

    //Função para salvar a carreira do usuário no banco de dados
    async saveUserCareer(careerId) {
      // Verifica se o usuário já tem uma carreira atribuída
      const hasCareer = await this.checkUserCareer();
      
      if (hasCareer) {
        console.log("O usuário já possui uma carreira atribuída. Não é possível salvar outra.");
        return;
      }

      this.career = careerId;
      const userCareerData = {
        user_id: this.userId,
        career_id: careerId,
      };

      try {
        // Fazendo a requisição para o backend Laravel para salvar a carreira
        const response = await axios.post('user-career', userCareerData);

        // Se a resposta for bem-sucedida, salva os dados no localStorage
        if (response.status === 200) {
          localStorage.setItem('userCareerData', JSON.stringify(userCareerData));
          console.log("Carreira armazenada no banco de dados com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao salvar a carreira no banco de dados:", error);
      }
    }
  },
});
