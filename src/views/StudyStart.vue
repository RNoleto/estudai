<script setup>
import { ref } from 'vue';
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';
import Button from '../components/ui/Button.vue';

import StudySumaryModal from '../layouts/StudySumaryModal.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
const { formattedDate } = useCurrentDate();

//StudySummaryModal
const isModalOpen = ref(false);
const totalStudyTime = ref('00:00'); // Você pode definir valores padrões aqui
const totalPauses = ref(0);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
    <div class="w-[900px]">
        <div class="flex items-center gap-2 justify-between">
            <h2 class="text-xl uppercase font-bold">Iniciar estudos</h2>
            <div class="text-center text-sm bg-zinc-100 rounded-md p-2">
                <p>Dia</p>
                <p>{{ formattedDate }}</p>
            </div>
        </div>
        <div class="flex gap-2 content-center mt-2">
            <Search placeholder="Pesquise pela matéria" class="w-1/3" />
            <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="w-2/3" />
        </div>
        <div class="mt-2 bg-red-200">
            <p>Tela de inicio de estudo</p>
            <Timer />
            <StudySumaryModal v-if="isModalOpen" :isOpen="isModalOpen" :totalStudyTime="totalStudyTime"
                :totalPauses="totalPauses" :formattedDate="formattedDate" @onClose="closeModal" />
        </div>
        <Button @click="openModal">Ver Resumo do Estudo</Button>
    </div>
</template>