<script setup>
import Search from '../components/ui/Search.vue';
import Input from '../components/ui/Input.vue';
import Timer from '../components/ui/Timer.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
const { formattedDate } = useCurrentDate();
</script>

<template>
    <div class="w-[900px]">
        <div class="flex items-center gap-2 justify-between">
            <h2 class="text-xl uppercase font-bold">Iniciar estudos</h2>
            <div class="text-center text-sm bg-zinc-100 rounded-md p-2">
                <p>Dia</p>
                <p>{{ formattedDate }}</p>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-2 content-center mt-2">
            <Search placeholder="Pesquise pela matéria" class="col-span-1" />
            <Input placeholder="Qual tópico você vai estudar?" :showLabel="false" class="col-span-2" />
        </div>
        <div class="mt-2">
            <div class="grid grid-cols-3 gap-2">
                <Timer class="col-span-1" />
                <!-- <div class="bg-white col-span-2 p-4 rounded-md">
                    <p>Espaço para <span class="font-bold">StudySummaryModal</span> e  informações de estudos realizados no dia: {{ formattedDate }}</p>
                    <br>
                    <p>Esse campo fica oculto quando não tem nenhuma informação salva, pegar valores do modal após clicar em "Parar" e salvar no modal.</p>
                </div> -->
            </div>
        </div>
    </div>
</template>