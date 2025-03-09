<script setup>
import History from '../layouts/History.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

import Head from '../components/Head.vue';

</script>

<template>
    <Head 
        title="Estuday |  Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA"
        description="Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!"
        image="https://estuday.com.br/img/wallpaper.png"
        url="https://estuday.com.br"
    />
    <DefaultLayout backgroundOpacity="opacity-20">
        <div class="flex flex-col mt-12 gap-4 p-4 sm:mt-0">
            <h3 class="text-xl font-bold text-gray-700 sm:text-4xl">Histórico de <span class="text-primary">estudos.</span></h3>
            <History />
        </div>
    </DefaultLayout>
</template>