<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Props para receber o valor inicial (v-model)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isSaving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const content = ref(props.modelValue);

// Configuração da Barra de Ferramentas (Toolbar)
const toolbarOptions = [
  ['bold', 'italic', 'underline'],        // Formatação básica
  [{ 'color': [] }, { 'background': [] }], // Cores de texto e fundo
  [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Listas
  [{ 'header': [1, 2, 3, false] }],       // Cabeçalhos
  ['clean']                               // Limpar formatação
];

// Atualiza o pai quando o conteúdo muda
const onContentChange = () => {
  emit('update:modelValue', content.value);
};

// Observa mudanças externas (se necessário)
watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal;
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <i class="fa-solid fa-note-sticky text-yellow-500"></i>
        Anotações de Estudos
      </h2>
      
      <span v-if="isSaving" class="text-xs text-gray-500 flex items-center gap-1">
        <i class="fa-solid fa-spinner fa-spin"></i> Salvando...
      </span>
      <span v-else class="text-xs text-gray-400">
        <i class="fa-solid fa-check"></i> Salvo
      </span>
    </div>

    <div class="flex-1 flex flex-col min-h-[300px]">
      <QuillEditor 
        v-model:content="content" 
        contentType="html" 
        theme="snow" 
        :toolbar="toolbarOptions" 
        placeholder="Comece a escrever seus insights aqui..."
        @update:content="onContentChange"
        class="h-full"
      />
    </div>
  </div>
</template>

<style>
/* Ajustes finos no Quill para combinar com Tailwind */
.ql-toolbar.ql-snow {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  background-color: #ffffff;
}

.ql-container.ql-snow {
  border: none !important;
  font-family: inherit;
  font-size: 1rem;
}

.ql-editor {
  min-height: 250px;
  color: #374151;
}

/* Scrollbar personalizada para o editor */
.ql-editor::-webkit-scrollbar {
  width: 8px;
}
.ql-editor::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
</style>