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
  <div class="bg-zinc-900 p-2 flex items-center gap-2 rounded-md cursor-pointer shadow-sm shadow-black hover:bg-zinc-400 text-zinc-900 group">
    <div class="bg-white p-1 rounded-full flex justify-center items-center group-hover:bg-zinc-500">
      <Icon :icon="icon" class="text-zinc-900 transform-none group-hover:text-white" />
    </div>
    <p class="text-white group-hover:text-zinc-900">{{ careerName }}</p>
  </div>
</template>
