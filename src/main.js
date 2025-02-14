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
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
// axios.defaults.baseURL = 'https://gerenciamento-de-estudo-api.vercel.app/api/api';

const app = createApp(App);

app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
});

app.use(pinia);
app.use(router);

app.mount('#app');
