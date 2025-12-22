<script setup>
import { ref } from 'vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';
import { useUserStore } from '../stores/useUserStore';

const isLoginMode = ref(true);

const email = ref('');
const password = ref('');
const name = ref('');

const userStore = useUserStore();

const loginImage = 'https://images.unsplash.com/photo-1471107191679-f26174d2d41e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXN0dWRvfGVufDB8fDB8fHww';
const registerImage = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXN0dWRvfGVufDB8fDB8fHww';

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

const handleLogin = async () => {
  try {
    await userStore.login({email: email.value, password: password.value});
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
  if (!name.value || !email.value || !password.value) {
    console.error('Por favor, preencha todos os campos para se cadastrar.');
    return;
  }

  try {
    await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
  }
};
</script>

<template>
    <div class="relative w-[900px] h-[440px] bg-white shadow-lg flex overflow-hidden rounded-lg">
      <transition name="fade">
        <div :key="isLoginMode" class="w-2/3 relative z-10" :class="isLoginMode ? 'order-1' : 'order-2'">
           <img :src="isLoginMode ? loginImage : registerImage" alt="Imagem" class="w-full h-full object-cover"/>
        </div>
      </transition>
      <div class="flex w-2/3 p-6" :class="isLoginMode ? 'order-2' : 'order-1'">
        <transition name="fade-slide-login" mode="out-in">
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

        <transition name="fade-slide-register" mode="out-in">
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
.fade-slide-login-enter-active, .fade-slide-login-leave-active {
  transition: all 0.7s ease;
}
.fade-slide-login-enter-from {
  transform: translateX(-100%); 
}
.fade-slide-login-leave-to {
  transform: translateX(100%);
  opacity: 0;
  display: none;
}

.fade-slide-register-enter-active, .fade-slide-register-leave-active {
  transition: all 0.7s ease;
}
.fade-slide-register-enter-from {
  transform: translateX(100%); 
  opacity: 0;
}
.fade-slide-register-leave-to {
  transform: translateX(-100%);
  opacity: 0;
  display: none;
}
</style>