import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api', //Ambiente local
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
    const user = auth.currentUser || await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            unsubscribe();
            resolve(u);
        });
    });

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;