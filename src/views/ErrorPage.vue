<script setup>
import { useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue'; // Reutilizando seu componente

const router = useRouter();

const goHome = () => {
    router.push('/area-do-aluno'); // Direciona para o dashboard, que é mais útil
};

const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 text-center">
            
            <div class="relative flex justify-center">
                <div class="absolute w-32 h-32 bg-blue-100 rounded-full blur-xl opacity-70 animate-pulse"></div>
                <div class="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
                    <i class="fa-solid fa-compass-drafting text-6xl text-primary"></i>
                </div>
            </div>

            <div>
                <h1 class="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Ops! Caminho errado.
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Parece que a página que você está procurando não existe ou foi movida. Não se preocupe, seus estudos continuam salvos!
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button variant="secondary" @click="goBack" class="w-full sm:w-auto">
                    <i class="fa-solid fa-arrow-left mr-2"></i> Voltar
                </Button>
                
                <Button variant="base" @click="goHome" class="w-full sm:w-auto">
                    <i class="fa-solid fa-home mr-2"></i> Ir para o Início
                </Button>
            </div>

            <p class="mt-8 text-sm text-gray-400">
                Acha que isso é um erro do sistema? 
                <router-link to="/area-do-aluno/suporte" class="font-medium text-primary hover:text-blue-600 transition-colors">
                    Contate o suporte
                </router-link>.
            </p>
        </div>
    </div>
</template>