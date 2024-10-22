<script setup>
  import { ref } from 'vue';
  
  // Estado de alternância entre login e cadastro
  const isLoginMode = ref(true);
  
  // Variáveis de controle do formulário
  const email = ref('');
  const password = ref('');
  const name = ref('');
  
  // Imagens diferentes para login e cadastro
  const loginImage = 'https://images.unsplash.com/photo-1471107191679-f26174d2d41e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXN0dWRvfGVufDB8fDB8fHww';
  const registerImage = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXN0dWRvfGVufDB8fDB8fHww';
  
  // Função para alternar entre login e cadastro
  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value;
  };
  
  // Funções de login e cadastro
  const handleLogin = () => {
    console.log('Login:', email.value, password.value);
  };
  
  const handleRegister = () => {
    console.log('Cadastro:', name.value, email.value, password.value);
  };
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <!-- Container principal -->
      <div class="relative w-full max-w-4xl p-8 bg-white shadow-lg flex overflow-hidden">
        <!-- Div da imagem -->
        <div
          :class="[
            'w-1/2 flex items-center justify-center p-4 transition-all duration-700',
            isLoginMode ? 'order-1' : 'order-2'
          ]"
        >
          <img
            :src="isLoginMode ? loginImage : registerImage"
            alt="Imagem"
            class="object-cover"
          />
        </div>
  
        <!-- Div do formulário -->
        <div
          :class="[
            'w-1/2 p-6 transition-all duration-700',
            isLoginMode ? 'order-2' : 'order-1'
          ]"
        >
          <h2 class="text-2xl font-bold mb-4">
            {{ isLoginMode ? 'Login' : 'Cadastro' }}
          </h2>
  
          <!-- Formulário de Login -->
          <form v-if="isLoginMode" @submit.prevent="handleLogin">
            <InputComponent label="Email" type="email" v-model="email" />
            <InputComponent label="Senha" type="password" v-model="password" />
            <ButtonComponent text="Entrar" @click="handleLogin" />
          </form>
  
          <!-- Formulário de Cadastro -->
          <form v-else @submit.prevent="handleRegister">
            <InputComponent label="Nome" type="text" v-model="name" />
            <InputComponent label="Email" type="email" v-model="email" />
            <InputComponent label="Senha" type="password" v-model="password" />
            <ButtonComponent text="Cadastrar" @click="handleRegister" />
          </form>
  
          <!-- Link para alternar entre Login e Cadastro -->
          <p class="mt-4">
            <button @click="toggleMode" class="text-blue-500 hover:underline">
              {{ isLoginMode ? 'Não tenho cadastro' : 'Já tenho uma conta' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </template>