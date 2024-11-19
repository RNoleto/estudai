import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,  // Estado para armazenar os dados do usuário
    token: null, // Token de autenticação (se necessário)
    isAuthenticated: false, // Flag para verificar se o usuário está autenticado
  }),
  
  actions: {
    // Função para fazer login e armazenar o usuário e o token
    async login(credentials) {
      try {
        const response = await axios.post('/api/login', credentials);
        
        // Armazena o token e os dados do usuário no estado
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        // Armazena o token no localStorage para manter o login após o refresh
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    },

    // Função para fazer logout e limpar o estado
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;

      // Remove o token e o usuário do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // Função para carregar o usuário a partir do localStorage (em caso de refresh da página)
    loadUserFromLocalStorage() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    },

    // Função para buscar os dados do usuário da API (se necessário)
    async fetchUserData() {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${this.token}`, // Passando o token na requisição
          },
        });
        this.user = response.data; // Atualiza o estado com os dados do usuário
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    },
  },

  getters: {
    // Getter para verificar se o usuário está autenticado
    isAuthenticated: (state) => !!state.token,
  },
});
