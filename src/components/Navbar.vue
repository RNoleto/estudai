<script setup>
import { useAuth, UserButton } from 'vue-clerk';
import { onMounted, ref } from 'vue';

const { userId, isSignedIn, getToken } = useAuth();
const token = ref(null);

onMounted(async () => {
  if (isSignedIn.value) {
    try {
      token.value = await getToken.value();
      console.log("Token obtido na navbar:", token.value);
    } catch (error) {
      console.error("Erro ao obter o token na navbar:", error);
    }
  } else {
    console.warn("Usuário não autenticado.");
  }
});
</script>

<template>
  <nav class="flex justify-between p-4 items-center bg-gray-800 shadow-sm shadow-zinc-500">
    <!-- <pre class="text-white">Token: {{ token }}</pre> -->
    <p class="text-white font-bold">Gerenciador de Estudos</p>
    <UserButton />
  </nav>
</template>
