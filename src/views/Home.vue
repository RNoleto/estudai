<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { SignInButton } from 'vue-clerk';
import Button from '../components/ui/Button.vue';
</script>

<template>
  <!-- Aqui definimos a opacidade do background para 100% (padrão) -->
  <DefaultLayout backgroundOpacity="opacity-100">
    <!-- Seu card posicionado com o conteúdo -->
    <div class="absolute top-[200px] left-[200px] bg-white border rounded-[18px] shadow-md p-[30px] w-[460px]">
      <h1 class="text-4xl font-bold mb-3 w-[250px] text-[#21BFCA]">
        Bem-vindo ao Estudaí.
      </h1>
      <p class="text-base mb-[40px] text-zinc-600">
        Seu gerenciador de estudos para organizar seu tempo, acompanhar seu desempenho e alcançar seus objetivos. 
        Simplifique seus estudos e estude com mais eficiência!
      </p>
      <SignInButton>
        <Button variant="base" size="default">
          Fazer login ou criar conta
        </Button>
      </SignInButton>
    </div>
  </DefaultLayout>
</template>
