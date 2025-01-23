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
      class="w-full inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-gray-700 shadow hover:bg-gray-100 outline-none">
      <ComboboxTrigger class="w-full flex justify-between">
        <ComboboxInput
          class="w-full !bg-transparent outline-none text-gray-700 h-full selection:bg-gray-300"
          :placeholder="selectedOption ? selectedOption.name : placeholder" />
        <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-gray-700" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="absolute z-10 w-full mt-2 bg-white rounded shadow">
      <ComboboxViewport class="p-[5px]">
        <ComboboxGroup>
          <ComboboxLabel class="px-[25px] text-base leading-[25px] text-gray-500">
            Opções
          </ComboboxLabel>
          <ComboboxItem
            v-for="option in options"
            :key="option.id"
            class=""
            :value="option"
            @click="handleSelection(option)">
            <ComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <Icon icon="radix-icons:check" />
            </ComboboxItemIndicator>
            {{ option.name }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
