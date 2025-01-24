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
    <div class="w-full inline-flex items-center justify-between rounded px-[15px] text-base leading-none h-[35px] gap-[5px] bg-gray-100 text-gray-700 shadow  outline-none group" :class="inputClass">
      <!-- Exibe o ícone de busca apenas se a propriedade `showIcon` for verdadeira -->
      <template v-if="showIcon">
        <Icon icon="ic:baseline-search" class="text-zinc-500 text-sm mr-1 transition-transform duration-200 ease-in-out group-hover:scale-125" />
      </template>
      <input
        v-model="searchTerm"
        :placeholder="placeholder"
        type="text"
        class="w-full inline-flex leading-none outline-none bg-gray-100"
      />
    </div>
  </template>
  