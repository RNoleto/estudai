<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { computed, onMounted, ref } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useUserStore } from '../stores/useUserStore';
import { useRouter, useRoute } from 'vue-router';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';

// Acessando os stores
const subjectStore = useSubjectStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

// Rastreia as matérias selecionadas
const selectedSubjects = ref([]);

// Função para selecionar/desmarcar uma matéria
const toggleSubject = (subject) => {
  if (selectedSubjects.value.includes(subject)) {
    selectedSubjects.value = selectedSubjects.value.filter((s) => s !== subject);
  } else {
    selectedSubjects.value.push(subject);
  }
};

// Função para salvar as matérias selecionadas e navegar para a próxima página
const saveSubjectsAndNavigate = async () => {
  const selectedSubjectIds = selectedSubjects.value.map((subject) => subject.id);
  await userStore.saveUserSubjects(selectedSubjectIds);

  const nextRoute = route.path.startsWith('/area-do-aluno')
    ? { name: 'Estudar' } // Rota dentro da Dashboard
    : { name: 'Estudar' };         // Rota fora da Dashboard

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
  await subjectStore.fetchSubjects(); // Carrega todas as matérias disponíveis
  await userStore.fetchUserSubjects(); // Carrega as matérias já associadas ao usuário

  subjectStore.subjects.sort((a, b) => a.name.localeCompare(b.name));
  setInitialSelectedSubjects(); // Define as matérias inicialmente selecionadas
});
</script>

<template>
  <DefaultLayout backgroundOpacity="opacity-20">
    <div class="p-4 flex flex-col gap-4">
      <h3 class="text-2xl sm:text-4xl font-bold text-[#21BFCA] sm:text-4xl">Escolha suas matérias</h3>
      <p class="text-md text-[#21BFCA]">Carreira: {{ userStore.careerName }}</p>
      <Search placeholder="Pesquise a matéria..." v-model="searchTerm" />
      <div class="grid gap-2 sm:flex flex-wrap">
        <OptionCard
          v-for="subject in filteredSubjects"
          :key="subject.id"
          :icon="'basil:book-outline'"
          :careerName="subject.name"
          @click="toggleSubject(subject)"
          :variant="selectedSubjects.includes(subject) ? 'selected' : 'primary'"
        />
        <div v-if="!filteredSubjects.length" class="text-center p-4">
          <p class="text-lg text-zinc-800">Matéria não encontrada</p>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 sm:mt-10">
        <Button variant="base" :to="{ name: 'Carreiras' }">Voltar</Button>
  
        <Button :variant="selectedSubjects.length ? 'base' : 'baseDisable'" :disabled="selectedSubjects.length === 0"
            class="disabled:opacity-100 w-full sm:w-auto" @click="saveSubjectsAndNavigate">
            Salvar e avançar
          </Button>
      </div>
    </div>
  </DefaultLayout>
</template>
