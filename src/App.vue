<script setup>
import Input from './components/ui/Input.vue';

</script>

<template>
  <div class="w-[600px] m-auto">
    <ul>
      <li>Tailwind Instalado</li>
    </ul>
      <Input label="Nome"/>
      <Input label="Email" type="email" />
      <Input label="Senha" type="password"/>
  </div>
</template>
