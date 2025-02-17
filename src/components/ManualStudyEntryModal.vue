<script setup>
import { ref, computed } from 'vue';
import { useStudyStore } from '../stores/useStudyStore';

import Button from './ui/Button.vue';

import Card from './Card.vue';

const props = defineProps({
    isVisible: Boolean,
    selectedSubject: Object,
    onClose: Function,
    onSave: Function,
});

const studyStore = useStudyStore();
const hours = ref('');
const minutes = ref('');
const totalQuestions = ref(0);
const correctAnswers = ref(0);
const questionsResolved = ref(null);
const pause = ref(null);
const totalPauses = ref('null');

const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value);

const resetForm = () => {
    studyStore.topic = '';
    hours.value = '';
    minutes.value = '';
    totalQuestions.value = 0;
    correctAnswers.value = 0;
    questionsResolved.value = null;
    pause.value = null;
    totalPauses.value = null;
};

const validateInputs = () => {
    // Se o campo de horas estiver vazio, define como "0"
    if (hours.value.trim() === '') {
        hours.value = '0';
    }

    // Validação para o campo de minutos (aceitando 1 ou 2 dígitos)
    if (!/^(\d{1,2})$/.test(minutes.value)) {
        alert('Por favor, insira um valor válido para minutos.');
        return false;
    }

    // Se horas for maior que 0, os minutos devem ser maiores que 0 para considerar as horas válidas
    if (parseInt(hours.value, 10) > 0 && parseInt(minutes.value, 10) === 0) {
        alert('A hora só pode ser considerada se os minutos forem maiores que 0.');
        return false;
    }

    // Validação para o campo de horas (já garantido que não está vazio)
    if (!/^(\d{1,2})$/.test(hours.value)) {
        alert('Por favor, insira um valor válido para horas.');
        return false;
    }

    // Validações adicionais
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
        const totalSeconds = (parseInt(hours.value, 10) || 0) * 3600 + (parseInt(minutes.value, 10) || 0) * 60;

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
        <Card title="Inserir Informações de Estudo" icon="" class="shadow-lg relative">
            <template #content>
                <div class="px-2 text-base flex flex-col w-full text-gray-700 font-normal">
                    <div class="text-sm mb-4 sm:text-base">
                        <p><strong>Matéria:</strong> {{ selectedSubject.name }}</p>
                        <p><strong>Tópico:</strong> {{ studyStore.topic }}</p>
                    </div>
                    <div class="text-sm mb-4 sm:text-base">
                        <label class="block font-medium">Tempo de Estudos</label>
                        <div class="flex gap-2">
                            <input v-model="hours" type="number" placeholder="Horas"
                                class="w-[70px] border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                            <span class="self-center">:</span>
                            <input v-model="minutes" type="number" min="0" max="59" placeholder="Minutos"
                                class="w-[70px] border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
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
                    <div v-if="questionsResolved === 'yes'" class="flex gap-4 mt-2">
                        <label class="flex flex-col">
                            <span class="text-sm font-medium sm:text-base">Total</span>
                            <input type="number" v-model="totalQuestions" min="0" placeholder="Ex.: 20"
                                class="w-[110px] mt-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
                        </label>
                        <label class="flex flex-col">
                            <span class="text-sm font-medium sm:text-base">Corretas</span>
                            <input type="number" v-model="correctAnswers" min="0" placeholder="Ex.: 15"
                                class="w-[110px] mt-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
                        </label>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <Button variant="base" size="full" @click="handleSave">Salvar</Button>
                        <Button variant="secondary" @click="handleCancel">Cancelar</Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
