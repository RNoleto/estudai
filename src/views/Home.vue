<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

import DefaultLayout from '../layouts/DefaultLayout.vue';
import Button from '../components/ui/Button.vue';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';

const userStore = useUserStore();
const router = useRouter();

const showRegisterForm = ref(false);
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const registerError = ref('');
const registerLoading = ref(false);

function openRegisterForm() {
  showRegisterForm.value = true;
  showLoginForm.value = false; // Fecha o formulário de login se estiver aberto
  registerError.value = '';
}

function closeRegisterForm() {
  showRegisterForm.value = false;
  registerName.value = '';
  registerEmail.value = '';
  registerPassword.value = '';
  registerError.value = '';
}

async function handleRegister() {
  registerLoading.value = true;
  registerError.value = '';
  try {
    await userStore.register({
      email: registerEmail.value,
      password: registerPassword.value,
      name: registerName.value
    });
    closeRegisterForm();
    router.push('/area-do-aluno');
  } catch (error) {
    registerError.value = error.message || 'Erro ao cadastrar usuário';
  } finally {
    registerLoading.value = false;
  }
}

async function handleGoogleLogin() {
  try {
    await userStore.loginWithGoogle();
    router.push('/area-do-aluno');
  } catch (error) {
    alert('Erro ao fazer login com Google: ' + (error.message || ''));
  }
}

const showLoginForm = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');
const loginLoading = ref(false);

function openLoginForm() {
  showLoginForm.value = true;
  showRegisterForm.value = false; // Fecha o formulário de registro se estiver aberto
  loginError.value = '';
}

function closeLoginForm() {
  showLoginForm.value = false;
  loginEmail.value = '';
  loginPassword.value = '';
  loginError.value = '';
}

async function handleLogin() {
  loginLoading.value = true;
  loginError.value = '';
  try {
    await userStore.login({
      email: loginEmail.value,
      password: loginPassword.value
    });
    closeLoginForm();
    router.push('/area-do-aluno');
  } catch (error) {
    loginError.value = error.message || 'Erro ao fazer login';
  } finally {
    loginLoading.value = false;
  }
}

const resetEmail = ref('');
const resetError = ref('');
const resetSuccess = ref('');

async function handlePasswordReset() {
  resetError.value = '';
  resetSuccess.value = '';
  try {
    await sendPasswordResetEmail(auth, resetEmail.value);
    resetSuccess.value = 'E-mail de redefinição enviado! Verifique sua caixa de entrada ou caixa de span.';
  } catch (error) {
    resetError.value = error.message || 'Erro ao enviar e-mail de redefinição';
  }
}


useHead({
  title: "Estuday | Seu Gerenciador de Estudos Personalizado",
  meta: [
    {
      name: "description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      property: "og:title",
      content: "Estuday | Seu Gerenciador de Estudos Personalizado"
    },
    {
      property: "og:description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      property: "og:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      property: "og:url",
      content: "https://estuday.com.br"
    },
    {
      name: "twitter:title",
      content: "Estuday | Seu Gerenciador de Estudos Personalizado"
    },
    {
      name: "twitter:description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      name: "twitter:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      name: "keywords",
      content: "gerenciador de estudos, organização de estudos, acompanhamento de desempenho, planejamento de estudos, eficiência nos estudos, Estuday"
    }
  ]
});

</script>

