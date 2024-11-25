<script setup>
const props = defineProps({
    label: String,
    id: String,
    modelValue: String,
    type: {
        type: String,
        default: 'text', //Definindo o padrão como text <-- pode ser password, date, etc -->
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
            class="text-sm font-bold text-zinc-800"
        >{{ label }}</label>
        <input 
            :id="id" 
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="flex bg-zinc-200 items-center border rounded-md p-2 shadow-sm shadow-zinc-200 hover:bg-zinc-100 group"
        />
    </div>
</template>