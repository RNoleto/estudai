<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore.js';
import jsPDF from 'jspdf';

const userStore = useUserStore();
const userStudyRecords = ref([]);

// Carregar os registros de estudo ao montar o componente
onMounted(async () => {
  await userStore.fetchUserStudyRecords();
  userStudyRecords.value = userStore.userStudyRecords;
});

const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Estudos', 10, 10);
  doc.setFontSize(12);

  let y = 20;
  userStudyRecords.value.forEach((record, index) => {
    doc.text(`Matéria: ${record.subjectName}`, 10, y);
    doc.text(`Tópico: ${record.topic}`, 10, y + 5);
    doc.text(`Tempo Estudado: ${record.study_time} segundos`, 10, y + 10);
    doc.text(`Questões Resolvidas: ${record.questions_resolved}`, 10, y + 15);
    doc.text(`Respostas Corretas: ${record.correct_answers}`, 10, y + 20);
    doc.text(`Total de Pausas: ${record.total_pauses}`, 10, y + 25);

    y += 35; // Avança para a próxima linha no PDF

    // Se a página estiver cheia, adiciona uma nova página
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save('relatorio_estudos.pdf');
};
</script>

<template>
  <div>
    <button @click="generatePDF">Baixar Relatório</button>
  </div>
</template>

