<script setup>
import axios from 'axios';
import Button from './ui/Button.vue';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from 'vue-clerk';

// Inicialize o Stripe usando a variável correta
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const { user } = useUser();
const clerkUserId = user?.value?.id; // Obtenha o ID do usuário do Clerk

const handleCheckout = async () => {
    try {
        // Envie o clerk_user_id no corpo da requisição para criar a sessão
        const { data } = await axios.post('/stripe/create-checkout', {
            clerk_user_id: clerkUserId
        });
        if (data.sessionId) {
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe não foi inicializado corretamente");
            }
            // Redireciona para o Checkout do Stripe utilizando o sessionId
            const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            if (result.error) {
                console.error(result.error.message);
            }
        }
    } catch (error) {
        console.error('Erro ao iniciar o checkout:', error);
    }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Button @click="handleCheckout" variant="primary">
      Adquirir Plano
    </Button>
  </div>
</template>
