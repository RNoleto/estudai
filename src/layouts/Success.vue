<script setup>
import { onMounted, ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { useUser } from 'vue-clerk';

const router = useRouter();
const { user, isLoaded } = useUser();

const confirmationMessage = ref('');
const subscriptionPlan = ref('');
const stripeCustomerId = ref('');
const stripeSubscriptionId = ref('');

async function updateClerkMetadataOnServer(clerkUserId, stripeCustomerId, stripeSubscriptionId) {
    try {
        const response = await api.post('/update-clerk-metadata', {
            clerk_user_id: clerkUserId,
            stripeCustomerId,
            stripeSubscriptionId,
        });
        console.log('Clerk update response:', response.data);
    } catch (error) {
        console.error('Erro ao atualizar os metadados no Clerk:', error);
    }
}

onMounted(async () => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
        try {
            // Chama seu endpoint para confirmar a assinatura e recuperar os IDs do Stripe
            const response = await api.get(`/stripe/confirm-subscription?session_id=${sessionId}`);
            console.log('response: ', response.data);
            if (response.data.message) {
                confirmationMessage.value = "Assinatura feita com sucesso!";
                const updatedUser = response.data.user;
                if (updatedUser) {
                    subscriptionPlan.value = updatedUser.public_metadata?.subscriptionPlan || '';
                    stripeCustomerId.value = updatedUser.private_metadata?.stripeCustomerId || '';
                    stripeSubscriptionId.value = updatedUser.private_metadata?.stripeSubscriptionId || '';

                    // Se o usuário estiver logado, atualize os metadados no Clerk via backend
                    if (user.value?.id) {
                        await updateClerkMetadataOnServer(
                            user.value.id,
                            stripeCustomerId.value,
                            stripeSubscriptionId.value
                        );
                    }
                } else {
                    console.warn("Dados do usuário não encontrados na resposta.");
                }
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
            <p>Metadado Publico</p>
            <p class="mb-2">subscriptionPlan: <strong>{{ subscriptionPlan }}</strong></p>
            <p>Metadado Privado</p>
            <p class="mb-2">stripeCustomerId: <strong>{{ stripeCustomerId }}</strong></p>
            <p>stripeSubscriptionId: <strong>{{ stripeSubscriptionId }}</strong></p>
        </div>
    </div>
</template>
