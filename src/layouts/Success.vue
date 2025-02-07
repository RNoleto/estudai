<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUser } from 'vue-clerk';

const router = useRouter();
const { user, isLoaded } = useUser();
const confirmationMessage = ref('');
const subscriptionPlan = ref('');
const stripeCustomerId = ref('');
const stripeSubscriptionId = ref('');

onMounted(async () => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
        try {
            const response = await axios.get(`/stripe/confirm-subscription?session_id=${sessionId}`);
            if (response.data.message) {
                confirmationMessage.value = "Assinatura feita com sucesso!";
                // Se o endpoint retornar os dados do usuário, atualize os metadados para debugar
                const updatedUser = response.data.user;
                subscriptionPlan.value = updatedUser.public_metadata.subscriptionPlan || '';
                stripeCustomerId.value = updatedUser.private_metadata.stripeCustomerId || '';
                stripeSubscriptionId.value = updatedUser.private_metadata.stripeSubscriptionId || '';
            } else {
                confirmationMessage.value = "Assinatura não realizada.";
            }
        } catch (error) {
            console.error("Erro ao confirmar assinatura:", error);
            confirmationMessage.value = "Assinatura não realizada.";
        }
    } else {
        confirmationMessage.value = "Sessão não encontrada.";
    }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4">
    <h1 class="text-3xl font-bold mb-4">{{ confirmationMessage }}</h1>
    <div class="bg-white p-6 rounded shadow">
      <p class="mb-2">Subscription Plan: <strong>{{ subscriptionPlan }}</strong></p>
      <p class="mb-2">Stripe Customer ID: <strong>{{ stripeCustomerId }}</strong></p>
      <p>Stripe Subscription ID: <strong>{{ stripeSubscriptionId }}</strong></p>
    </div>
  </div>
</template>
