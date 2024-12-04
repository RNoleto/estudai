<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'

</script>

<template>
    <nav class="flex justify-between p-4 items-center bg-gray-800 shadow-sm shadow-zinc-500">
        <p class="text-white font-bold">Gerenciador de Estudos</p>
        <div class="text-white flex gap-4 text-sm">
            <p>menu 1</p>
            <p>menu 2</p>
        </div>
        <UserButton /> 
    </nav>
</template>