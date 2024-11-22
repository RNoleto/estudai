<script setup>
import { ref, computed } from 'vue' // Adicione a importação do computed
import { ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot } from 'radix-vue'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]
const selectedPeople = ref(people[0])
const searchTerm = ref('')

const filteredPeople = computed(() =>
  searchTerm.value === ''
    ? people
    : people.filter((person) => {
      return person.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
)
</script>

<template>
  <ComboboxRoot
    v-model="selectedPeople"
    v-model:searchTerm="searchTerm"
  >
    <ComboboxInput />
    <ComboboxPortal>
      <ComboboxContent>
        <ComboboxItem
          v-for="person in filteredPeople"
          :key="person.id"
          :value="person"
          :disabled="person.unavailable"
        >
          {{ person.name }}
        </ComboboxItem>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
