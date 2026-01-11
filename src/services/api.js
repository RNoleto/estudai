import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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