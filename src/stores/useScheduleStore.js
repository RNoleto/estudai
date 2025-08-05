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

// Retorna a data de início (Segunda) e fim (Domingo) da semana atual
function getWeekRange() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb

  const startOfWeek = new Date(today);
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuste para a Segunda
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo é 6 dias depois

  return {
    start: startOfWeek.toISOString().split('T')[0],
    end: endOfWeek.toISOString().split('T')[0],
  };
}

// Retorna a data em formato 'AAAA-MM-DD' para um dia específico da semana atual
function getDateStringForDay(dayName) {
  const weekRange = getWeekRange();
  const startDate = new Date(weekRange.start + 'T00:00:00');
  const dayMap = { 'Segunda-feira': 0, 'Terça-feira': 1, 'Quarta-feira': 2, 'Quinta-feira': 3, 'Sexta-feira': 4, 'Sábado': 5, 'Domingo': 6 };
  const dayOffset = dayMap[dayName] ?? 0;
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + dayOffset);
  return targetDate.toISOString().split('T')[0];
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

  const userStore = useUserStore();

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

  async function loadWeeklyProgress() {
    if (!userStore.userId) return;
    const { start, end } = getWeekRange();
    try {
        const response = await axios.get(`/progress/${userStore.userId}`, {
            // [CORREÇÃO] O backend agora espera 'startDate' e 'endDate'
            params: { startDate: start, endDate: end }
        });
        const newProgress = {};
        response.data.forEach(progressItem => {
            const date = progressItem.completion_date;
            if (!newProgress[date]) {
                newProgress[date] = new Set();
            }
            newProgress[date].add(progressItem.schedule_item_id);
        });
        dailyProgress.value = newProgress;
    } catch (error) {
        console.error("Erro ao carregar o progresso semanal:", error);
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

  function isCompleted(subjectId, dayName) {
    const dateString = getDateStringForDay(dayName);
    return dailyProgress.value[dateString]?.has(subjectId) || false;
  }

  async function syncProgressWithStudyRecords() {
    if (!userStore.userId) return;
    await userStore.fetchUserStudyRecords();
    
    const todayRecords = userStore.todayStudyRecords;
    const today = getDateStringForDay(new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase()));

    if (todayRecords.length === 0 && (!dailyProgress.value[today] || dailyProgress.value[today].size === 0)) {
        await axios.post('/progress/sync', {
            user_id: userStore.userId,
            date: today,
            completed_ids: [],
        });
        await loadWeeklyProgress(); // ✅ CHAMA A FUNÇÃO CORRETA
        return;
    }
    
    await loadWeekPlan();
    const todayDayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
    const dayPlan = weeklyPlan.value.find(d => d.day === todayDayName);
    if (!dayPlan || dayPlan.subjects.length === 0) return;
    
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
        await loadWeeklyProgress(); // ✅ CHAMA A FUNÇÃO CORRETA
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
    }
  }

  return {
    weeklyPlan,
    isLoading,
    loadWeekPlan,
    saveWeeklyPlan,
    dailyProgress,
    loadWeeklyProgress,
    toggleCompletion,
    isCompleted,
    syncProgressWithStudyRecords,
  };
});