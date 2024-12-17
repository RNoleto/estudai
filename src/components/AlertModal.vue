<script setup>
defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: "Confirmação"
    },
    message: {
        type: String,
        default: "Tem certeza que deseja prosseguir?"
    }
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-md shadow-lg p-6 w-80">
            <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
            <p class="mb-6">{{ message }}</p>
            <div class="flex justify-end gap-2">
                <button @click="$emit('cancel')"
                    class="px-4 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-100">
                    Cancelar
                </button>
                <button @click="$emit('confirm')" class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                    Deletar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Adicione estilos conforme necessário */
</style>