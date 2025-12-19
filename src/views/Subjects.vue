<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { computed, onMounted, ref } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useUserStore } from '../stores/useUserStore';
import { useRouter, useRoute } from 'vue-router';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Modal from '../components/ui/Modal.vue';
import AlertModal from '../components/ui/AlertModal.vue';

import { useHead } from '@vueuse/head';

// Acessando os stores
const subjectStore = useSubjectStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

// Rastreia as matérias selecionadas
const selectedSubjects = ref([]);

const isModal = ref(false);

const alertVisible = ref(false);
const alertTitle = ref('');
const alertMessage = ref('');
const alertType = ref('');

//Navegação depois de fechar o AlerModal
const navigateAfterAlert = ref(false);

// Função para selecionar/desmarcar uma matéria
const toggleSubject = (subject) => {
  if (selectedSubjects.value.some(s => s.id === subject.id)) {
    selectedSubjects.value = selectedSubjects.value.filter((s) => s.id !== subject.id);
  } else {
    selectedSubjects.value.push(subject);
  }
};

// Função para salvar as matérias selecionadas e navegar para a próxima página
const saveSubjectsAndNavigate = async () => {
  const selectedSubjectIds = selectedSubjects.value.map((subject) => subject.id);
  const result = await userStore.saveUserSubjects(selectedSubjectIds);

  // Define os valores do alerta
  alertTitle.value = result.success ? 'Sucesso!' : 'Erro!';
  alertMessage.value = result.message;
  alertType.value = result.success ? 'success' : 'error';
  alertVisible.value = true;

  if(result.success){
      navigateAfterAlert.value = true;
  }

  // const nextRoute = route.path.startsWith('/area-do-aluno')
  //   ? { name: 'materias' } // Rota dentro da Dashboard
  //   : { name: 'Estudar' }; // Rota fora da Dashboard
  // alert("Matérias salvas com sucesso!");
  // router.push(nextRoute);
};

// Configura as matérias selecionadas inicialmente
const setInitialSelectedSubjects = () => {
  selectedSubjects.value = subjectStore.subjects.filter((subject) =>
    userStore.userSubjects.includes(subject.id)
  );
};

// Termo de pesquisa
const searchTerm = ref('');

// Computed para filtrar as matérias com base no termo de pesquisa
const filteredSubjects = computed(() => {
  if (!searchTerm.value) return subjectStore.subjects;
  return subjectStore.subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Buscar matérias e configurar seleção inicial ao montar o componente
onMounted(async () => {
  await subjectStore.fetchSubjects();
  await userStore.fetchUserSubjects();
  
  subjectStore.subjects.sort((a, b) => a.name.localeCompare(b.name));
  
  setInitialSelectedSubjects();
});

// Salvar nova matéria
const saveSubject = async (subjectName) => {
  const result = await userStore.createUserSubject(subjectName);

  // Define os valores do alerta
  alertTitle.value = result.success ? 'Sucesso!' : 'Erro!';
  alertMessage.value = result.message;
  alertType.value = result.success ? 'success' : 'error';
  alertVisible.value = true;

  if (result.success) {
    await subjectStore.fetchSubjects(); // Atualiza a lista
    setInitialSelectedSubjects(); // Atualiza as seleções
    isModal.value = false; // Fecha o modal
  }
};

const handleAlertClose = () => {
  alertVisible.value = false;
  // Se o alerta foi de sucesso e a flag estiver ativa, navegue para a próxima página
  if (navigateAfterAlert.value) {
    navigateAfterAlert.value = false; // Limpa a flag para evitar navegações futuras indevidas
    const nextRoute = route.path.startsWith('/area-do-aluno')
      ? { name: 'materias' } // Rota dentro da Dashboard
      : { name: 'Estudar' }; // Rota fora da Dashboard
    router.push(nextRoute);
  }
};

useHead({
  title: "Estuday | Escolha Suas Matérias - Prepare-se para Concursos Públicos",
  meta: [
    { name: "description", content: "Selecione as matérias desejadas e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { property: "og:title", content: "Estuday | Escolha Sua Matérias - Prepare-se para Concursos Públicos" },
    { property: "og:description", content: "Selecione as matérias desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { property: "og:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { property: "og:url", content: "https://estuday.com.br/carreiras" },
    { name: "twitter:title", content: "Estuday | Escolha Suas Matérias - Prepare-se para Concursos Públicos" },
    { name: "twitter:description", content: "Selecione as matérias desejada e prepare-se de forma eficiente para concursos públicos com o Estuday. Oferecemos ferramentas personalizadas para otimizar seus estudos e alcançar seus objetivos." },
    { name: "twitter:image", content: "https://estuday.com.br/img/metaImg.webp" },
    { name: "keywords", content: "concursos públicos, escolha de matérias, preparação para concursos, planejamento de estudos, estudos, edital, editais, Estuday" }
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
              <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Escolha suas <span class="text-primary">matérias</span>
              </h1>
              <p class="mt-1 text-sm text-gray-600 sm:text-base">
                Carreira: {{ userStore.careerName }}
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
            placeholder="Pesquise a matéria..." 
            v-model="searchTerm" 
            class="max-w-md"
          />
        </div>

        <!-- Subjects Grid -->
        <div class="mb-8">
          <div class="grid grid-cols-1 gap-4 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <OptionCard
              v-for="subject in filteredSubjects"
              :key="subject.id"
              :icon="'basil:book-outline'"
              :careerName="subject.name"
              @click="toggleSubject(subject)"
              :variant="selectedSubjects.some(s => s.id === subject.id) ? 'selected' : 'primary'"
              class="transition-all duration-200 hover:scale-105"
            />
          </div>
          
          <!-- Empty State -->
          <div v-if="!filteredSubjects.length" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
              <i class="fa-solid fa-search text-6xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Matéria não encontrada</h3>
            <p class="text-gray-500">
              Tente ajustar os termos de pesquisa ou criar uma nova matéria.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button 
            v-if="route.path !== '/area-do-aluno/materias'" 
            variant="secondary" 
            :to="{ name: 'Carreiras' }"
            class="w-full sm:w-auto"
          >
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Voltar
          </Button>
          
          <!--
          <Button 
            variant="base" 
            @click="isModal = true"
            class="w-full sm:w-auto"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            Criar Matéria
          </Button>
          -->
          
          <Button 
            :variant="selectedSubjects.length ? 'base' : 'baseDisable'" 
            :disabled="selectedSubjects.length === 0" 
            :title="selectedSubjects.length === 0 ? 'Você precisa selecionar ao menos uma matéria antes' : ''"
            class="w-full sm:w-auto" 
            @click="saveSubjectsAndNavigate"
          >
            <i class="fa-solid fa-check mr-2"></i>
            Salvar e Avançar
          </Button>
        </div>
      </div>

      <!-- Modals -->
      <Modal 
        title="Nova Matéria" 
        v-if="isModal" 
        :maxlength="20" 
        @close="isModal = false" 
        @save="saveSubject" 
      />
      
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
