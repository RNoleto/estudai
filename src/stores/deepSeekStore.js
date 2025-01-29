import { defineStore } from "pinia";
import { ref } from "vue";

export const useDeepSeekStore = defineStore("deepSeek", () => {
    const API_KEY = "Minha_chave_aqui";
    const API_URL = "https://api.deepseek.com/v1/chat/completions";

    const responseMessage = ref("");
    const loading = ref(false);

    async function sendMessage(userMessage){}
});