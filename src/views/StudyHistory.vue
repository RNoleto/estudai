<script setup>
import History from '../layouts/History.vue';

import Head from '../components/Head.vue';

import { useHead } from '@vueuse/head';

useHead({
    title: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA",
    meta:[
    { name: 'description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { property: 'og:title', content: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA" },
    { property: 'og:description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { property: 'og:image', content: "https://estuday.com.br/img/wallpaper.png" },
    { property: 'og:url', content: "https://estuday.com.br/area-do-aluno/historico-de-estudos" },
    { name: 'twitter:title', content: "Estuday | Histórico de Estudos - Acompanhe Seu Progresso e Melhore com IA" },
    { name: 'twitter:description', content: "Veja todo o seu histórico de estudo em um só lugar! Filtre matérias, analise seu desempenho e receba insights com IA para melhorar sua aprendizagem. Estude de forma inteligente com o Estuday!" },
    { name: 'twitter:image', content: "https://estuday.com.br/img/wallpaper.png" },
    { name: 'keywords', content: "concursos públicos, gestão do tempo de estudo, organização de estudos, preparação para concurso, questões de concurso, acompanhamento de desempenho, planejamento de estudos" }
    ]
})

</script>

<template>
    
        <div class="flex flex-col mt-12 gap-4 p-4 sm:mt-0">
            <h3 class="text-xl font-bold text-gray-700 sm:text-4xl">Histórico de <span class="text-primary">estudos.</span></h3>
            <History />
        </div>
</template>