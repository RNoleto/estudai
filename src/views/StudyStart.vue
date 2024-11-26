<script setup>
import { onMounted, ref, computed } from 'vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import Navbar from '../components/Navbar.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
import { useUserStore } from '../stores/useUserStore';
import { useStudyStore } from '../stores/useStudyStore';
import { useSubjectStore } from '../stores/useSubjectStore';

import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'radix-vue';
import { Icon } from '@iconify/vue';

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
  return userStore.userSubjects.map((subjectId) => {
    return subjectStore.subjects.find((subject) => subject.id === subjectId);
  }).filter(Boolean); // Filtra valores nulos ou indefinidos
});

// Define a matéria selecionada na store
const handleSubjectSelection = (subject) => {
  selectedSubject.value = subject;
  studyStore.setSubject(subject.name); // Atualiza a store com o nome
};

// Atualizar o tópico diretamente na store
const updateTopic = (topic) => {
  userStore.setTopic(topic);
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
          <ComboboxRoot v-model="selectedSubject" class="relative">
            <ComboboxAnchor
              class="w-full inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-gray-700 shadow hover:bg-gray-100 outline-none">
              <ComboboxTrigger class="w-full flex justify-between">
              <ComboboxInput
                class="w-full !bg-transparent outline-none text-gray-700 h-full selection:bg-gray-300"
                :placeholder="selectedSubject ? selectedSubject.name : 'Selecione uma matéria...'" />
              
                <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-gray-700" />
              </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent class="absolute z-10 w-full mt-2 bg-white rounded shadow">
              <ComboboxViewport class="p-[5px]">
                <ComboboxGroup>
                  <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-gray-500">
                    Matérias
                  </ComboboxLabel>

                  <ComboboxItem
                    v-for="subject in userSubjects"
                    :key="subject.id"
                    class="text-[13px] leading-none text-gray-700 rounded flex items-center h-[25px] px-[25px] relative cursor-pointer hover:bg-gray-200"
                    :value="subject"
                    @click="handleSubjectSelection(subject)">
                    <ComboboxItemIndicator
                      class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                    {{ subject.name }}
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
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
          <Timer class="col-span-1" />
          <div
            class="flex flex-col gap-1 text-xs text-zinc-700 col-span-2"
            v-if="studyStore.studySummary.totalStudyTime.length > 0">
            <div class="grid grid-cols-5 border-b rounded-md p-4 bg-white">
              <div class="flex flex-col col-span-3 justify-center">
                <p class="text-sm">Matéria: <span class="font-bold">{{ studyStore.subject }}</span></p>
                <p class="text-sm">Tópico: <span class="font-bold">{{ studyStore.topic }}</span></p>
              </div>
              <div class="col-span-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
