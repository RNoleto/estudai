<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

const userStore = useUserStore();

onMounted(async() => {
  await userStore.checkUserCareer();
  await userStore.fetchUserSubjects();
})

</script>

<template>
  <div>
    <h1>Página de teste</h1>
    <strong>Dados no Pinia</strong>
    <p>State UserId: {{ userStore.userId }}</p>
    <p>State CareerId: {{ userStore.careerId ? userStore.careerId : "Id Carreira não definida" }}</p>
    <p>State CareerName: {{ userStore.careerName ? userStore.careerName : "Nome de Carreira não definida"  }}</p>
    <p>State Subjects Id's: {{ userStore.userSubjects.length ? userStore.userSubjects : "Matérias não definidas" }}</p>
    
  </div>
</template>