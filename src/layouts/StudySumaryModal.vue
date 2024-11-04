<script setup>
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
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="text-lg font-bold mb-4">Resumo de Estudo</h2>
      
      <!-- Exibindo o tempo total de estudo -->
      <div>
        <strong>Tempo Total de Estudo:</strong> {{ totalStudyTime }}
      </div>

      <!-- Exibindo o número de pausas -->
      <div>
        <strong>Total de Pausas:</strong> {{ totalPauses }}
      </div>
      <button @click="$emit('onClose')" class="btn mt-4">Fechar</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
