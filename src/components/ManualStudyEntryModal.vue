<script setup>
import { ref, computed } from 'vue';
import Button from './ui/Button.vue';
import { useStudyStore } from '../stores/useStudyStore';

const props = defineProps({
    isVisible: Boolean,
    selectedSubject: Object,
    onClose: Function,
    onSave: Function,
});

const studyStore = useStudyStore();
const studyTime = ref('');
const totalQuestions = ref(0);
const correctAnswers = ref(0);

const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value);

const handleCancel = () => {
    props.onClose();
};

const handleSave = () => {
    const [hours, minutes, seconds] = studyTime.value.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes + (seconds / 60);

    const newRecord = {
        subject_id: props.selectedSubject.id,
        topic: studyStore.topic,
        study_time: totalMinutes,
        total_questions: totalQuestions.value,
        correct_answers: correctAnswers.value,
        incorrect_answers: incorrectAnswers.value,
    };

    console.log("Novo registro de estudo:", newRecord);

    props.onSave(newRecord);
    props.onClose();
};
</script>

<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl mb-4">Inserir Informações de Estudo</h2>
            <div class="mb-4">
                <p><strong>Matéria:</strong> {{ selectedSubject.name }}</p>
                <p><strong>Tópico:</strong> {{ studyStore.topic }}</p>
            </div>
            <div class="mb-4">
                <span>Tempo de Estudos (hh:mm:ss)</span>
                <Input v-model="studyTime" class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
            </div>
            <div class="mb-4">
                <span>Total de Questões Resolvidas</span>
                <input type="number" v-model="totalQuestions" class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
            </div>
            <div class="mb-4">
                <span>Total de Questões Corretas</span>
                <input type="number" v-model="correctAnswers" class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
            </div>
            <div class="mb-4">
                <span>Total de Questões Erradas</span>
                <input type="number" :value="incorrectAnswers" disabled
                    class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
            </div>
            <div class="flex justify-end gap-2">
                <Button variant="secondary" @click="handleCancel">Cancelar</Button>
                <Button variant="primary" @click="handleSave">Salvar</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Remove as setas dos campos de entrada do tipo number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>