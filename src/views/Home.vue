<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'

</script>

<template>
  <div class="flex w-full h-screen justify-center align-center">
    <div class="w-full bg-zinc-300 h-full">
      <!-- Lado Esquerdo -->
       <div>
         <SignedOut>
           <SignInButton />
         </SignedOut>
         <SignedIn>
           <UserButton />
         </SignedIn>
       </div>
    </div>
    <div class="bg-zinc-500 w-full h-full">
      <!-- Lado Direito -->
       <p>Lado que vai ficar a imagem</p>
    </div>
  </div>
</template> 