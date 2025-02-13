<script setup>
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from "radix-vue";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Selecione uma opção...",
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

// Valor selecionado
const selectedOption = ref(props.modelValue);

// Atualiza o valor e emite o evento para o pai
const handleSelection = (option) => {
  selectedOption.value = option;
  emit("update:modelValue", option);
  emit("select", option);
};
</script>

<template>
  <ComboboxRoot v-model="selectedOption" class="relative">
    <ComboboxAnchor
      class="w-full inline-flex items-center justify-between rounded-md px-[15px] text-base leading-none h-[36px] gap-[5px] bg-white shadow  outline-none">
      <ComboboxTrigger class="w-full flex justify-between items-center">
        <ComboboxInput
          :class="[
            'w-full',
            '!bg-transparent',
            'outline-none',
            'h-full',
            'selection:bg-gray-300',
            'selection:text-red-800',
            'text-gray-700',
            'placeholder:text-gray-700'
          ]"
          :placeholder="selectedOption ? selectedOption.name : placeholder" 
        />
        <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-gray-700" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="absolute z-10 w-full mt-2 bg-zinc-50 rounded-xl border border-secondary shadow-md ">
      <ComboboxViewport class="p-1">
        <ComboboxGroup>
          <ComboboxLabel class="px-4 text-base bg-primary rounded leading-[25px] text-white font-bold text-center">
            -- Suas matérias --
          </ComboboxLabel>
          <ComboboxItem
            v-for="option in options"
            :key="option.id"
            class="text-base mt-1 leading-2 text-zinc-700 rounded flex items-center px-4 relative cursor-pointer hover:bg-primary hover:text-white"
            :value="option"
            @click="handleSelection(option)">
            <ComboboxItemIndicator
              class="absolute left-0 inline-flex items-center justify-center text-green-600">
              <Icon icon="radix-icons:check" />
            </ComboboxItemIndicator>
            {{ option.name }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>