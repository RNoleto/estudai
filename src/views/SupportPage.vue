<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const success = ref(false);
const error = ref('');

// Função para submeter o formulário
async function submitSupport() {
  try {
    error.value = '';
    await axios.post('/support', form.value);
    success.value = true;

    // Limpar os campos após enviar
    form.value = { name: '', email: '', subject: '', message: '' };
  } catch (err) {
    error.value = 'Front Ocorreu um erro ao enviar sua mensagem. Tente novamente.';
    console.error(err);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
          <!-- Header Section -->
      <div class="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pt-20 sm:pt-6">
      <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Suporte ao <span class="text-primary">usuário</span>
            </h1>
            <p class="mt-1 text-sm text-gray-600 sm:text-base">
              Estamos aqui para ajudar! Entre em contato conosco para qualquer dúvida ou problema.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        
        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-envelope text-primary"></i>
            Envie sua Mensagem
          </h2>
          
          <form @submit.prevent="submitSupport" class="space-y-6">
            <!-- Nome -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Digite seu nome completo"
                required 
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="seu@email.com"
                required 
              />
            </div>

            <!-- Assunto -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Assunto
              </label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Qual é o assunto da sua mensagem?"
                required 
              />
            </div>

            <!-- Mensagem -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea 
                id="message" 
                v-model="form.message" 
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                placeholder="Descreva sua dúvida ou problema detalhadamente..."
                required
              ></textarea>
            </div>

            <!-- Botão de Envio -->
            <button 
              type="submit" 
              class="w-full bg-primary hover:bg-baseGreen text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <i class="fa-solid fa-paper-plane mr-2"></i>
              Enviar Mensagem
            </button>

            <!-- Mensagens de Feedback -->
            <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <i class="fa-solid fa-check-circle text-green-600 mr-2"></i>
                <p class="text-green-800 font-medium">
                  Sua mensagem foi enviada com sucesso!
                </p>
              </div>
            </div>
            
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <i class="fa-solid fa-exclamation-circle text-red-600 mr-2"></i>
                <p class="text-red-800 font-medium">
                  {{ error }}
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Support Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-headset text-primary"></i>
            Como Podemos Ajudar?
          </h2>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <i class="fa-solid fa-clock text-primary"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">Resposta Rápida</h3>
                <p class="text-sm text-gray-600">
                  Nossa equipe responde em até 24 horas úteis.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <i class="fa-solid fa-shield-alt text-primary"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">Suporte Especializado</h3>
                <p class="text-sm text-gray-600">
                  Equipe técnica preparada para resolver seus problemas.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <i class="fa-solid fa-envelope-open text-primary"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">Comunicação Direta</h3>
                <p class="text-sm text-gray-600">
                  Resposta enviada diretamente para seu e-mail.
                </p>
              </div>
            </div>

            <!-- Ilustração -->
            <div class="mt-8 text-center">
              <img 
                src="/img/support.svg" 
                alt="Ilustração de suporte" 
                class="w-full max-w-xs mx-auto opacity-80" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>