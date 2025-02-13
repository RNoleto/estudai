<script setup>
import { ref } from 'vue';
import Card from '../Card.vue';
import Input from '../ui/Input.vue';
import Button from './Button.vue';

defineProps({
    title: {
        type: String,
        required: false,
        default: 'Título'
    }
});

const emit = defineEmits(['close', 'save']);

// Estado para armazenar o nome da matéria
const subjectName = ref('');

const save = () => {
    if (!subjectName.value.trim()) {
        alert("O nome da matéria não pode estar vazio!");
        return;
    }
    emit('save', subjectName.value);
    subjectName.value = ''; // Limpar campo após salvar
};
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 z-10">
        <Card class="px-10 py-5 relative">
            <template #title>
                <i @click="$emit('close')" class="absolute top-3 right-3 text-primary fa-solid fa-xmark text-lg cursor-pointer hover:text-secondary"></i>
                <p class="text-2xl text-primary font-bold text-center relative w-fit mx-auto mt-2 after:content-[''] after:block after:w-2/3 after:h-[1px] after:bg-primary after:mx-auto">
                    {{ title }}
                </p>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 relative">
                    <Input v-model="subjectName" :maxlength="25" placeholder="Nome da matéria aqui..." class="font-medium" />
                    <div class="flex justify-end">
                        <Button @click="save" variant="base" size="full" class="mt-2 w-fit">Salvar</Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>
