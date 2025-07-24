<script setup>

</script>

<template>
    <div class="flex flex-col p-3 shadow-md rounded-lg border border-gray-200">
        <div class="flex items-center gap-2">
            <slot name="title">Titulo padrão</slot>
        </div>
        <div class="mt-2 text-center">
            <slot name="content">Conteúdo padrão</slot>
        </div>
    </div>
</template>