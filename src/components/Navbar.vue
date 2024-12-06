<script setup>
import { UserButton } from 'vue-clerk'

</script>

<template>
    <nav class="flex justify-between p-4 items-center bg-gray-800 shadow-sm shadow-zinc-500">
        <p class="text-white font-bold">Gerenciador de Estudos</p>
        <div class="text-white flex gap-4 text-sm">
            <router-link to="estudar">Estudar</router-link>
            <router-link to="area-do-aluno">Área do aluno</router-link>
        </div>
        <UserButton /> 
    </nav>
</template>