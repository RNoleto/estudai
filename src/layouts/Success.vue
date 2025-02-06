<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const sessionId = route.query.session_id;
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-green-100">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h1 class="text-2xl font-bold text-green-600">Pagamento Concluído! 🎉</h1>
      <p class="text-gray-700 mt-2">
        Seu pagamento foi processado com sucesso. Obrigado por sua compra!
      </p>
      <p v-if="sessionId" class="text-sm text-gray-500 mt-1">
        ID da Sessão: {{ sessionId }}
      </p>
      <router-link to="/area-do-aluno/historico-de-estudos" class="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Ir para o Painel
      </router-link>
    </div>
  </div>
</template>
