<script setup>
import Hero from './views/Hero.vue';
import Demonstration from './views/Demonstration.vue';
import PrintsShowcase from './views/PrintsShowcase.vue';
import Testimonials from './views/Testimonials.vue';
import Signatures from './views/Signatures.vue';
import FAQ from './views/FAQ.vue';
import Action from './views/Action.vue';
import Header from './components/Header.vue';

import { useHead } from '@vueuse/head';
useHead({
  title: 'Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos',
  meta: [
    {
      name: 'description',
      content: 'Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos.'
    },
    {
      property: 'og:title',
      content: 'Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos'
    },
    {
      property: 'og:description',
      content: 'Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos.'
    },
    {
      property: 'og:image',
      content: 'https://estuday.com.br/img/metaImg.webp'
    },
    {
      property: 'og:url',
      content: 'https://estuday.com.br/carreiras'
    },
    {
      name: 'twitter:title',
      content: 'Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos'
    },
    {
      name: 'twitter:description',
      content: 'Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos.'
    },
    {
      name: 'twitter:image',
      content: 'https://estuday.com.br/img/metaImg.webp'
    },
    {
      name: 'keywords',
      content: 'concursos públicos, escolha de carreira, preparação para concursos, planejamento de estudos, Estuday'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

</script>

<template>
        <Header />
        <main>
            <Hero />
            <Demonstration />
            <PrintsShowcase />
            <Testimonials />
            <!-- <Signatures /> -->
            <FAQ />
            <Action />
        </main>
</template>

<style scoped>
main {
    scroll-behavior: smooth;
    scroll-padding-top: 64px;
    margin: 0 auto;
    /* max-width: 1200px; */
  }

  section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        min-height: 100vh;
    }
</style>