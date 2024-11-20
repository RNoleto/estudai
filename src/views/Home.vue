<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'
import Button from '../components/ui/Button.vue'

</script>

<template>
  <div class="grid h-full grid-cols-2">
    <!-- Esquerda -->
     <div class="flex flex-col h-full justify-center p-8 max-w-[550px] mx-auto">
      <h1 class="text-4xl font-bold mb-3">Bem-vindo</h1>
      <p class="mb-8">Ao seu Gerenciador de estudos</p>
       <SignInButton>
        <Button variant="primary" size="default">Fazer login ou criar conta</Button>
       </SignInButton>
     </div>
     <!-- Direita -->
      <div class="relative h-full w-full">
        <p>Espaço para colocar uma imagem</p>
      </div>
         <!-- <SignedOut>
         </SignedOut>
         <SignedIn>
           <UserButton />
         </SignedIn> -->
  </div>
</template> 