<script setup>
import { SignInButton } from 'vue-clerk';
import Button from '../components/ui/Button.vue';

import { useHead } from '@vueuse/head';

useHead({
  title: "Estuday | Seu Gerenciador de Estudos Personalizado",
  meta: [
    {
      name: "description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      property: "og:title",
      content: "Estuday | Seu Gerenciador de Estudos Personalizado"
    },
    {
      property: "og:description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      property: "og:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      property: "og:url",
      content: "https://estuday.com.br"
    },
    {
      name: "twitter:title",
      content: "Estuday | Seu Gerenciador de Estudos Personalizado"
    },
    {
      name: "twitter:description",
      content: "Organize seu tempo de estudo, acompanhe seu desempenho e alcance seus objetivos com o Estuday. Simplifique seus estudos e estude com mais eficiência!"
    },
    {
      name: "twitter:image",
      content: "https://estuday.com.br/img/metaImg.webp"
    },
    {
      name: "keywords",
      content: "gerenciador de estudos, organização de estudos, acompanhamento de desempenho, planejamento de estudos, eficiência nos estudos, Estuday"
    }
  ]
});

</script>

<template>
    <div
      class="absolute bg-white p-4 border rounded-[18px] shadow-md top-[200px] sm:top-[200px] sm:left-[200px] sm:p-[30px] sm:w-[460px]">
      <h1 class="font-bold mb-3 text-2xl sm:text-4xl w-[250px] text-gray-700">
        Bem-vindo ao <span class="text-primary">Estuday</span>.
      </h1>
      <p class="text-sm mb-[40px] text-gray-700 sm:text-base">
        Seu gerenciador de estudos para organizar seu tempo, acompanhar seu desempenho e alcançar seus objetivos.
        Simplifique seus estudos e estude com mais eficiência!
      </p>
      <SignInButton>
        <Button variant="base" size="default">
          Fazer login ou criar conta
        </Button>
      </SignInButton>
    </div>
</template>
