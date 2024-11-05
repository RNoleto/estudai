<script setup>
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
import { useStudyStore } from '../stores/useStudyStore';

const { formattedDate } = useCurrentDate();
const studyStore = useStudyStore();
</script>

<template>
    <div class="w-[900px]">
        <div class="flex items-center gap-2 justify-between">
            <h2 class="text-xl uppercase font-bold">Iniciar estudos</h2>
            <div class="text-center text-sm text-zinc-700 bg-zinc-100 rounded-md p-2">
                <p>Dia</p>
                <p>{{ formattedDate }}</p>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-2 content-center mt-2">
            <Search placeholder="Pesquise pela matéria" class="col-span-1" />
            <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="col-span-2" />
        </div>
        <div class="mt-2">
            <div class="grid grid-cols-3 gap-2">
                <Timer class="col-span-1" />
                <div class="flex flex-col gap-1 text-xs text-zinc-700 col-span-2" v-if="studyStore.studySummary.totalStudyTime.length > 0">
                    <div class="grid grid-cols-5 border-b rounded-md p-4 bg-white">
                        <div class="col-span-3">
                           <p>Matéria: Direito Administrativo.</p> 
                           <p>Tópico: Princípios e Poderes da Administração.</p>
                        </div>
                        <div class="col-span-2">
                            <p>Tempo de estudo: {{ studyStore.studySummary.totalStudyTime }}</p>
                            <p v-if="studyStore.studySummary.totalPauses > 0">Nº de pauses: {{ studyStore.studySummary.totalPauses }}</p>
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