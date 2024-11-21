<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'

</script>

<template>
    <nav class="flex justify-between p-4 items-center bg-gray-800 shadow-sm shadow-zinc-500">
        <p class="text-white font-bold">Logo</p>
        <UserButton /> 
    </nav>
</template>