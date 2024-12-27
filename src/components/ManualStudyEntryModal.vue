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

const handleCancel = () => {
    props.onClose();
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

        // Corrigir o cálculo: agora convertendo tudo para segundos
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        const newRecord = {
            subject_id: props.selectedSubject.id,
            topic: studyStore.topic,
            study_time: totalSeconds, // Passando o tempo total em segundos
            totalQuestions: totalQuestions.value,
            correctAnswers: correctAnswers.value,
            incorrectAnswers: incorrectAnswers.value,
        };

        // Enviar os dados ao método onSave
        props.onSave(newRecord);
        props.onClose();
        alert('Dados salvos com sucesso!');
    } catch (error) {
        alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
        console.error('Error saving study record:', error);
    }
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
                <span for="study-time">Tempo de Estudos (hh:mm:ss)</span>
                <input v-model="studyTime"
                    class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
            </div>

            <div class="mt-4">
                <p>Você resolveu questões?</p>
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

            <div v-if="questionsResolved === 'yes'" >
                <div class="mb-4">
                    <span>Total de Questões Resolvidas</span>
                    <input type="number" v-model="totalQuestions" placeholder="hh:mm:ss"
                        class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
                </div>
                <div class="mb-4">
                    <span>Total de Questões Corretas</span>
                    <input type="number" v-model="correctAnswers" placeholder="Ex.: 10"
                        class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
                </div>
                <div class="mb-4">
                    <span>Total de Questões Erradas</span>
                    <input type="number" :value="incorrectAnswers" placeholder="Ex.: 8" disabled
                        class="mt-1 block w-full border rounded px-2 py-1 appearance-none outline-none" />
                </div>
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