<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'
</script>

<template>
    <div class="flex justify-between p-4 bg-zinc-500 items-center">
        <p>Logo</p>
        <UserButton /> 
    </div>
</template>