<script setup>
// import ChatOpenAi from '../components/ChatOpenAi.vue';
import ChatView from '../components/ChatView.vue';
import Relatorio from '../components/Relatorio.vue';
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Teste integração ChatOpenAi</h1>
    <!-- <ChatOpenAi /> -->
     <ChatView />

     <div>
      <p>Teste Relatorio</p>
      <Relatorio />
     </div>
  </div>
</template>