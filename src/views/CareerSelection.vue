<script setup>
import { onMounted, ref } from 'vue';
import { useCareerStore } from '../stores/useCareerStore';
import { useUserStore } from '../stores/useUserStore';
import { useRouter, useRoute } from 'vue-router';
import OptionCard from '../components/ui/OptionCard.vue';
import Button from '../components/ui/Button.vue';

const router = useRouter();
const route = useRoute();

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
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <h3 class="text-xl sm:text-4xl">Selecione a sua carreira</h3>
    <div class="grid gap-2 sm:flex flex-wrap">
      <OptionCard
        v-for="career in careersStore.careers"
        :key="career.id"
        @click="selectCareer(career)"
        :icon="career.icon"
        :careerName="career.name"
        :variant="selectedCareer && career.id === selectedCareer.id ? 'selected' : 'primary'"
      />
    </div>
    <div>
      <Button
        :disabled="!selectedCareer"
        class="disabled:opacity-50"
        @click="saveCareerAndNavigate"
      >
        Avançar
      </Button>
    </div>
  </div>
</template>
