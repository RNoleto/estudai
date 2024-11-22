import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    career: null,
    careerName: null,
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

        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira e salvando id da carreira
        const response = await axios.get(`user-career/${this.userId}`);
        this.career = response.data.career_id;

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
    },

    //Função para retornar nome da carreira do usuário do banco de dados
    async fetchUserCareer() {
      try {
        if (!this.userId) {
          console.error("ID do usuário não encontrado");
          return;
        }
        
        // Requisição para obter o nome da carreira do usuário
        const response = await axios.get(`http://localhost:8000/api/user-career/career_name/${this.userId}`);
        if (response.data) {
          this.careerName = response.data.career_name;
          this.career = response.data.career_id; // Armazena também o ID da carreira, caso precise
        } else {
          console.log("Usuário não tem uma carreira associada.");
        }
      } catch (error) {
        console.error("Erro ao carregar a carreira do usuário:", error);
      }
    },
  },
});
