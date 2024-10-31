<script setup>
import { Icon } from '@iconify/vue';
  // Propriedades recebidas pelo componente
  defineProps({
    placeholder: {
      type: String,
      default: 'Pesquisar...',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    inputClass: {
      type: String,
      default: '',
    },
  });
  
  // Estado local para o termo de pesquisa
  import { ref } from 'vue';
  const searchTerm = ref('');
  </script>
<template>
    <div class="flex bg-zinc-200 items-center border rounded-md p-2 shadow-sm shadow-zinc-200 hover:bg-zinc-100 group" :class="inputClass">
      <!-- Exibe o ícone de busca apenas se a propriedade `showIcon` for verdadeira -->
      <template v-if="showIcon">
        <Icon icon="ic:baseline-search" class="text-zinc-500 text-sm mr-1 transition-transform duration-200 ease-in-out group-hover:scale-125" />
      </template>
      <input
        v-model="searchTerm"
        :placeholder="placeholder"
        type="text"
        class="outline-none bg-transparent text-sm text-zinc-500"
      />
    </div>
  </template>
  
  <style scoped>
  /* Estilos adicionais (opcionais) */
  </style>
  