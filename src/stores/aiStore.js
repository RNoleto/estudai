import { defineStore } from 'pinia';
import axios from 'axios';

export const useAIStore = defineStore('aiStore', {
  state: () => ({
    message: '',
    response: '',
    loading: false,
    error: null,
    activeAPI: 'gemini' // Pode ser 'gemini' ou 'mistral'
  }),

  actions: {
    async sendMessage(userMessage) {
      this.loading = true;
      this.error = null;
      this.response = '';

      const API_CONFIG = {
        gemini: {
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          apiKey: import.meta.env.VITE_GEMINI_API_KEY,
          headers: { 'Content-Type': 'application/json' }
        },
        mistral: {
          baseURL: 'https://api.mistral.ai/v1/chat/completions',
          apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
          headers: { 'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`, 'Content-Type': 'application/json' }
        }
      };

      const apiConfig = API_CONFIG[this.activeAPI];

      try {
        const apiClient = axios.create({
          baseURL: apiConfig.baseURL,
          headers: apiConfig.headers
        });

        let payload;
        if (this.activeAPI === 'gemini') {
          payload = { contents: [{ parts: [{ text: userMessage }] }] };
        } else {
          payload = { model: 'mistral-tiny', messages: [{ role: 'user', content: userMessage }] };
        }

        const response = await apiClient.post(`?key=${apiConfig.apiKey}`, payload);

        if (this.activeAPI === 'gemini') {
          this.response = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma resposta.';
        } else {
          this.response = response.data?.choices?.[0]?.message?.content || 'Nenhuma resposta.';
        }
      } catch (error) {
        console.error('Erro na API:', error.response?.data || error.message);
        this.error = 'Erro ao obter resposta da IA.';
      } finally {
        this.loading = false;
      }
    }
  }
});
