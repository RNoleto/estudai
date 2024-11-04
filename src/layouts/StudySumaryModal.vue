<script setup>
import Button from '../components/ui/Button.vue';
import { computed } from 'vue';
import { useTimerStore } from '../stores/useTimerStore';

const props = defineProps({
  isOpen: Boolean, 
});

const timerStore = useTimerStore();

// Computed properties para garantir que os valores estejam atualizados
const totalStudyTime = computed(() => timerStore.finalFormattedTime);
const totalPauses = computed(() => timerStore.finalTotalPausesLength);

const closeModal = () => {
  emit('onClose');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-bold mb-4 uppercase ">Resumo de Estudo</h2>
      <!-- Exibindo o tempo total de estudo -->
      <div>
        <strong>Tempo Total de Estudo:</strong> {{ totalStudyTime }}
      </div>
      <!-- Exibindo o número de pausas -->
      <div>
        <strong>Total de Pausas:</strong> {{ totalPauses }}
      </div>
      <Button 
        variant="primary"
        @click="$emit('onClose')"
        >
        Salvar
      </Button>
    </div>
  </div>
</template>
