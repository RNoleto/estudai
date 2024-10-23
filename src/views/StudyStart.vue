<script setup>
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
const { formattedDate } = useCurrentDate();
</script>

<template>
    <div class="w-[900px]">
        <div class="flex items-center gap-2 justify-between">
            <h2 class="text-xl uppercase font-bold">Iniciar estudos</h2>
            <div class="text-center text-sm bg-zinc-100 rounded-md p-2">
                <p>Hoje</p>
                <p>{{ formattedDate }}</p>
            </div>
        </div>
        <div class="flex gap-2 content-center mt-2">
            <Search placeholder="Pesquise pela matéria" class="w-1/3"/>
            <Input placeholder="Qual assunto você vai estudar?" :showLabel="false" class="w-2/3"/>
        </div>
        <div class="mt-2 bg-red-200">
            <p>Tela de inicio de estudo</p>
        </div>
    </div>
</template>