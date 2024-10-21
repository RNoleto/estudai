<script setup>
import Input from './components/ui/Input.vue';
import Button from './components/ui/Button.vue';

</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="w-[400px] p-4 rounded-lg border border-black shadow-sm shadow-zinc-200">
        <Input label="Nome"/>
        <Input label="Email" type="email" />
        <Input label="Senha" type="password"/>
        <Button size="full">Teste</Button>
    </div>
  </div>
</template>
