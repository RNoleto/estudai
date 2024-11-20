<script setup>
import LoginRegister from './views/LoginRegister.vue';
import CareerSelection from './views/CareerSelection.vue';
import Subjects from './views/Subjects.vue';
import StudyCycle from './views/StudyCycle.vue';
import StudyStart from './views/StudyStart.vue';

import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'

</script>

<template>
  <!-- <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-[1200px] bg-zinc-300 p-[60px] shadow-sm shadow-zinc-200 rounded-md">
      <StudyStart/>
    </div>
  </div> -->
  <div class="w-full">
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>
</template>