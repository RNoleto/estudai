<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="max-w-4xl w-full px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Escolha Seu Plano</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="bg-white shadow-md rounded-2xl p-6 flex flex-col">
          <h2 class="text-xl font-bold mb-4">Plano Gratuito</h2>
          <p class="text-gray-600 mb-4">
            Aproveite nosso plano gratuito com funcionalidades básicas para começar.
          </p>
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Registros de estudos</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Métricas de estudos</span>
            </li>
          </ul>
          <button
            class="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            @click="selectFreePlan"
            :disabled="isLoading"
          >
            Selecionar Plano Gratuito
          </button>
        </div>

        <div class="bg-white shadow-md rounded-2xl p-6 flex flex-col border-2 border-transparent hover:border-green-500 transition-all">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Plano Premium</h2>
            <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Recomendado</span>
          </div>
          
          <p class="text-gray-600 mb-4">
            Tenha acesso a funcionalidades avançadas e suporte prioritário com nosso plano premium.
          </p>
          
          <div class="text-4xl font-bold text-center mb-4">R$ 19,90<span class="text-base font-normal text-gray-500">/mês</span></div>
          
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Todas as funcionalidades do plano gratuito</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Insight's com IA</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Sem limites de registros de estudo</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span>
              <span>Registro manual de estudos</span>
            </li>
          </ul>
          
          <button
            class="mt-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            @click="selectPremiumPlan"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isLoading ? 'Gerando Pagamento...' : 'Assinar Premium Agora' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore.js';

const userStore = useUserStore();
const isLoading = ref(false);

onMounted(async () => {
  if (!userStore.userId) {
    await userStore.initializeUser();
  }
});

const selectFreePlan = () => {
  console.log("Plano Gratuito selecionado");
  // Lógica para plano gratuito (se necessário)
};

const selectPremiumPlan = async (arg = null) => {
  // 1. SANITIZAÇÃO: Verifica o que foi recebido.
  // Se 'arg' for uma String, é o CPF vindo da recursão.
  // Se for Objeto (evento de clique) ou null, não temos CPF ainda.
  const cpfFornecido = (typeof arg === 'string') ? arg : null;

  // Validação simples
  if (!userStore.userId) {
    alert("Erro: Usuário não identificado.");
    return;
  }

  // Só ativa o loading se for a chamada principal (não recursiva) ou se tivermos certeza
  if (!cpfFornecido) {
      isLoading.value = true;
  }

  try {
    // Monta os dados
    const payload = { user_id: userStore.userId };
    
    // Agora usamos a variável sanitizada 'cpfFornecido'
    if (cpfFornecido) {
        payload.cpf = cpfFornecido;
    }

    // Chamada para o Laravel (Verifique se a rota precisa do /api antes)
    const response = await axios.post('checkout/abacatepay', payload);

    if (response.data.payment_url) {
      window.location.href = response.data.payment_url;
    }

  } catch (error) {
    console.error("Erro checkout:", error);
    
    // VERIFICAÇÃO ESPECIAL: É erro 400 por falta de CPF?
    if (error.response && error.response.status === 400 && error.response.data.code === 'MISSING_CPF') {
        
        // Remove o loading temporariamente para o prompt não parecer travado
        isLoading.value = false; 

        // Pede o CPF ao usuário na hora
        const cpfInput = window.prompt("Para gerar o PIX, o banco exige o CPF. Por favor, digite seu CPF (apenas números):");
        
        if (cpfInput) {
            // Ativa loading de novo
            isLoading.value = true;
            // TENTA DE NOVO chamando a mesma função, passando a STRING do CPF
            await selectPremiumPlan(cpfInput);
            return; // Encerra a execução atual
        }
    }
    
    // Se for outro erro ou o usuário cancelou o prompt
    let msg = "Ocorreu um erro.";
    if (error.response && error.response.data && error.response.data.error) {
      msg = error.response.data.error;
    }
    alert(msg);

  } finally {
    // Lógica do finally ajustada:
    // Se NÃO tivermos CPF (é a chamada principal do clique), paramos o loading.
    // Se TIVERMOS CPF (é a chamada recursiva), deixamos o loading quieto, pois a chamada pai vai desligá-lo depois.
    if (!cpfFornecido) {
        isLoading.value = false;
    }
  }
};
</script>