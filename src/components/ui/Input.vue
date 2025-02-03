<script setup>
const props = defineProps({
    label: String,
    id: String,
    modelValue: String,
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: 'Escreva aqui',
    },
    showLabel:{
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex flex-col gap-1">
        <label 
        v-if="showLabel"
            :for="id"
            class="sm:text-sm text-zinc-800"
        >{{ label }}</label>
        <input 
            :id="id" 
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full inline-flex items-center justify-between rounded-md px-[15px] text-base leading-none h-[36px] gap-[5px] bg-white text-gray-700 shadow hover:bg-gray-100 outline-none"
        />
    </div>
</template>