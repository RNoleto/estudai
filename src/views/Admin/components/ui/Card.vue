<script setup>

</script>

<template>
    <div class="flex flex-col p-3 shadow-md rounded-md border border-gray-200">
        <slot name="title">Titulo padrão</slot>
        <div class="mt-2 text-center">
            <slot name="content">Conteúdo padrão</slot>
        </div>
    </div>
</template>