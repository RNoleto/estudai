<script setup>
import { Icon } from '@iconify/vue';
import { ref, watch, defineProps, defineEmits } from 'vue';

// Propriedades recebidas pelo componente
const props = defineProps({
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
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Estado local para o termo de pesquisa
const searchTerm = ref(props.modelValue);

// Observa mudanças em searchTerm e emite o valor atualizado para o pai
watch(searchTerm, (newTerm) => {
  emit('update:modelValue', newTerm);
});

// Atualiza searchTerm quando modelValue muda externamente
watch(() => props.modelValue, (newVal) => {
  searchTerm.value = newVal;
});
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
  