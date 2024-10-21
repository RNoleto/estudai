<script setup>
import Input from './components/ui/Input.vue';
import Button from './components/ui/Button.vue';

</script>

<template>
  <div class="w-[400px] m-auto p-4 rounded-md bg-blue-500">
      <Input label="Nome"/>
      <Input label="Email" type="email" />
      <Input label="Senha" type="password"/>

      <Button size="full">Teste</Button>
  </div>
</template>