<template>
  <DefaultLayout backgroundOpacity="opacity-100" class="p-2 sm:p-0">
    <!-- Container principal com posição absoluta original -->
    <div
      class="absolute bg-white p-6 border rounded-[18px] shadow-lg top-[200px] sm:top-[200px] sm:left-[200px] sm:p-8 sm:w-[480px]">
      <h1 class="font-bold mb-4 text-2xl sm:text-4xl w-[250px] text-gray-700">
        Bem-vindo ao <span class="text-primary">Estuday</span>.
      </h1>
      <p class="text-sm mb-8 text-gray-700 sm:text-base leading-relaxed">
        Seu gerenciador de estudos para organizar seu tempo, acompanhar seu desempenho e alcançar seus objetivos.
        Simplifique seus estudos e estude com mais eficiência!
      </p>

      <!-- Seção de botões de autenticação -->
      <div class="space-y-3 mb-6">
        <!-- Botão Google -->
        <Button
          variant="base"
          size="full"
          @click="handleGoogleLogin"
          class="flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </Button>

        <!-- Divisor -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <!-- Botões de login/cadastro -->
        <div class="grid grid-cols-2 gap-3">
          <Button
            variant="base"
            size="default"
            @click="openLoginForm"
            class="w-full"
          >
            Entrar
          </Button>
          <Button
            variant="baseDisable"
            size="default"
            @click="openRegisterForm"
            class="w-full"
          >
            Criar conta
          </Button>
        </div>
      </div>
    </div>

    <!-- Formulários ao lado direito -->
    <div class="absolute top-[200px] sm:top-[200px] sm:left-[700px] w-[400px]">
      <!-- Formulário de cadastro -->
      <div
        v-if="showRegisterForm"
        class="bg-white p-6 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm form-slide-in"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-700">Criar nova conta</h2>
          <button
            @click="closeRegisterForm"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              v-model="registerName"
              type="text"
              placeholder="Digite seu nome completo"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              v-model="registerEmail"
              type="email"
              placeholder="Digite seu e-mail"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="registerPassword"
              type="password"
              placeholder="Digite sua senha"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div v-if="registerError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ registerError }}</p>
          </div>
          
          <div class="flex gap-3 pt-2">
            <Button 
              variant="base" 
              size="default"
              :disabled="registerLoading" 
              @click="handleRegister"
              class="flex-1"
            >
              <svg v-if="registerLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ registerLoading ? 'Cadastrando...' : 'Criar conta' }}
            </Button>
            <Button 
              variant="baseDisable" 
              size="default"
              @click="closeRegisterForm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      <!-- Formulário de login -->
      <div
        v-if="showLoginForm"
        class="bg-white p-6 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm form-slide-in"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-700">Entrar na sua conta</h2>
          <button
            @click="closeLoginForm"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              v-model="loginEmail"
              type="email"
              placeholder="Digite seu e-mail"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="loginPassword"
              type="password"
              placeholder="Digite sua senha"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ loginError }}</p>
          </div>
          
          <!-- Esqueci minha senha -->
          <div class="flex justify-end">
            <button
              class="text-primary text-sm hover:text-tertiary transition-colors underline"
              @click="resetEmail = loginEmail"
              v-if="!resetSuccess"
            >
              Esqueci minha senha
            </button>
          </div>
          
          <!-- Campo para redefinir senha -->
          <div v-if="resetEmail" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Redefinir senha</h3>
            <input
              v-model="resetEmail"
              type="email"
              placeholder="Digite seu e-mail para redefinir a senha"
              class="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div class="flex gap-2 mt-3">
              <Button 
                variant="base" 
                size="sm"
                @click="handlePasswordReset"
              >
                Enviar redefinição
              </Button>
              <Button 
                variant="baseDisable" 
                size="sm"
                @click="resetEmail = ''"
              >
                Cancelar
              </Button>
            </div>
            <div v-if="resetError" class="text-red-600 text-sm mt-2">{{ resetError }}</div>
            <div v-if="resetSuccess" class="text-green-600 text-sm mt-2">{{ resetSuccess }}</div>
          </div>
          
          <div class="flex gap-3 pt-2">
            <Button 
              variant="base" 
              size="default"
              :disabled="loginLoading" 
              @click="handleLogin"
              class="flex-1"
            >
              <svg v-if="loginLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loginLoading ? 'Entrando...' : 'Entrar' }}
            </Button>
            <Button 
              variant="baseDisable" 
              size="default"
              @click="closeLoginForm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.form-slide-in {
  animation: slideInFromRight 0.3s ease-out;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
