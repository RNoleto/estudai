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
    },
    maxlength: { 
        type: Number,
        default: 150 
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex flex-col gap-1">
        <label 
        v-if="showLabel"
            :for="id"
            class="text-sm sm:text-sm font-medium text-gray-700"
        >{{ label }}</label>
        <input 
            :id="id" 
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :maxlength="maxlength"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full inline-flex items-center justify-between rounded-md px-[15px] text-base leading-none h-[36px] gap-[5px] bg-white text-gray-700 shadow hover:bg-gray-100 outline-none"
        />
    </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>