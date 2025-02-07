<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="max-w-4xl w-full px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Escolha Seu Plano</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Plano Gratuito -->
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 class="text-xl font-bold mb-4">Plano Gratuito</h2>
          <p class="text-gray-600 mb-4">
            Aproveite nosso plano gratuito com funcionalidades básicas para começar.
          </p>
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Funcionalidade 1</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Funcionalidade 2</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Funcionalidade 3</span>
            </li>
          </ul>
          <button
            class="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            @click="selectFreePlan"
          >
            Selecionar Plano Gratuito
          </button>
        </div>
        <!-- Plano Premium -->
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 class="text-xl font-bold mb-4">Plano Premium</h2>
          <p class="text-gray-600 mb-4">
            Tenha acesso a funcionalidades avançadas e suporte prioritário com nosso plano premium.
          </p>
          <div class="text-4xl font-bold text-center mb-4">R$19,90/mês</div>
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Todas as funcionalidades do plano gratuito</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Funcionalidades Exclusivas Premium</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Suporte Prioritário</span>
            </li>
          </ul>
          <button
            class="mt-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            @click="selectPremiumPlan"
          >
            Selecionar Plano Premium
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore.js';
import { onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.userId) {
    await userStore.initializeUser();
  }
});

const selectFreePlan = () => {
  console.log("Plano Gratuito selecionado");
  // Aqui pode ser implementada a lógica para assinar o plano gratuito
};

const selectPremiumPlan = async () => {
  console.log("Plano Premium selecionado");
  try {
    const clerk_user_id = userStore.userId;
    if (!clerk_user_id) {
      console.error("User ID não encontrado no store.");
      return;
    }
    
    const response = await axios.post('/stripe/create-checkout', { clerk_user_id });

    if (response.data.sessionId) {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe não foi inicializado corretamente");
      }
      const result = await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      if (result.error) {
        console.error(result.error.message);
      }
    }
  } catch (error) {
    console.error("Erro ao iniciar o checkout do Plano Premium:", error);
  }
};
</script>
