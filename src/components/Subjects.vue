<script setup>
import Career from './ui/Career.vue';
import Button from './ui/Button.vue';
import Search from './ui/Search.vue';
</script>

<template>
    <div class="max-w-[1200px] bg-zinc-300 p-[60px] shadow-sm shadow-zinc-200 rounded-md">
        <h2 class="mb-4 font-bold text-xl">Selecione as matérias que deseja estudar.</h2>
        <Search placeholder="Pesquise a matéria..."/>
        <div class="mt-4 flex flex-wrap gap-2 w-full">
            <Career icon="basil:book-outline" careerName="Língua Portuguesa"/>
            <Career icon="basil:book-outline" careerName="Informática"/>
            <Career icon="basil:book-outline" careerName="Matemática"/>
            <Career icon="basil:book-outline" careerName="Direito Administrativo"/>
            <Career icon="basil:book-outline" careerName="Raciocínio Lógico"/>
            <Career icon="basil:book-outline" careerName="Direito Constitucional"/>
            <Career icon="basil:book-outline" careerName="Língua Inglesa"/>
            <Career icon="basil:book-outline" careerName="Direito Civil"/>
        </div>
        <Button class="float-right">Avançar</Button>
    </div>
</template>