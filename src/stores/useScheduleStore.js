import { defineStore } from 'pinia';
import { ref } from 'vue';

// Função utilitária para obter a data de hoje no formato 'AAAA-MM-DD'
function getTodayDateString() {
  const today = new Date();
  // Ajusta para o fuso horário local para evitar problemas de data
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset*60*1000));
  return adjustedToday.toISOString().split('T')[0];
}

export const useScheduleStore = defineStore('schedule', () => {

  // --- STATE ---
  // O "molde" do cronograma que o usuário monta
  const weeklyPlan = ref([
    { day: 'Segunda-feira', subjects: [] },
    { day: 'Terça-feira', subjects: [] },
    { day: 'Quarta-feira', subjects: [] },
    { day: 'Quinta-feira', subjects: [] },
    { day: 'Sexta-feira', subjects: [] },
    { day: 'Sábado', subjects: [] },
    { day: 'Domingo', subjects: [] },
  ]);

  // [NOVO] O progresso diário. Armazena os IDs das matérias concluídas por data.
  // Ex: { '2025-07-28': Set(167..., 168...) }
  const dailyProgress = ref({});
  
  const isLoading = ref(false);

  // --- ACTIONS ---

  // Carrega o MOLDE do cronograma
  function loadWeekPlan() {
    return new Promise(resolve => {
        console.log("Carregando cronograma (mock)...");
        isLoading.value = true;
        const savedPlan = localStorage.getItem('userWeeklyPlan');
        if (savedPlan) {
          weeklyPlan.value = JSON.parse(savedPlan);
        }
        // Simula um pequeno delay de rede
        setTimeout(() => {
          isLoading.value = false;
          console.log("Cronograma carregado.");
          resolve(); // Avisa que a operação terminou
        }, 200); // Reduzi o delay para a UI parecer mais rápida
      });
  }

  // Salva o MOLDE do cronograma
  function saveWeeklyPlan() {
    localStorage.setItem('userWeeklyPlan', JSON.stringify(weeklyPlan.value));
  }

  // [NOVO] Carrega o PROGRESSO salvo
  function loadDailyProgress() {
    const savedProgress = localStorage.getItem('dailyProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      Object.keys(parsed).forEach(date => {
        // Converte o array salvo de volta para um Set para performance
        dailyProgress.value[date] = new Set(parsed[date]);
      });
    }
  }

  // [NOVO] Salva o PROGRESSO
  function saveDailyProgress() {
    const serializableProgress = {};
    Object.keys(dailyProgress.value).forEach(date => {
      // Converte o Set para um Array para que possa ser salvo como JSON
      serializableProgress[date] = Array.from(dailyProgress.value[date]);
    });
    localStorage.setItem('dailyProgress', JSON.stringify(serializableProgress));
  }

  // [NOVO] Ação principal para marcar/desmarcar uma matéria HOJE
  function toggleCompletion(subjectId) {
    const today = getTodayDateString();

    // Garante que existe um Set para o dia de hoje
    if (!dailyProgress.value[today]) {
      dailyProgress.value[today] = new Set();
    }

    const todayProgress = dailyProgress.value[today];

    if (todayProgress.has(subjectId)) {
      todayProgress.delete(subjectId);
    } else {
      todayProgress.add(subjectId);
    }
    
    // Salva o progresso a cada mudança
    saveDailyProgress();
  }

  // [NOVO] Getter/Função para verificar se uma matéria está completa HOJE
  function isCompleted(subjectId) {
    const today = getTodayDateString();
    return dailyProgress.value[today]?.has(subjectId) || false;
  }

  return {
    weeklyPlan,
    isLoading,
    loadWeekPlan,
    saveWeeklyPlan,
    dailyProgress,
    loadDailyProgress,
    toggleCompletion,
    isCompleted,
  };
});