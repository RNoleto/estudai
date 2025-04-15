<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const success = ref(false);
const error = ref('');

// Função para submeter o formulário
async function submitSupport() {
  try {
    error.value = '';
    await axios.post('/support', form.value);
    success.value = true;

    // Limpar os campos após enviar
    form.value = { name: '', email: '', subject: '', message: '' };
  } catch (err) {
    error.value = 'Front Ocorreu um erro ao enviar sua mensagem. Tente novamente.';
    console.error(err);
  }
}
</script>

<template>
  <div class="flex flex-col p-2 mt-12 gap-4 sm:mt-0 sm:px-4">
    <h3 class="text-2xl font-bold text-gray-700 sm:text-4xl">Suporte ao
      <span class="text-primary">usuário.</span>
    </h3>
    <div class="grid grid-cols-2 gap-2">
      <div class="max-w-2xl">
        <form @submit.prevent="submitSupport">
          <!-- Nome -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" id="name" v-model="form.name"
              class="mt-1 block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-indigo-500"
              required />
          </div>
  
          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email"
              class="mt-1 block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-indigo-500"
              required />
          </div>
  
          <!-- Assunto -->
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Assunto</label>
            <input type="text" id="subject" v-model="form.subject"
              class="mt-1 block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-indigo-500"
              required />
          </div>
  
          <!-- Mensagem -->
          <div class="mb-4">
            <label for="message" class="block text-sm font-medium text-gray-700">Mensagem</label>
            <textarea id="message" v-model="form.message" rows="10"
              class="mt-1 block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-indigo-500"
              required></textarea>
          </div>
  
          <!-- Botão de Envio -->
          <button type="submit" class="bg-primary hover:bg-baseGreen text-white py-2 px-4 rounded focus:outline-none">
            Enviar
          </button>
  
          <!-- Mensagens de Feedback -->
          <p v-if="success" class="text-baseGreen mt-4">
            Sua mensagem foi enviada com sucesso!
          </p>
          <p v-if="error" class="text-baseRed mt-4">
            {{ error }}
          </p>
        </form>
      </div>
      <!-- Aparece somente em telas apartir de 640px -->
      <div class="hidden max-w-2xl sm:flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md">
        <h4 class="text-2xl font-semibold text-primary mb-2">Precisa de ajuda?</h4>
        <p class="text-sm text-gray-600">
          Preencha o formulário ao lado com sua dúvida ou problema. Nossa equipe responderá o mais breve possível pelo
          e-mail informado.
        </p>
        <img src="/img/support.svg" alt="Ilustração de suporte" class="mt-4 w-full max-w-xs mx-auto" />
      </div>
    </div>
  </div>
</template>