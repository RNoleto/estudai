<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">Editar Registro</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="subjectName" class="block text-sm font-medium text-gray-700">Matéria</label>
            <input
              v-model="formData.subjectName"
              type="text"
              id="subjectName"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="topic" class="block text-sm font-medium text-gray-700">Tópico</label>
            <input
              v-model="formData.topic"
              type="text"
              id="topic"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="studyTime" class="block text-sm font-medium text-gray-700">Tempo de estudo</label>
            <input
              v-model="formData.studyTime"
              type="number"
              id="studyTime"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="totalPauses" class="block text-sm font-medium text-gray-700">Nº de pauses</label>
            <input
              v-model="formData.totalPauses"
              type="number"
              id="totalPauses"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, toRefs } from 'vue';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    },
    record: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['update', 'close']);
  
  const formData = reactive({
    subjectName: props.record.subjectName,
    topic: props.record.topic,
    studyTime: props.record.study_time,
    totalPauses: props.record.totalPauses
  });
  
  const handleSubmit = () => {
    emit('update', { ...formData });
    closeModal();
  };
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  </style>