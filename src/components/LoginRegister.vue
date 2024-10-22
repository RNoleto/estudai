<script setup>
import { ref } from 'vue';
import Input from './ui/Input.vue';
import Button from './ui/Button.vue';

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
    <div class="relative w-[900px] h-[440px] bg-white shadow-lg flex overflow-hidden rounded-lg">
      <!-- Div da imagem -->
      <div :key="isLoginMode" class="opacity-0 w-full transition-all duration-700" :class="isLoginMode ? 'order-1' : 'order-2'">
        <img :src="isLoginMode ? loginImage : registerImage" alt="Imagem" class="w-full h-full object-cover"/>
      </div>

      <!-- Div do formulário com transições separadas -->
      <div class="flex w-2/3 p-6" :class="isLoginMode ? 'order-2' : 'order-1'">
        <!-- Transição para o formulário de Login -->
        <!-- <transition name="fade-slide-login" mode="out-in"> -->
          <!-- Use v-if diretamente -->
          <form v-if="isLoginMode" @submit.prevent="handleLogin" key="login" class="w-full flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <div class="flex-grow flex flex-col justify-center items-center">
              <div class="w-full">
                <Input label="Email" type="email" v-model="email" />
                <Input label="Senha" type="password" v-model="password" />
                <div class="flex gap-1 mt-4">
                  <Button size="full" @click="handleLogin">Entrar</Button>
                  <Button size="full" @click="toggleMode" class="text-blue-500">
                    Não tenho cadastro
                  </Button>
                </div>
              </div>
            </div>
          </form>
        <!-- </transition> -->

        <!-- Transição para o formulário de Cadastro -->
        <!-- <transition name="fade-slide-register" mode="out-in"> -->
          <!-- Use v-if diretamente -->
          <form v-if="!isLoginMode" @submit.prevent="handleRegister" key="register" class="w-full flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-4">Cadastro</h2>
            <div class="flex-grow flex flex-col justify-center items-center">
              <div class="w-full">
                <Input label="Nome" type="text" v-model="name" />
                <Input label="Email" type="email" v-model="email" />
                <Input label="Senha" type="password" v-model="password" />
                <div class="flex gap-1 mt-4">
                  <Button size="full" @click="handleRegister">Cadastrar</Button>
                  <Button size="full" @click="toggleMode" class="text-blue-500">
                    Já tenho uma conta
                  </Button>
                </div>
              </div>
            </div>
          </form>
        <!-- </transition> -->
      </div>
    </div>
  </div>
</template>


<style>
/* Animação de transição horizontal e opacidade para troca de formulários de Login */
.fade-slide-login-enter-active, .fade-slide-login-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.fade-slide-login-enter-from {
  transform: translateX(-100%); /* O formulário de login entra da direita */
  opacity: 0;
}
.fade-slide-login-leave-to {
  transform: translateX(100%); /* O formulário de login sai para a esquerda */
  opacity: 0;
}

/* Animação de transição horizontal e opacidade para troca de formulários de Cadastro */
.fade-slide-register-enter-active, .fade-slide-register-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.fade-slide-register-enter-from {
  transform: translateX(100%); /* O formulário de cadastro entra da esquerda */
  opacity: 0;
}
.fade-slide-register-leave-to {
  transform: translateX(-100%); /* O formulário de cadastro sai para a direita */
  opacity: 0;
}
</style>