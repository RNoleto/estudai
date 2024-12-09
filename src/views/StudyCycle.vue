<script setup>
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import OptionCard from '../components/ui/OptionCard.vue';
import Input from '../components/ui/Input.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
import { useUserStore } from '../stores/useUserStore';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useCycleStore } from '../stores/useCycleStore';

import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const { formattedDate } = useCurrentDate();
const userStore = useUserStore();
const subjectStore = useSubjectStore();
const cycleStore = useCycleStore();

const router = useRouter();
const route = useRoute();

// Estado local
const searchTerm = ref('');
const cycleName = ref('');
const selectedSubjects = ref([]);
const editingCycle = ref(null); // Ciclo sendo editado

onMounted(async () => {
  await userStore.fetchUserSubjects();
  await subjectStore.fetchSubjects();
});

// Computed para filtrar matérias
const filteredSubjects = computed(() => {
  return subjectStore.subjects
    .filter((subject) => userStore.userSubjects.includes(subject.id))
    .filter((subject) =>
      subject.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

// Computed para habilitar o botão "Salvar ciclo"
const canSaveCycle = computed(() => {
  return cycleName.value && selectedSubjects.value.length > 0;
});

// Adicionar/remover matéria ao ciclo
const toggleSubject = (subject) => {
  if (selectedSubjects.value.includes(subject)) {
    selectedSubjects.value = selectedSubjects.value.filter((s) => s !== subject);
  } else {
    selectedSubjects.value.push(subject);
  }
};

// Salvar o ciclo (criar ou editar)
const saveCycle = () => {
  if (!canSaveCycle.value) return;

  if (editingCycle.value) {
    // Atualizar ciclo existente
    cycleStore.updateCycle(editingCycle.value, cycleName.value, selectedSubjects.value);
    editingCycle.value = null;
  } else {
    // Criar novo ciclo
    try {
      cycleStore.addCycle(cycleName.value, selectedSubjects.value);
    } catch (error) {
      alert(error.message);
    }
  }

  // Limpar os estados locais
  cycleName.value = '';
  selectedSubjects.value = [];
};

// Editar um ciclo
const editCycle = (cycle) => {
  editingCycle.value = cycle.name;
  cycleName.value = cycle.name;
  selectedSubjects.value = [...cycle.subjects];
};

// Excluir um ciclo
const deleteCycle = (name) => {
  cycleStore.deleteCycle(name);
};

// Função para navegar para a próxima página com base no contexto
const navigateToNextPage = () => {
  const nextRoute = route.path.startsWith('/area-do-aluno')
    ? { name: 'DashboardEstudar' } // Rota dentro da Dashboard
    : { name: 'Estudar' };         // Rota fora da Dashboard

  router.push(nextRoute);
};
</script>

<template>
    <div class="p-4 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-4xl">Monte seu ciclo de estudo.</h3>
        <p class="text-sm">{{ formattedDate }}</p>
      </div>
      <p>Carreira: {{ userStore.careerName }}</p>

      <div class="flex gap-2 justify-between">
        <Input v-model="cycleName" :showLabel="false" placeholder="Nome do ciclo de estudo" class="w-full" />
        <Search v-model="searchTerm" class="w-full" />
      </div>

      <!-- Lista filtrada -->
      <div class="flex flex-wrap gap-2">
        <OptionCard
          v-for="subject in filteredSubjects"
          :key="subject.id"
          :icon="'basil:book-outline'"
          :careerName="subject.name"
          :variant="selectedSubjects.includes(subject)? 'selected' : 'primary'"
          @click="toggleSubject(subject)"
        />
      </div>

      <!-- Ciclos Salvos -->
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="cycle in cycleStore.cycles"
          :key="cycle.name"
          class="flex flex-col justify-between border p-4 rounded-md shadow-md col-span-1"
        >
        <div class="flex flex-col">
            <div class="flex align-center justify-between">
                <h4 class="text-lg font-bold">{{ cycle.name }}</h4>
                <p>{{ cycle.subjects.length }} matérias</p>
            </div>
            <ul class="ml-4 list-none">
              <li v-for="subject in cycle.subjects" :key="subject.id">{{ subject.name }}</li>
            </ul>
        </div>
        <div class="flex align-baseline gap-2">
          <Button @click="editCycle(cycle)">Editar</Button>
          <Button @click="deleteCycle(cycle.name)" class="bg-red-500 hover:bg-red-600">Excluir</Button>
        </div>
        </div>
      </div>

      <!-- Botões de navegação -->
      <div class="flex gap-2">
        <Button class="float-right" :to="{ name: 'Materias' }">Voltar</Button>
        <Button :disabled="!canSaveCycle" @click="saveCycle">Salvar Ciclo</Button>
        <Button class="float-right" @click="navigateToNextPage">Avançar</Button>
      </div>
    </div>
</template>
