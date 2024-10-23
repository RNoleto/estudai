<script setup>
import Button from '../components/ui/Button.vue';
import Search from '../components/ui/Search.vue';
import Career from '../components/ui/Career.vue';

import { useCurrentDate } from '../composables/useCurrentDate';
const { formattedDate } = useCurrentDate();

</script>

<template>
    <div>
        <div class="flex justify-between items-center">
            <h2 class="font-bold text-xl">Monte seu ciclo de estudo para hoje</h2>
            <p class="text-sm font-bold">{{ formattedDate }}</p>
        </div>
        <Search class="mt-2"/>
        <p class="mt-2">Matérias selecionadas</p>
        <div class="mt-2 flex flex-wrap gap-2">
            <!-- Lista das matérias que serão estudadas hoje -->
            <Career icon="basil:book-outline" careerName="Língua Portuguesa"/>
            <Career icon="basil:book-outline" careerName="Língua Inglesa"/>
            <Career icon="basil:book-outline" careerName="Direito Constituicional"/>
            <Career icon="basil:book-outline" careerName="Direito Penal"/>
            <Career icon="basil:book-outline" careerName="Direito Administrativo"/>
            <Career icon="basil:book-outline" careerName="Administração Geral"/>            
            <Career icon="basil:book-outline" careerName="AFO" />
        </div>
        <Button class="float-right">Avançar</Button>
    </div>
</template>