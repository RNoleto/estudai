<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div class="h-screen w-full bg-gray-100">
      <Navbar />
      <RouterView/>
  </div>
</template>