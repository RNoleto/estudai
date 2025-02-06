<script setup>
import Stripe from '../components/Stripe.vue';
import { ref } from "vue";
import { useUser } from 'vue-clerk';

const { user } = useUser();

const isPremium = user?.privateMetadata?.premium;

</script>

<template>
  <div class="flex flex-col items-center">
    <div>
      <h1>Bem-vindo, {{ user.fullName }}</h1>
      <p v-if="isPremium">🎉 Você tem acesso premium!</p>
      <p v-else>⚠️ Assine para desbloquear recursos premium.</p>
    </div>

    <Stripe />


  </div>
</template>