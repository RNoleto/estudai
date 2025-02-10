<script setup>
import { RouterView, useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();

</script>

<template>
  <div class="w-full bg-gray-100">
      <!-- <Navbar v-if="route.path !== '/'" /> -->
      <RouterView/>
  </div>
</template>