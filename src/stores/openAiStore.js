import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useOpenAiStore = defineStore("openAi", () => {
    const API_KEY = import.meta.env.OPENAI_KEY; 
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const messages = ref([]);
    const loading = ref(false);

    async function sendMessage(userMessage){
        if(!userMessage.trim()) return;

        messages.value.push({ role: "user", content: userMessage });
        loading.value = true;

        try {
            const response = await axios.post(API_URL, {
                model: "gpt-3.5-turbo",
                messages: messages.value,
                temperature: 0.7,
                max_tokens: 150
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                }
            });

            const botMessage = response.data.choices[0]?.message?.content || "Sem resposta do bot.";
            messages.value.push({ role: "assistant", content: botMessage });
        } catch (error) {
            console.error("Erro ao chamar OpenAI:", error);
            messages.value.push({ role: "assistant", content: "Erro na resposta da API." });
        } finally {
            loading.value = false;
        }
    }
    return { messages, loading, sendMessage };
});