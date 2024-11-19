<script setup>
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
import { useStudyStore } from '../stores/useStudyStore';
import { computed, ref, onMounted } from 'vue';

const { formattedDate } = useCurrentDate();
const studyStore = useStudyStore();

onMounted(() => {
    studyStore.fetchSubjects();
});

// Flag para controlar a exibição da lista suspensa
const showDropdown = ref(false);

// Propriedade computed para filtrar as matérias com base na entrada do usuário
const filteredSubjects = computed(() => {
    return studyStore.subject
        ? studyStore.subjectList.filter(subject =>
            subject.name.toLowerCase().includes(studyStore.subject.toLowerCase())
        )
        : [];
});

// Atualizar a flag ao digitar no campo de pesquisa
const handleInputChange = () => {
    showDropdown.value = filteredSubjects.value.length > 0;
};

// Função para selecionar uma matéria da lista de sugestões
const selectSubject = (subjectName) => {
    studyStore.setSubject(subjectName);
    showDropdown.value = false; // Esconde a lista ao selecionar
};

//Atualizar o tópico diretamente na store
const updateTopic = (topic) => {
    studyStore.setTopic(topic);
};
</script>

<template>
    <div class="w-[900px] relative">
        <div class="flex items-center gap-2 justify-between">
            <h2 class="text-xl uppercase font-bold">Iniciar estudos</h2>
            <div class="text-center text-sm text-zinc-700 bg-zinc-100 rounded-md p-2">
                <p>Dia</p>
                <p>{{ formattedDate }}</p>
            </div>
        </div>

        <!-- Campo de pesquisa com lista suspensa de matérias -->
        <div class="grid grid-cols-3 gap-2 content-center mt-2 relative">
            <Search placeholder="Pesquise pela matéria" v-model="studyStore.subject" class="col-span-1"
                @input="handleInputChange" />
            <ul v-if="showDropdown"
                class="absolute bg-white border mt-10 rounded shadow-lg max-h-32 overflow-y-auto z-10 w-[294.66px]">
                <li v-for="subject in filteredSubjects" :key="subject.id" @click="selectSubject(subject.name)"
                    class="p-2 cursor-pointer hover:bg-gray-200">
                    {{ subject.name }}
                </li>
            </ul>


            <!-- Campo de input para tópico -->
            <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="col-span-2"
                v-model="studyStore.topic" @input="updateTopic(studyStore.topic)" />
        </div>

        <!-- Resumo dos estudos -->
        <div class="mt-2">
            <div class="grid grid-cols-3 gap-2">
                <Timer class="col-span-1" />
                <div class="flex flex-col gap-1 text-xs text-zinc-700 col-span-2"
                    v-if="studyStore.studySummary.totalStudyTime.length > 0">
                    <div class="grid grid-cols-5 border-b rounded-md p-4 bg-white">
                        <div class="flex flex-col col-span-3 justify-center">
                            <p class="text-sm">Matéria: <span class="font-bold">{{ studyStore.subject }}</span></p>
                            <p class="text-sm">Tópico: <span class="font-bold">{{ studyStore.topic }}</span></p>
                        </div>
                        <div class="col-span-2">
                            <p>Tempo de estudo: {{ studyStore.studySummary.totalStudyTime }}</p>
                            <p v-if="studyStore.studySummary.totalPauses > 0">Nº de pauses: {{
                                studyStore.studySummary.totalPauses }}</p>
                            <div v-if="studyStore.studySummary.questionsResolved === 'yes'" class="flex gap-4">
                                <p>Questões respondidas: {{ studyStore.studySummary.totalQuestions }}</p>
                                <p>Acertos: {{ studyStore.studySummary.correctAnswers }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
