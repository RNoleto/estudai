<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';


import { computed, onMounted, ref } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import { useUserStore } from '../stores/useUserStore';
import { useRouter, useRoute } from 'vue-router';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue'
import AlertModal from '../components/ui/AlertModal.vue';
import { useHead } from '@vueuse/head';

const router = useRouter();
const route = useRoute();
const searchTerm = ref('');
const newCareerModal = ref(false);

const newCareerName = ref('');

//AlertModal
const alertVisible = ref(false);
const alertTitle = ref('');
const alertMessage = ref('');
const alertType = ref('');

//Navegação depois de fechar o AlerModal
const navigateAfterAlert = ref(false);

// Instanciar os stores
const userStore = useUserStore();
const careersStore = useCareerStore();

const selectedCareer = ref(null);

// Função para selecionar uma carreira
const selectCareer = (career) => {
  selectedCareer.value = selectedCareer.value === career ? null : career;
};

// Função para salvar a carreira no banco de dados e navegar para a próxima página
const saveCareerAndNavigate = async () => {
  
  if(selectedCareer.value){
    const result = await userStore.saveUserCareer(selectedCareer.value.id, selectedCareer.value.name);
    //Valores de alerta
    alertTitle.value = result.success ? 'Sucesso!' : 'Erro!';
    alertMessage.value = result.message;
    alertType.value = result.success ? 'success' : 'error';
    alertVisible.value = true;

    if(result.success){
      navigateAfterAlert.value = true;
    }

  }
};

const handleAlertClose = () => {
  alertVisible.value = false;
  // Se o alerta foi de sucesso e a flag estiver ativa, navegue para a próxima página
  if (navigateAfterAlert.value) {
    navigateAfterAlert.value = false; // Limpa a flag para evitar navegações futuras indevidas
    const nextRoute = route.path.startsWith('/area-do-aluno')
      ? { name: 'DashboardCarreiras' }
      : { name: 'Materias' };
    router.push(nextRoute);
  }
};

// Configura a carreira inicial com base no userStore.career
const setInitialSelectedCareer = () => {
  if (userStore.careerId) {
    const career = careersStore.careers.find(
      (career) => career.id === userStore.careerId
    );
    if (career) {
      selectedCareer.value = career;
      userStore.careerName = career.name;
    }
  }
};

// Buscar as carreiras assim que o componente for montado
onMounted(async () => {
  await userStore.fetchUserId();
  await careersStore.fetchCareers();
  // await userStore.checkUserCareer();
  // await userStore.fetchUserSubjects();

  // Ordenar as carreiras por ordem alfabética
  careersStore.careers.sort((a, b) => a.name.localeCompare(b.name));
  setInitialSelectedCareer();
});

const filteredCareers = computed(() => {
  if (!searchTerm.value) return careersStore.careers;
  return careersStore.careers.filter((career) =>
    career.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
const createCareer = () => {
  newCareerModal.value = true;
  document.body.style.overflow = 'hidden'; // Bloqueia a rolagem
};

const closeCareerModal = () => {
  newCareerModal.value = false;
  document.body.style.overflow = ''
  careersStore.fetchCareers();
};

const saveCareer = async () => {
  if (newCareerName.value.trim()) {
    try {
      // Ajusta a primeira letra para maiúscula
      const formattedName = newCareerName.value.trim().charAt(0).toUpperCase() + newCareerName.value.trim().slice(1).toLowerCase();

      await careersStore.createCareer(formattedName);
      newCareerName.value = '';
      closeCareerModal();
    } catch (error) {
      console.error('Erro ao salvar a nova carreira:', error);
    }
  } else {
    console.log('O nome da carreira é obrigatório.');
  }
};

useHead({
  title: "Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos",
  meta: [
    { name: "description", content: "Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { property: "og:title", content: "Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos" },
    { property: "og:description", content: "Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { property: "og:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { property: "og:url", content: "https://estuday.com.br/carreiras" },
    { name: "twitter:title", content: "Estuday | Escolha Sua Carreira - Prepare-se para Concursos Públicos" },
    { name: "twitter:description", content: "Selecione a carreira desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { name: "twitter:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { name: "keywords", content: "concursos públicos, escolha de carreira, preparação para concursos, planejamento de estudos, Estuday" }
  ]
});
</script>

<template>
  <DefaultLayout backgroundOpacity="opacity-20">
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pt-20 sm:pt-6">
        <div class="mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">               Escolha uma <span class="text-primary">carreira</span>
              </h1>
              <p class="mt-1 text-sm text-gray-600">                Selecione a carreira que você deseja seguir e prepare-se para concursos públicos de forma eficiente.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <!-- Search Section -->
        <div class="mb-6">
          <Search 
            placeholder="Pesquise a carreira..." 
            v-model="searchTerm" 
            class="max-w-md"
          />
        </div>

        <!-- Careers Grid -->
        <div class="mb-8">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <OptionCard 
              v-for="career in filteredCareers" 
              :key="career.id" 
              @click="selectCareer(career)" 
              :icon="career.icon"
              :careerName="career.name"
              :variant="selectedCareer && career.id === selectedCareer.id ? 'selected' : 'primary'"
              class="transition-all duration-200 hover:scale-105"
            />
          </div>
          
          <!-- Empty State -->
          <div v-if="!filteredCareers.length" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
              <i class="fa-solid fa-search text-6xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Carreira não encontrada</h3>
            <p class="text-gray-500">             Tente ajustar os termos de pesquisa ou criar uma nova carreira.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <!-- 
        <Button 
            variant="base" 
            @click="createCareer"
            class="w-full sm:w-auto"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            Criar Nova Carreira
          </Button>
        -->          
          
          <Button 
            :variant="selectedCareer ? 'base' : 'baseDisable'" 
            :disabled="!selectedCareer"
            class="w-full sm:w-auto" 
            @click="saveCareerAndNavigate" 
            :title="!selectedCareer ? 'Você precisa selecionar uma carreira antes' : ''"
          >
            <i class="fa-solid fa-arrow-right mr-2"></i>
            Avançar
          </Button>
        </div>
      </div>

      <!-- Create Career Modal -->
      <div v-if="newCareerModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-plus text-primary"></i>
              Criar Nova Carreira
            </h2>
            <button 
              @click="closeCareerModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="careerName" class="block text-sm font-medium text-gray-700 mb-2">
                Nome da Carreira
              </label>
              <Input 
                id="careerName"
                v-model="newCareerName" 
                type="text" 
                class="w-full"
                placeholder="Digite o nome da carreira"
                :showLabel="false" 
              />
            </div>
            
            <div class="flex gap-3 pt-4">
              <Button 
                variant="secondary"
                @click="closeCareerModal"
                class="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                variant="base"
                @click="saveCareer"
                class="flex-1"
              >
                <i class="fa-solid fa-save mr-2"></i>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Modal -->
      <AlertModal 
        :visible="alertVisible" 
        :title="alertTitle" 
        :message="alertMessage" 
        :type="alertType" 
        @close="handleAlertClose" 
      />
    </div>
  </DefaultLayout>
</template>
