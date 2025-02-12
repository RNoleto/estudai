<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
      <div class="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <div class="flex justify-center mb-4">
          <span v-if="type === 'success'" class="text-green-500 text-4xl">✔️</span>
          <span v-if="type === 'error'" class="text-red-500 text-4xl">❌</span>
        </div>
        <h2 class="text-lg font-bold sm:text-2xl mb-2" :class="type === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ title }}
        </h2>
        <p class="text-gray-700">{{ message }}</p>
        <Button @click="$emit('close')" variant="base" size="full" class="mt-4">
          Fechar
        </Button>
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
  });
  </script>
  