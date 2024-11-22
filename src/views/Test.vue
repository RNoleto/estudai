<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSubjectStore } from '../stores/useSubjectStore'; // Importe o store de matérias
import { ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot } from 'radix-vue';

// Instanciar o store de matérias
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);
const searchTerm = ref('');

// Filtra as matérias com base no termo de busca
const filteredSubjects = computed(() => 
  searchTerm.value === '' 
    ? subjectStore.subjects 
    : subjectStore.subjects.filter((subject) => 
        subject.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
);

// Chama o fetchSubjects para carregar as matérias quando o componente for montado
onMounted(async () => {
  await subjectStore.fetchSubjects();  // Carrega as matérias da API
});
</script>

<template>
  <ComboboxRoot v-model="selectedSubject" v-model:searchTerm="searchTerm">
    <ComboboxInput placeholder="Pesquise por uma matéria..." />
    <ComboboxPortal>
      <ComboboxContent>
        <ComboboxItem
          v-for="subject in filteredSubjects"
          :key="subject.id"
          :value="subject"
        >
          {{ subject.name }}
        </ComboboxItem>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
