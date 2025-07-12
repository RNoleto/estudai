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
    resetSuccess.value = 'E-mail de redefinição enviado! Verifique sua caixa de entrada.';
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
    <div
      class="absolute bg-white p-4 border rounded-[18px] shadow-md top-[200px] sm:top-[200px] sm:left-[200px] sm:p-[30px] sm:w-[460px]">
      <h1 class="font-bold mb-3 text-2xl sm:text-4xl w-[250px] text-gray-700">
        Bem-vindo ao <span class="text-primary">Estuday</span>.
      </h1>
      <p class="text-sm mb-[40px] text-gray-700 sm:text-base">
        Seu gerenciador de estudos para organizar seu tempo, acompanhar seu desempenho e alcançar seus objetivos.
        Simplifique seus estudos e estude com mais eficiência!
      </p>
      <!-- <SignInButton>
        <Button variant="base" size="default">
          Fazer login ou criar conta
        </Button>
      </SignInButton> -->

      <Button
        variant="base"
        size="default"
        @click="handleGoogleLogin"
        style="margin-top: 16px; width: 100%;"
      >
      Entrar com Google
    </Button>

    <Button
  variant="base"
  size="default"
  @click="openRegisterForm"
  style="margin-top: 8px; width: 100%;"
>
  Criar conta
</Button>

    <Button
  variant="base"
  size="default"
  @click="openLoginForm"
  style="margin-top: 8px; width: 100%;"
>
  Entrar com e-mail e senha
</Button>

    <!-- Formulário de cadastro -->
<div
  v-if="showRegisterForm"
  class="mt-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-2"
  style="max-width: 100%;"
>
  <h2 class="text-lg font-bold text-gray-700 mb-2">Criar nova conta</h2>
  <input
    v-model="registerName"
    type="text"
    placeholder="Nome"
    class="input border px-3 py-2 rounded"
    required
  />
  <input
    v-model="registerEmail"
    type="email"
    placeholder="E-mail"
    class="input border px-3 py-2 rounded"
    required
  />
  <input
    v-model="registerPassword"
    type="password"
    placeholder="Senha"
    class="input border px-3 py-2 rounded"
    required
  />
  <div v-if="registerError" class="text-red-500 text-sm mt-1">{{ registerError }}</div>
  <div class="flex gap-2 mt-2">
    <Button :disabled="registerLoading" @click="handleRegister">
      {{ registerLoading ? 'Cadastrando...' : 'Cadastrar' }}
    </Button>
    <Button variant="baseDisable" @click="closeRegisterForm">Cancelar</Button>
  </div>
</div>

    <!-- Formulário de login -->
<div
  v-if="showLoginForm"
  class="mt-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-2"
  style="max-width: 100%;"
>
  <h2 class="text-lg font-bold text-gray-700 mb-2">Entrar</h2>
  <input
    v-model="loginEmail"
    type="email"
    placeholder="E-mail"
    class="input border px-3 py-2 rounded"
    required
  />
  <input
    v-model="loginPassword"
    type="password"
    placeholder="Senha"
    class="input border px-3 py-2 rounded"
    required
  />
  <div v-if="loginError" class="text-red-500 text-sm mt-1">{{ loginError }}</div>
  <div class="flex justify-end">
  <button
    class="text-blue-600 text-sm underline"
    @click="resetEmail = loginEmail"
    v-if="!resetSuccess"
    @dblclick="handlePasswordReset"
    style="background: none; border: none; cursor: pointer;"
  >
    Esqueci minha senha
  </button>
</div>
<!-- Campo para digitar o e-mail para redefinir a senha -->
<div v-if="resetEmail">
  <input
    v-model="resetEmail"
    type="email"
    placeholder="Digite seu e-mail para redefinir a senha"
    class="input border px-3 py-2 rounded mt-2"
    required
  />
  <Button @click="handlePasswordReset">Enviar redefinição</Button>
  <div v-if="resetError" class="text-red-500 text-sm mt-1">{{ resetError }}</div>
  <div v-if="resetSuccess" class="text-green-600 text-sm mt-1">{{ resetSuccess }}</div>
</div>
  <div class="flex gap-2 mt-2">
    <Button :disabled="loginLoading" @click="handleLogin">
      {{ loginLoading ? 'Entrando...' : 'Entrar' }}
    </Button>
    <Button variant="baseDisable" @click="closeLoginForm">Cancelar</Button>
  </div>
</div>

    </div>
  </DefaultLayout>
</template>
