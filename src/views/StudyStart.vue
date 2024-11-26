<script setup>
import { onMounted, ref, computed } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import Navbar from '../components/Navbar.vue';
import ComboBox from '../components/ui/ComboBox.vue';

import { useCurrentDate } from "../composables/useCurrentDate";
import { useUserStore } from "../stores/useUserStore";
import { useStudyStore } from "../stores/useStudyStore";
import { useSubjectStore } from "../stores/useSubjectStore";

const { formattedDate } = useCurrentDate();
const studyStore = useStudyStore();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

const selectedSubject = ref(null);

// Carregar as matérias da API
onMounted(async () => {
  await userStore.fetchUserSubjects();
  await subjectStore.fetchSubjects();
});

// Combine userSubjects com nomes de matérias
const userSubjects = computed(() => {
  return userStore.userSubjects
    .map((subjectId) =>
      subjectStore.subjects.find((subject) => subject.id === subjectId)
    )
    .filter(Boolean); // Filtra valores nulos ou indefinidos
});

// Define a matéria selecionada na store
const handleSubjectSelection = (subject) => {
  selectedSubject.value = subject;
  studyStore.setSubject(subject.name); // Atualiza a store com o nome
};

const isSubjectSelected = computed(() => !!selectedSubject.value);

const resetFields = () => {
  selectedSubject.value = null;
  studyStore.setSubject('');
  studyStore.setTopic(''); // Adicione uma ação ou getter para o tópico, se necessário
};
</script>

<template>
  <div class="h-screen">
    <Navbar />
    <div class="p-4 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-4xl">Iniciar estudos</h3>
        <p>{{ formattedDate }}</p>
      </div>
      <!-- Campo de pesquisa com lista suspensa de matérias -->
      <div class="grid grid-cols-3 gap-2 content-center relative">
        <div class="w-full content-center relative">
          <ComboBox :options="userSubjects" :placeholder="'Selecione uma matéria...'" v-model="selectedSubject" @select="handleSubjectSelection" />
        </div>

        <Input
          placeholder="Qual tópico você vai estudar?"
          :showLabel="false"
          class="col-span-2"
          v-model="studyStore.topic"
        />
      </div>

      <!-- Resumo dos estudos -->
      <div>
        <div class="grid grid-cols-3 gap-2">
          <Timer :isDisabled="!isSubjectSelected" class="col-span-1" />
          <div
            class="flex flex-col gap-1 text-xs text-zinc-700 col-span-2"
            v-if="studyStore.studySummary.totalStudyTime.length > 0">
            <div class="grid grid-cols-5 border-b rounded-md p-4 bg-white">
              <div class="flex flex-col col-span-3 justify-center">
                <p class="text-sm">Matéria: <span class="font-bold">{{ studyStore.subject }}</span></p>
                <p class="text-sm">Tópico: <span class="font-bold">{{ studyStore.topic }}</span></p>
              </div>
              <div class="flex justify-between col-span-2">
                <div>
                  <p>Tempo de estudo: {{ studyStore.studySummary.totalStudyTime }}</p>
                  <p v-if="studyStore.studySummary.totalPauses > 0">
                    Nº de pauses: {{ studyStore.studySummary.totalPauses }}
                  </p>
                  <div
                    v-if="studyStore.studySummary.questionsResolved === 'yes'"
                    class="flex gap-4">
                    <p>Questões respondidas: {{ studyStore.studySummary.totalQuestions }}</p>
                    <p>Acertos: {{ studyStore.studySummary.correctAnswers }}</p>
                  </div>
                </div>
                <div v-if="studyStore.studySummary.questionsResolved === 'yes'" class="text-center">
                  <p>Porcentagem de Acertos:</p>
                  <strong class="text-xl">{{ studyStore.correctAnswerPercentage }}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
