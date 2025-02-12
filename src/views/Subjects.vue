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
  await userStore.saveUserSubjects(selectedSubjectIds);

  const nextRoute = route.path.startsWith('/area-do-aluno')
    ? { name: 'materias' } // Rota dentro da Dashboard
    : { name: 'Estudar' }; // Rota fora da Dashboard
  alert("Matérias salvas com sucesso!");
  router.push(nextRoute);
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
  } else {
    isModal.value = false;
  }
};

</script>

<template>
  <DefaultLayout backgroundOpacity="opacity-20">
    <div class="relative p-4 flex flex-col mt-12 gap-4 sm:mt-0">
      <h3 class="text-2xl sm:text-4xl font-bold text-gray-700">Escolha suas <span class="text-[#21BFCA]">matérias</span>.</h3>
      <p class="text-md text-gray-700">Carreira: {{ userStore.careerName }}</p>
      <Search placeholder="Pesquise a matéria..." v-model="searchTerm" />
      <div class="grid grid-cols-1 gap-2 w-full sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-5">
        <OptionCard
          v-for="subject in filteredSubjects"
          :key="subject.id"
          :icon="'basil:book-outline'"
          :careerName="subject.name"
          @click="toggleSubject(subject)"
          :variant="selectedSubjects.some(s => s.id === subject.id) ? 'selected' : 'primary'"
        />
      </div>
      <div v-if="!filteredSubjects.length" class="m-auto text-center p-4">
        <p class="text-lg sm:text-2xl text-zinc-700">Matéria não encontrada</p>
      </div>
      <div class="flex justify-end gap-2 mt-4 sm:mt-10">
        <Button v-if="route.path !== '/area-do-aluno/materias'" variant="base" :to="{ name: 'Carreiras' }">Voltar</Button>
        <Button variant="base" @click="isModal = true">Criar Matéria</Button>
        <Button :variant="selectedSubjects.length ? 'base' : 'baseDisable'" :disabled="selectedSubjects.length === 0"
            class="disabled:opacity-100 w-full sm:w-auto" @click="saveSubjectsAndNavigate">
            Salvar e avançar
        </Button>
      </div>
        <Modal title="Nova Matéria" v-if="isModal" @close="isModal = false" @save="saveSubject" />
        <AlertModal 
  :visible="alertVisible" 
  :title="alertTitle" 
  :message="alertMessage" 
  :type="alertType" 
  @close="alertVisible = false" 
/>
    </div>
  </DefaultLayout>
</template>
