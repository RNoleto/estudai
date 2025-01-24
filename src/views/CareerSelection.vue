<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import { useUserStore } from '../stores/useUserStore';
import { useRouter, useRoute } from 'vue-router';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue'

const router = useRouter();
const route = useRoute();
const searchTerm = ref('');
const newCareerModal = ref(false);

const newCareerName = ref('');

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
  if (selectedCareer.value) {
    await userStore.saveUserCareer(selectedCareer.value.id, selectedCareer.value.name);
    const nextRoute = route.path.startsWith('/area-do-aluno') 
      ? { name: 'DashboardMaterias' } 
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
  searchTerm.value = '';
  newCareerModal.value = true;
};

const closeCareerModal = () => {
  newCareerModal.value = false;
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
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <h3 class="text-xl sm:text-4xl">Selecione a sua carreira</h3>
    <div class="grid gap-2 sm:flex flex-wrap">
      <Search placeholder="Pesquise a carreira..." v-model="searchTerm" />
      <OptionCard
        v-if="!newCareerModal"
        v-for="career in filteredCareers"
        :key="career.id"
        @click="selectCareer(career)"
        :icon="career.icon"
        :careerName="career.name"
        :variant="selectedCareer && career.id === selectedCareer.id ? 'selected' : 'primary'"
      />
      <div v-if="!filteredCareers.length && !newCareerModal" class="text-center p-4">
        <p class="text-lg text-zinc-800">Carreira não encontrada</p>
      </div>
      <!-- Modelo de card sem componetização -->
      <div v-if="newCareerModal" class="border rounded-md shadow-md flex flex-col gap-2 p-4  bg-gray-200">
        <p class="text-base text-zinc-800 text-center font-semibold">Criar nova carreira</p>
        <Input
          v-model="newCareerName"
          type="text"
          class="w-full rounded-md"
          placeholder="Nome da carreira"
          :showLabel="false"
        />
        <Button @click="saveCareer">Salvar carreira</Button>
      </div>
    </div>
    <div class="flex justify-between">
      <Button @click="createCareer">Adicionar nova carreira</Button>
      <Button
        :disabled="!selectedCareer"
        class="disabled:opacity-50"
        @onSave="saveCareerAndNavigate"
      >
        Avançar
      </Button>
    </div>
  </div>
</template>
