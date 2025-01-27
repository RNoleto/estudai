<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default: "Card Title",
  },
  footer: {
    type: String,
    required: false,
    default: "campo de footer",
  },
});
</script>

<template>
  <div class="flex flex-col justify-center bg-white shadow-md rounded-2xl text-center px-2 py-4 gap-1 sm:p-4 sm:gap-4 sm:min-h-[250px]">
    <!-- Título -->
    <p class="text-sm sm:text-2xl font-bold text-gray-800">{{ title }}</p>

    <!-- Slot para campos opcionais -->
    <div class="flex fles-col gap-2">
        <slot name="fields">
            <!-- Padrão caso não seja fornecido -->
             <!-- <p class="text-xs text-gray-500">Nenhum campo foi adicionado.</p> -->
        </slot>
     </div>

    <!-- Slot para o conteúdo com estilos padrão -->
    <div class="text-2xl font-bold sm:text-4xl text-blue-600">
      <slot name="content">Conteúdo padrão</slot>
    </div>

    <!-- Slot para footer com estilos padrão -->
    <div class="text-xs text-gray-600">
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>
