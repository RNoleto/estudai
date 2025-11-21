<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/useUserStore'; // Opcional, se quiser atualizar o estado

const router = useRouter();
const userStore = useUserStore();

const goToDashboard = async () => {
  // Opcional: Forçar uma atualização dos dados do usuário para ver se o status "Premium" já caiu
  // await userStore.fetchUserData(); 
  router.push('/dashboard'); // Ajuste para sua rota de dashboard
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
      
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
        Pagamento Recebido!
      </h2>
      
      <p class="text-gray-600 mb-8">
        Obrigado por assinar o Estuday Premium. Estamos processando seu pagamento e seu acesso será liberado em instantes.
      </p>

      <div class="bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm text-gray-600 border border-gray-100">
        <div class="flex justify-between mb-2">
          <span>Plano:</span>
          <span class="font-semibold text-gray-900">Premium Mensal</span>
        </div>
        <div class="flex justify-between">
          <span>Status:</span>
          <span class="font-semibold text-green-600">Processando</span>
        </div>
      </div>

      <div class="space-y-3">
        <button 
          @click="goToDashboard" 
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Ir para o Dashboard
        </button>
        
        <button 
          @click="goToHome"
          class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Voltar ao Início
        </button>
      </div>

    </div>
  </div>
</template>



<style scoped>
/* Se você não tiver a cor 'bg-primary' configurada no Tailwind, troque por 'bg-blue-600' ou 'bg-green-600' */
.bg-primary {
  background-color: #2563EB; /* Exemplo azul */
}
.hover\:bg-primary\/90:hover {
  background-color: #1D4ED8;
}
</style>