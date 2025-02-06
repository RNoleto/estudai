<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUser } from 'vue-clerk';

const router = useRouter();
const { user, isLoaded } = useUser();

onMounted(async () => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
        try {
            await axios.get(`/stripe/confirm-subscription?session_id=${sessionId}`);
            if (isLoaded) {
                await user.value.reload(); // Recarrega os dados do usuário
            }
            router.push({ name: 'dashboard' }); // Redirecione para a página adequada
        } catch (error) {
            console.error('Erro ao confirmar assinatura:', error);
        }
    }
});
</script>

<template>
    <div>Processando sua assinatura...</div>
</template>