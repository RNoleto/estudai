<script setup>
// import ChatOpenAi from '../components/ChatOpenAi.vue';
import ChatView from '../components/ChatView.vue';
import Relatorio from '../components/Relatorio.vue';

import { ref } from "vue";

const studyModal = ref(null);

const openReport = () => {
  studyModal.value.openModal();
};

import StudyReportModal from '../components/StudyReportModal.vue';
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Teste integração ChatOpenAi</h1>
    <!-- <ChatOpenAi /> -->
     <!-- <ChatView /> -->

     <!-- <div>
      <p>Teste Relatorio</p>
      <Relatorio />
     </div> -->

    <button @click="openReport" class="px-4 py-2 bg-green-500 text-white rounded">Ver Relatório</button>
    <StudyReportModal ref="studyModal" /> 
  </div>
</template>