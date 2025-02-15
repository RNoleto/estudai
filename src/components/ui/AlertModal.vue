<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 z-20">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
      <div class="flex justify-center mb-4">
        <span v-if="type === 'success'" class="text-baseGreen text-4xl">✔️</span>
        <span v-if="type === 'error'" class="text-baseRed text-4xl">❌</span>
        <span v-if="type === 'delete'" class="text-baseRed text-4xl"><i class="fa-solid fa-trash-can"></i></span>
      </div>
      <h2 class="text-lg font-bold sm:text-2xl mb-2" :class="type === 'success' ? 'text-baseGreen' : 'text-baseRed'">
        {{ title }}
      </h2>
      <p class="text-gray-700">{{ message }}</p>
      <div class="flex gap-1 mt-4">
        <Button @click="$emit('close')" variant="base" size="full">
          Fechar
        </Button>
        <Button v-if="showConfirm" @click="$emit('confirm')" variant="delete" size="full">
          Confirmar
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Button from './Button.vue';

defineProps({
  visible: Boolean,
  title: String,
  message: String,
  type: String, // success ou error
  showConfirm: {
    type: Boolean,
    default: false
  }
});
</script>
