import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    careerId: null,
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
    // Função para salvar a carreira do usuário no banco de dados
async saveUserCareer(careerId, careerName) {
  this.careerId = careerId;
  this.careerName = careerName; // Salve o nome da carreira também no Pinia

  // Lógica para enviar para o backend
  const userCareerData = {
    user_id: this.userId,
    career_id: careerId,
  };

  try {
    // Fazendo a requisição para o backend Laravel para salvar a carreira
    const response = await axios.post('user-career', userCareerData);

    if (response.status === 200) {
      localStorage.setItem('userCareerData', JSON.stringify(userCareerData));
      console.log("Carreira armazenada no banco de dados com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao salvar a carreira no banco de dados:", error);
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
        this.careerId = response.data.career_id;
    
        // Aqui, garantimos que o nome da carreira seja carregado
        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data.career_name;
    
        return true; // O usuário tem uma carreira atribuída
      } catch (error) {
        console.error("Erro ao verificar carreira do usuário:", error);
        return false;
      }
    }
  },
});
