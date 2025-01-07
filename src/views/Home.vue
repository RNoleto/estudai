<script setup>
import { SignInButton } from 'vue-clerk';

//Componentes UI
import Button from '../components/ui/Button.vue';

</script>

<template>
  <div class="h-screen grid grid-cols-2">
    <!-- Esquerda -->
     <div class="flex flex-col h-full justify-center p-8 max-w-[550px] mx-auto">
      <h1 class="text-4xl font-bold mb-3">Bem-vindo</h1>
      <p class="mb-8">Ao seu Gerenciador de estudos</p>
       <SignInButton>
        <Button variant="primary" size="default">Fazer login ou criar conta</Button>
       </SignInButton>
     </div>
     <!-- Direita -->
      <div class="relative w-full overflow-hidden">
        <!-- <p>Espaço para colocar uma imagem</p> -->
        <div class="w-full h-full">
          <img src="../../public/img/wallpaper.jpeg" alt="Wallpaper" class="w-full h-full object-cover">
        </div>
      </div>
  </div>
</template> 