<script setup>
import { defineProps, defineEmits } from 'vue';
import { useCurrentDate } from '../composables/useCurrentDate';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    totalStudyTime: {
        type: String,
        default: '00:00',
    },
    totalPauses: {
        type: Number,
        default: 0,
    },
    formattedDate: {
        type: String,
        default: new Date().toLocaleDateString(),
    },
});

// Usando a composable para obter a data formatada
const { formattedDate } = useCurrentDate();

// Define a função para emitir o evento de fechamento
const emit = defineEmits(['onClose']);

const close = () => {
    emit('onClose'); // Emite o evento 'onClose' para o componente pai
};
</script>
<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 class="text-lg font-bold mb-4">Resumo do Estudo</h3>
            <p>Tempo Total: {{ totalStudyTime }}</p>
            <p>Total de Pausas: {{ totalPauses }}</p>
            <p>Data: {{ formattedDate }}</p>

            <div class="flex justify-end mt-4">
                <button @click="close" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Fechar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fixed {
    position: fixed;
}
</style>