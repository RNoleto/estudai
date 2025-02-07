<script setup>
import axios from 'axios'

// Funções para tratar a seleção dos planos
// Aqui você pode adicionar a lógica para redirecionar o usuário
// ou fazer uma requisição para iniciar o processo de assinatura

const selectFreePlan = () => {
    // Exemplo: redireciona para a área do usuário ou registra a escolha no backend
    console.log("Plano Gratuito selecionado");
    // Você pode usar o router se estiver utilizando vue-router:
    // router.push('/area-do-aluno');
};

const selectPremiumPlan = async () => {
    console.log("Plano Premium selecionado");
    // Exemplo: faça uma requisição para iniciar o checkout do Stripe para o plano premium
    try {
        const response = await axios.post('/stripe/create-checkout', {
            // Envie os dados necessários, por exemplo, o ID do usuário se necessário
            clerk_user_id: "ID_DO_USUARIO" // Substitua ou obtenha dinamicamente
        });
        if (response.data.sessionId) {
            // Redirecione para a página de checkout do Stripe
            // Você pode utilizar window.location.href ou redirecionar via vue-router
            window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
        }
    } catch (error) {
        console.error("Erro ao iniciar o checkout do Plano Premium:", error);
    }
};
</script>

<template>
    <div class="bg-gray-100 flex items-center justify-center">
        <div class="max-w-4xl w-full px-4 py-8">
            <h1 class="text-3xl font-bold text-center mb-8">Escolha Seu Plano</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Card do Plano Gratuito -->
                <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                    <h2 class="text-xl font-bold mb-4">Plano Gratuito</h2>
                    <p class="text-gray-600 mb-4">
                        Aproveite nosso plano gratuito com funcionalidades básicas para começar.
                    </p>
                    <ul class="mb-6 space-y-2">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Funcionalidade 1</span>
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Funcionalidade 2</span>
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Funcionalidade 3</span>
                        </li>
                    </ul>
                    <button class="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        @click="selectFreePlan">
                        Selecionar Plano Gratuito
                    </button>
                </div>
                <!-- Card do Plano Premium -->
                <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                    <h2 class="text-xl font-bold mb-4">Plano Premium</h2>
                    <p class="text-gray-600 mb-4">
                        Tenha acesso a funcionalidades avançadas e suporte prioritário com nosso plano premium.
                    </p>
                    <div class="text-4xl font-bold text-center mb-4">R$19,90/mês</div>
                    <ul class="mb-6 space-y-2">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Todas as funcionalidades do plano gratuito</span>
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Funcionalidades Exclusivas Premium</span>
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✔</span>
                            <span>Suporte Prioritário</span>
                        </li>
                    </ul>
                    <button class="mt-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        @click="selectPremiumPlan">
                        Selecionar Plano Premium
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>