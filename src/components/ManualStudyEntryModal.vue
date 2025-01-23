<script setup>
import { ref, computed } from 'vue';
import Button from './ui/Button.vue';
import { useStudyStore } from '../stores/useStudyStore';
import { useTimeFormatter } from '../composables/useTimeFormatter';

const { formatStudyTime } = useTimeFormatter();

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
const pause = ref(null);
const totalPauses = ref('null');

const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value);

const resetForm = () => {
    studyStore.topic = '';
    studyTime.value = '';
    totalQuestions.value = 0;
    correctAnswers.value = 0;
    questionsResolved.value = null;
    pause.value = null;
    totalPauses.value = null;
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
            totalPauses: pause.value === 'yes' ? parseInt(totalPauses.value, 10) || 0 : 0,
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
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
        <div class="bg-white p-4 rounded-lg shadow-lg relative">
            <h2 class="text-lg sm:text-2xl font-bold sm:mb-4">Inserir Informações de Estudo</h2>
            <div class="text-sm mb-4 sm:text-base">
                <p><strong>Matéria:</strong> {{ selectedSubject.name }}</p>
                <p><strong>Tópico:</strong> {{ studyStore.topic }}</p>
            </div>
            <div class="text-sm mb-4 sm:text-base">
                <label for="study-time" class="block font-medium">Tempo de Estudos (hh:mm:ss)</label>
                <input id="study-time" v-model="studyTime" placeholder="hh:mm:ss"
                    class="mt-1 block w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="text-sm mt-4 sm:text-base">
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
            <div v-if="questionsResolved === 'yes'" class="flex gap-2 mt-2">
                <label class="flex flex-col w-[150px]">
                    <span class="text-sm font-medium sm:text-base">Questões Resolvidas</span>
                    <input type="number" v-model="totalQuestions" min="0" placeholder="Ex.: 20"
                        class="mt-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
                <label class="flex flex-col w-[150px]">
                    <span class="text-sm font-medium sm:text-base">Questões Certas</span>
                    <input type="number" v-model="correctAnswers" min="0" placeholder="Ex.: 15"
                        class="mt-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
            </div>
            <div class="text-sm mt-4 sm:text-base">
                <p class="font-medium">Você fez pausas durante o estudo?</p>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" v-model="pause" value="yes" class="mr-2">
                        Sim
                    </label>
                    <label class="flex items-center">
                        <input type="radio" v-model="pause" value="no" class="mr-2">
                        Não
                    </label>
                </div>
                <div v-if="pause === 'yes'">
                    <label class="block mt-2">
                        <span class="font-medium">Número de Pausas</span>
                        <input type="number" v-model="totalPauses" min="1" placeholder="Ex.: 3"
                            class="mt-1 block w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                </div>
                <div class="flex justify-end gap-2 mt-6">
                    <Button variant="secondary" @click="handleCancel">Cancelar</Button>
                    <Button variant="primary" @click="handleSave">Salvar</Button>
                </div>
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
