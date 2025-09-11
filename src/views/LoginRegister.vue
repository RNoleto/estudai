<script setup>
import { ref } from 'vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';
import { useUserStore } from '../stores/useUserStore';

// Estado de alternância entre login e cadastro
const isLoginMode = ref(true);

// Variáveis de controle do formulário
const email = ref('');
const password = ref('');
const name = ref('');

// Instância do store do usuário
const userStore = useUserStore();

// Imagens diferentes para login e cadastro
const loginImage = 'https://images.unsplash.com/photo-1471107191679-f26174d2d41e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXN0dWRvfGVufDB8fDB8fHww';
const registerImage = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXN0dWRvfGVufDB8fDB8fHww';

// Função para alternar entre login e cadastro
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

// Funções de login e cadastro
const handleLogin = async () => {
  try {
    await useUserStore.login({email: email.value, password: password.value});
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
};

const handleGoogleLogin = async () => {
  try {
    await userStore.loginWithGoogle();
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
  }
}

const handleRegister = async () => {
  // Verificação básica para garantir que os campos não estão vazios
  if (!name.value || !email.value || !password.value) {
    console.error('Por favor, preencha todos os campos para se cadastrar.');
    // Opcional: mostrar uma mensagem de erro para o usuário
    return;
  }
  
  try {
    // Chama a ação 'register' do seu store, que agora faz todo o trabalho
    await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    
    // Opcional: Redirecionar o usuário ou mostrar uma mensagem de sucesso após o cadastro.
    console.log('Cadastro realizado com sucesso!');
    // Exemplo: router.push('/dashboard');
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    // Opcional: Mostrar uma mensagem de erro específica para o usuário
    // (ex: "Este e-mail já está em uso.")
  }
};
</script>

<template>
    <!-- Container principal -->
    <div class="relative w-[900px] h-[440px] bg-white shadow-lg flex overflow-hidden rounded-lg">
      <!-- Div da imagem -->
      <transition name="fade">
        <div :key="isLoginMode" class="w-2/3 relative z-10" :class="isLoginMode ? 'order-1' : 'order-2'">
           <img :src="isLoginMode ? loginImage : registerImage" alt="Imagem" class="w-full h-full object-cover"/>
        </div>
      </transition>

      <!-- Div do formulário com transições separadas -->
      <div class="flex w-2/3 p-6" :class="isLoginMode ? 'order-2' : 'order-1'">
        <!-- Transição para o formulário de Login -->
        <transition name="fade-slide-login" mode="out-in">
          <!-- Use v-if diretamente -->
          <form v-if="isLoginMode" @submit.prevent="handleLogin" key="login" class="w-full flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <div class="flex-grow flex flex-col justify-center items-center">
              <div class="w-full">
                <Input label="Email" type="email" v-model="email" />
                <Input label="Senha" type="password" v-model="password" />
                <div class="flex gap-1 mt-4">
                  <Button size="full" @click="handleLogin">Entrar</Button>
                  <Button @click="handleGoogleLogin">Entrar com Google</Button>
                  <Button size="full" @click="toggleMode" class="text-blue-500">
                    Não tenho cadastro
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </transition>

        <!-- Transição para o formulário de Cadastro -->
        <transition name="fade-slide-register" mode="out-in">
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
        </transition>
      </div>
    </div>
</template>


<style>
/* Animação de transição horizontal e opacidade para troca de formulários de Login */
.fade-slide-login-enter-active, .fade-slide-login-leave-active {
  transition: all 0.7s ease;
}
.fade-slide-login-enter-from {
  transform: translateX(-100%); /* O formulário de login entra da direita */
  opacity: 0;
}
.fade-slide-login-leave-to {
  transform: translateX(100%); /* O formulário de login sai para a esquerda */
  opacity: 0;
  display: none;
}

/* Animação de transição horizontal e opacidade para troca de formulários de Cadastro */
.fade-slide-register-enter-active, .fade-slide-register-leave-active {
  transition: all 0.7s ease;
}
.fade-slide-register-enter-from {
  transform: translateX(100%); /* O formulário de cadastro entra da esquerda */
  opacity: 0;
}
.fade-slide-register-leave-to {
  transform: translateX(-100%); /* O formulário de cadastro sai para a direita */
  opacity: 0;
  display: none;
}
</style>