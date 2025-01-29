<script setup>
import { ref } from "vue";
import { useOpenAiStore } from "../stores/openAiStore";

const userInput = ref("");
const openAiStore = useOpenAiStore();

const handleSend = () => {
    if (userInput.value.trim()) {
        openAiStore.sendMessage(userInput.value);
        userInput.value = "";
    }
};
</script>

<template>
  <div class="chat-container">
    <h2>ChatGPT (OpenAI)</h2>
    <div class="chat-box">
      <p v-for="(msg, index) in openAiStore.messages" :key="index">
        <strong>{{ msg.role === 'user' ? 'Você' : 'ChatGPT' }}:</strong> {{ msg.content }}
      </p>
    </div>
    <input v-model="userInput" placeholder="Digite sua pergunta..." @keyup.enter="handleSend" />
    <button @click="handleSend" :disabled="openAiStore.loading">Enviar</button>
  </div>
</template>

<style scoped>
.chat-container {
  width: 400px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.chat-box {
  min-height: 150px;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  background: #f9f9f9;
}
input {
  width: calc(100% - 80px);
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:disabled {
  background-color: #aaa;
}
</style>
