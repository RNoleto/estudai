<script setup>
import axios from 'axios';
import Button from './ui/Button.vue';

const handleCheckout = async () => {
    try {
        // Faz uma requisição POST para o endpoint /checkout
        const { data } = await axios.post('/checkout')

        // Verifica se a URL foi retornada e redireciona
        if (data.url) {
            window.location.href = data.url
        }
    } catch (error) {
        console.error('Erro ao iniciar o checkout:', error)
    }
}
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <Button @click="handleCheckout" variant="primary">
            Pagar com Stripe
        </Button>
    </div>
</template>