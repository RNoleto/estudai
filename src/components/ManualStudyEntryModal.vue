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
const questionsResolved = ref(null);

const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value);

const resetForm = () => {
    studyTime.value = '';
    totalQuestions.value = 0;
    correctAnswers.value = 0;
    questionsResolved.value = null;
    studyStore.topic = '';
};

const validateInputs = () => {
    if (!/^\d{1,2}:\d{2}:\d{2}$/.test(studyTime.value)) {
        alert('Por favor, insira o tempo de estudo no formato hh:mm:ss.');
        return false;
    }
    if (totalQuestions.value < 0 || correctAnswers.value < 0) {
        alert('Os valores de questões devem ser positivos.');
        return false;
    }
    if (correctAnswers.value > totalQuestions.value) {
        alert('Questões corretas não podem exceder o total de questões.');
        return false;
    }
    return true;
};

const handleSave = () => {
    if (!validateInputs()) return;

    try {
        const [hours, minutes, seconds] = studyTime.value.split(':').map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        const newRecord = {
            subject_id: props.selectedSubject.id,
            topic: studyStore.topic,
            study_time: totalSeconds,
            totalQuestions: totalQuestions.value,
            correctAnswers: correctAnswers.value,
            incorrectAnswers: incorrectAnswers.value,
        };

        props.onSave(newRecord);
        alert('Dados salvos com sucesso!');
        resetForm();
        props.onClose();
    } catch (error) {
        alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
        console.error('Error saving study record:', error);
    }
};

const handleCancel = () => {
    resetForm();
    props.onClose();
};
</script>

<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 class="text-2xl font-bold mb-4">Inserir Informações de Estudo</h2>
            <div class="mb-4">
                <p><strong>Matéria:</strong> {{ selectedSubject.name }}</p>
                <p><strong>Tópico:</strong> {{ studyStore.topic }}</p>
            </div>
            <div class="mb-4">
                <label for="study-time" class="block font-medium">Tempo de Estudos (hh:mm:ss)</label>
                <input 
                    id="study-time"
                    v-model="studyTime"
                    placeholder="hh:mm:ss"
                    class="mt-1 block w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
            <div class="mt-4">
                <p class="font-medium">Você resolveu questões?</p>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" v-model="questionsResolved" value="yes" class="mr-2">
                        Sim
                    </label>
                    <label class="flex items-center">
                        <input type="radio" v-model="questionsResolved" value="no" class="mr-2">
                        Não
                    </label>
                </div>
            </div>
            <div v-if="questionsResolved === 'yes'" class="flex flex-col gap-4 mt-4">
                <label class="block">
                    <span class="font-medium">Questões Resolvidas</span>
                    <input 
                        type="number"
                        v-model="totalQuestions"
                        min="0"
                        placeholder="Ex.: 20"
                        class="mt-1 block w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </label>
                <label class="block">
                    <span class="font-medium">Questões Certas</span>
                    <input 
                        type="number"
                        v-model="correctAnswers"
                        min="0"
                        placeholder="Ex.: 15"
                        class="mt-1 block w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </label>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <Button variant="secondary" @click="handleCancel">Cancelar</Button>
                <Button variant="primary" @click="handleSave">Salvar</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Remove spinner for number inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
