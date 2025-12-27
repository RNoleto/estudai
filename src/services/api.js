import axios from 'axios';
import { auth } from '../firebase'; // Verifique o caminho do seu firebase.js

// Criação da instância dedicada
const api = axios.create({
    // Aqui usamos a lógica de URL que estava no seu main.js
    baseURL: 'http://127.0.0.1:8000/api',
    // baseURL: 'https://gerenciamento-de-estudo-api.vercel.app/api/api', 
    
});

// Interceptor de Requisição (O "Pedágio" que insere o Token)
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;

    if (user) {
        // Pega o token atualizado (se expirou, ele renova aqui)
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;