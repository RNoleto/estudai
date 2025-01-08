<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/useUserStore';

const userStore = useUserStore();

// Variáveis para armazenar os valores do localStorage
const localStorageUserId = ref(null);
const localStorageCareerId = ref(null);
const localStorageCareerName = ref(null);

onMounted(async () => {
  await userStore.fetchUserId();
  await userStore.checkUserCareer();

  // Recupera os valores do localStorage
  localStorageUserId.value = localStorage.getItem('userId');
  localStorageCareerId.value = localStorage.getItem('careerId');
  localStorageCareerName.value = localStorage.getItem('careerName');
});

</script>

<template>
  <div>
    <h1>Página de teste</h1>
    <strong>Dados no Pinia</strong>
    <p>State UserId: {{ userStore.userId }}</p>
    <p>State CareerId: {{ userStore.careerId }}</p>
    <p>State CareerName: {{ userStore.careerName }}</p>
    
    <strong>Mesmos Dados no LocalStorage</strong>
    <p>UserId: {{ localStorageUserId }}</p>
    <p>CareerId: {{ localStorageCareerId }}</p>
    <p>CareerName: {{ localStorageCareerName }}</p>
    
  </div>
</template>