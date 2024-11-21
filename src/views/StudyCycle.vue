<script setup>
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Career from '../components/ui/Career.vue';
import Navbar from '../components/Navbar.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
const { formattedDate } = useCurrentDate();

</script>

<template>
    <div class="w-full">
        <Navbar />
        <div class="p-4 flex flex-col gap-4 h-screen">
            <div class="flex items-center justify-between">
                <h3 class="text-4xl">Monte seu ciclo de estudo para hoje</h3>
                <p class="text-sm">{{ formattedDate }}</p>
            </div>
            <!-- Carreira escolhida pelo usuario na tela anterior -->
            <p class="bg-red-500">Nome da carreira escolhida</p> 
            <Search/>
            <p class="bg-red-500">Lista de Matérias selecionadas pelo usuário na tela anterior</p>
            <div class="flex flex-wrap gap-2">
                <!-- Lista das matérias que serão estudadas hoje -->
                <Career icon="basil:book-outline" careerName="Língua Portuguesa" />
                <Career icon="basil:book-outline" careerName="Língua Inglesa" />
                <Career icon="basil:book-outline" careerName="Direito Constituicional" />
                <Career icon="basil:book-outline" careerName="Direito Penal" />
                <Career icon="basil:book-outline" careerName="Direito Administrativo" />
                <Career icon="basil:book-outline" careerName="Administração Geral" />
                <Career icon="basil:book-outline" careerName="AFO" />
            </div>
            <div class="flex gap-2">
                <Button class="float-right" :to="{ name: 'Materias' }">Voltar</Button>
                <Button class="float-right" :to="{ name: 'Estudar' }">Avançar</Button>
            </div>
        </div>
    </div>
</template>