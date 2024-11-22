<script setup>
import { onMounted, ref } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import { useUserStore } from '../stores/useUserStore';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';
import Navbar from '../components/Navbar.vue';

// Instanciar os stores
const userStore = useUserStore();
const careersStore = useCareerStore();

const selectedCareer = ref(null);

// Função para selecionar uma carreira
const selectCareer = (career) => {
  // Se a carreira já estiver selecionada, desmarca, senão seleciona
  selectedCareer.value = selectedCareer.value === career ? null : career;
};

// Função para salvar a carreira no banco de dados
const saveCareer = async () => {
  if (selectedCareer.value) {
    await userStore.saveUserCareer(selectedCareer.value.id, selectedCareer.value.name); // Passando também o nome
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
      // Aqui estamos assegurando que o nome da carreira seja mantido
      userStore.careerName = career.name;
    }
  }
};

onMounted(() => {
  userStore.fetchUserId(); // Obtém o ID do usuário autenticado
});

// Buscar as carreiras assim que o componente for montado
onMounted(async () => {
  await careersStore.fetchCareers();
  await userStore.checkUserCareer();
  setInitialSelectedCareer();
});
</script>

<template>
  <Navbar />
  <div class="p-4 flex flex-col gap-4 h-screen">
    <h3 class="text-4xl">Selecione a sua carreira</h3>
    <div class="flex flex-wrap gap-2">
      <OptionCard 
        v-for="career in careersStore.careers" 
        :key="career.id" 
        @click="selectCareer(career)" 
        :icon="career.icon" 
        :careerName="career.name"
        :variant="selectedCareer && career.id === selectedCareer.id ? 'selected' : 'primary'" 
      />
    </div>
    <Button 
      :to="{ name: 'Materias' }"
      :disabled="!selectedCareer"
      class="disabled:opacity-50"
      @click="saveCareer"
    >
      Avançar
    </Button>
  </div>
</template>
