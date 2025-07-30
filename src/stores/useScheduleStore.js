import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';

import axios from 'axios';

// Função utilitária para obter a data de hoje no formato 'AAAA-MM-DD'
function getTodayDateString() {
  const today = new Date();
  // Ajusta para o fuso horário local para evitar problemas de data
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset * 60 * 1000));
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

  const dailyProgress = ref({});

  const isLoading = ref(false);

  async function loadWeekPlan() {
    const userStore = useUserStore();
    if (!userStore.userId) return;

    isLoading.value = true;
    try {
      const response = await axios.get(`schedule/${userStore.userId}`);
      const itemsFromDb = response.data;

      weeklyPlan.value.forEach(day => day.subjects = []);

      const dayMap = [
        'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
      ];

      itemsFromDb.forEach(item => {
        const dayName = dayMap[item.day_of_week - 1];
        const dayObject = weeklyPlan.value.find(d => d.day === dayName);

        if (dayObject && item.subject) {
          dayObject.subjects.push({
            id: item.id,
            name: item.subject.name,
            subject_id: item.subject_id // O ID real da matéria
          });
        }
      });
    } catch (error) {
      console.error("Erro ao carregar o cronograma:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveWeeklyPlan() {
    const userStore = useUserStore();
    if (!userStore.userId) return;

    isLoading.value = true;
    try {
      // [LÓGICA SIMPLIFICADA]
      // Agora podemos confiar que cada 'subject' no nosso plano já tem o 'subject_id' correto.
      const payload = {
        user_id: userStore.userId,
        weeklyPlan: weeklyPlan.value, // A estrutura já está pronta!
      };

      const response = await axios.post('schedule', payload);

      // A resposta da API já contém o cronograma salvo com os IDs permanentes
      const itemsFromDb = response.data.schedule;

      // Atualiza o estado local com os dados do banco (a "fonte da verdade")
      weeklyPlan.value.forEach(day => day.subjects = []);
      const dayMap = [
        'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
      ];
      itemsFromDb.forEach(item => {
        const dayName = dayMap[item.day_of_week - 1];
        const dayObject = weeklyPlan.value.find(d => d.day === dayName);
        if (dayObject && item.subject) {
          dayObject.subjects.push({
            id: item.id,
            name: item.subject.name,
            subject_id: item.subject_id
          });
        }
      });
    } catch (error) {
      console.error("Erro ao salvar o cronograma:", error);
      // Analise a resposta do erro para ver as mensagens de validação do Laravel
      if (error.response && error.response.status === 422) {
        console.error("Erros de validação:", error.response.data.errors);
        alert("Erro de validação. Verifique o console.");
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadDailyProgress() {
    const userStore = useUserStore();
    if (!userStore.userId) return;
    const today = getTodayDateString();
    try {
      const response = await axios.get(`/progress/${userStore.userId}`, {
        params: { date: today }
      });
      const completedIds = response.data.map(item => item.schedule_item_id);
      dailyProgress.value[today] = new Set(completedIds);
    } catch (error) {
      console.error("Erro ao carregar progresso diário:", error);
      dailyProgress.value[today] = new Set();
    }
  }

  async function toggleCompletion(subjectId) {
    const userStore = useUserStore();
    if (!userStore.userId) return;
    const today = getTodayDateString();
    if (!dailyProgress.value[today]) {
      dailyProgress.value[today] = new Set();
    }

    // Atualização Otimista: Muda a UI primeiro
    if (dailyProgress.value[today].has(subjectId)) {
      dailyProgress.value[today].delete(subjectId);
    } else {
      dailyProgress.value[today].add(subjectId);
    }

    try {
      await axios.post('/progress/toggle', {
        user_id: userStore.userId,
        schedule_item_id: subjectId,
      });
    } catch (error) {
      console.error("Falha ao sincronizar o toggle com o servidor:", error);
      // Desfaz a mudança na UI em caso de erro
      if (dailyProgress.value[today].has(subjectId)) {
        dailyProgress.value[today].delete(subjectId);
      } else {
        dailyProgress.value[today].add(subjectId);
      }
      alert("Não foi possível salvar seu progresso.");
    }
  }

  function isCompleted(subjectId) {
    const today = getTodayDateString();
    return dailyProgress.value[today]?.has(subjectId) || false;
  }

  async function syncProgressWithStudyRecords() {
    const userStore = useUserStore();
    if (!userStore.userId) return;
    
    // A função agora confia que a userStore.todayStudyRecords já está atualizada.
    const todayRecords = userStore.todayStudyRecords;
    const today = getTodayDateString();

    if (todayRecords.length === 0 && (!dailyProgress.value[today] || dailyProgress.value[today].size === 0)) {
        console.log("Nenhum registro de estudo ou progresso para sincronizar. Saindo.");
        
        // Se não há registros, garante que o progresso do dia seja limpo no backend
        await axios.post('/progress/sync', {
            user_id: userStore.userId,
            date: today,
            completed_ids: [], // Envia um array vazio para limpar
        });
        await loadDailyProgress(); // Recarrega o estado limpo
        return;
    }
    
    // O weeklyPlan já está na memória, não precisa recarregar.
    const todayDayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
    const dayPlan = weeklyPlan.value.find(d => d.day === todayDayName);

    if (!dayPlan || dayPlan.subjects.length === 0) {
      return;
    }
    
    const recordsToCheck = [...todayRecords];
    const completedIds = [];
    
    dayPlan.subjects.forEach(subjectInstance => {
        const recordIndex = recordsToCheck.findIndex(record => record.subjectName === subjectInstance.name);
        if (recordIndex !== -1) {
            completedIds.push(subjectInstance.id);
            recordsToCheck.splice(recordIndex, 1);
        }
    });

    try {
        await axios.post('/progress/sync', {
            user_id: userStore.userId,
            date: today,
            completed_ids: completedIds,
        });
        
        await loadDailyProgress();
        console.log("Progresso sincronizado com sucesso.");

    } catch (error) {
        console.error("Erro ao sincronizar progresso com o servidor:", error);
    }
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
    syncProgressWithStudyRecords,
  };
});