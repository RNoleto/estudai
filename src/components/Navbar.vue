<script setup>
import { UserButton } from 'vue-clerk';
// import { onMounted } from 'vue';
// import { useUserStore } from '../stores/useUserStore';

// const userStore = useUserStore();

// onMounted(() => {
//   userStore.initializeUser(); // Inicializa o usuário, incluindo token e ID
// });
</script>

<template>
  <nav class="flex justify-between p-4 items-center bg-gray-800 shadow-sm shadow-zinc-500">
    <!-- <pre class="text-white">Token: {{ userStore.token }}</pre> -->
    <p class="text-white font-bold">Gerenciamento de Estudo</p>
    <UserButton />
  </nav>
</template>
