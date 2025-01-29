<script setup>
import { ref } from 'vue';
import { useAIStore } from '../stores/aiStore.js';

const aiStore = useAIStore();
const userMessage = ref('');

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;
  await aiStore.sendMessage(userMessage.value);
};
</script>

<template>
  <div class="chat-container">
    <h2>Chat com IA</h2>
    <input v-model="userMessage" placeholder="Digite sua mensagem..." />
    <button @click="sendMessage" :disabled="aiStore.loading">
      {{ aiStore.loading ? 'Enviando...' : 'Enviar' }}
    </button>

    <p v-if="aiStore.response"><strong>Resposta:</strong> {{ aiStore.response }}</p>
    <p v-if="aiStore.error" class="error">{{ aiStore.error }}</p>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 8px;
  width: 300px;
}
button {
  padding: 8px;
}
.error {
  color: red;
}
</style>
