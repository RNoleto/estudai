import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
    baseURL: 'https://gerenciamento-de-estudo-api.vercel.app/api/api', 
});

// Função auxiliar para esperar o Firebase carregar
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

api.interceptors.request.use(async (config) => {
    // Tenta pegar o usuário atual, se for null, espera a inicialização
    let user = auth.currentUser;
    if (!user) {
        user = await getCurrentUser();
    }

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("Nenhum usuário logado encontrado para anexar o token.");
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;