import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { clerkPlugin } from 'vue-clerk';
import './style.css';
import App from './App.vue';
import axios from 'axios';

import '@fortawesome/fontawesome-free/css/all.min.css'; // Ícones

import router from './router';

const pinia = createPinia();

// Configuração da baseURL do Axios
axios.defaults.baseURL = 'https://gerenciamento-de-estudo-qo5sdjbhx-rnoletos-projects.vercel.app/api/api';

// Adicionando interceptor para incluir o token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assumindo que o token está armazenado no localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Inclui o token no header
    } else {
      console.error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adicionando interceptor para depuração de respostas (opcional)
axios.interceptors.response.use(
  (response) => {
    console.log('Requisição bem-sucedida:', response); // Log para respostas bem-sucedidas
    return response;
  },
  (error) => {
    console.error('Erro na requisição:', error); // Log para erros de requisição
    return Promise.reject(error);
  }
);

const app = createApp(App);

app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
});

app.use(pinia);
app.use(router);

app.mount('#app');
