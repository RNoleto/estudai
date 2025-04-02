<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 class="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <p class="text-2xl mb-2">Algo deu errado.</p>
        <p class="text-lg text-gray-700 mb-8">
            Desculpe, ocorreu um erro inesperado. Tente novamente mais tarde.
        </p>
        <button @click="goHome" class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Voltar para a Home
        </button>
    </div>
</template>