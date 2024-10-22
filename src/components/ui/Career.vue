<script setup>
import { Icon } from '@iconify/vue';
import { defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  careerName: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="bg-black p-2 flex items-center gap-2 rounded-md cursor-pointer shadow-sm shadow-zinc-200">
    <div class="bg-white p-1 rounded-full flex justify-center items-center">
      <Icon :icon="icon" class="text-black transform-none" />
    </div>
    <p class="text-white">{{ careerName }}</p>
  </div>
</template>
