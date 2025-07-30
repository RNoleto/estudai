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

  // --- ACTIONS ---

  // Carrega o MOLDE do cronograma
  async function loadWeekPlan() {
    const userStore = useUserStore();
    if (!userStore.userId) return;

    isLoading.value = true;
    try {
      const response = await axios.get(`schedule/${userStore.userId}`);
      const itemsFromDb = response.data;

      // Limpa o plano atual
      weeklyPlan.value.forEach(day => day.subjects = []);

      // [MAPA CORRIGIDO E SIMPLIFICADO]
      // O índice do array corresponde ao 'day_of_week' - 1
      // (Segunda=1 -> índice 0, Terça=2 -> índice 1, ..., Domingo=7 -> índice 6)
      const dayMap = [
        'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
      ];

      itemsFromDb.forEach(item => {
        // Acessa o nome do dia diretamente pelo índice
        const dayName = dayMap[item.day_of_week - 1];
        const dayObject = weeklyPlan.value.find(d => d.day === dayName);

        if (dayObject && item.subject) { // Adicionada verificação para 'item.subject'
          dayObject.subjects.push({
            id: item.id,
            name: item.subject.name,
            subject_id: item.subject_id
          });
        }
      });
    } catch (error) {
      console.error("Erro ao carregar o cronograma:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Salva o MOLDE do cronograma
  async function saveWeeklyPlan() {
    const userStore = useUserStore();
    if (!userStore.userId) return;

    isLoading.value = true;
    try {
      const payload = {
        user_id: userStore.userId,
        weeklyPlan: weeklyPlan.value.map(day => {
          const subjectsWithIds = day.subjects.map(subject => ({
            ...subject,
            subject_id: userStore.combinedSubjects.find(s => s.name === subject.name)?.id
          }))
            // [FILTRO DE SEGURANÇA]
            .filter(subject => subject.subject_id != null);

          return { ...day, subjects: subjectsWithIds };
        })
      };

      await axios.post('schedule', payload);
      await loadWeekPlan();
    } catch (error) {
      console.error("Erro ao salvar o cronograma:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // [NOVO] Carrega o PROGRESSO salvo
  function loadDailyProgress() {
    const savedProgress = localStorage.getItem('dailyProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      Object.keys(parsed).forEach(date => {
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

  function syncProgressWithStudyRecords() {
    const userStore = useUserStore();

    // [LÓGICA DE DATA CORRIGIDA] - Usa objetos Date para comparar, igual ao seu componente
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const todayRecords = userStore.userStudyRecords.filter(record => {
      if (!record.created_at) return false;
      const recordDate = new Date(record.created_at);
      return recordDate >= startOfToday && recordDate < endOfToday;
    });
    // Fim da lógica corrigida

    if (todayRecords.length === 0) {
      return;
    }

    const todayDayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
    const dayPlan = weeklyPlan.value.find(d => d.day === todayDayName);

    if (!dayPlan || dayPlan.subjects.length === 0) {
      return;
    }

    const today = getTodayDateString();
    if (!dailyProgress.value[today]) {
      dailyProgress.value[today] = new Set();
    }

    // A lógica a seguir para preencher os checks já está correta
    const recordsToCheck = [...todayRecords];
    dayPlan.subjects.forEach(subjectInstance => {
      const recordIndex = recordsToCheck.findIndex(record => record.subjectName === subjectInstance.name);
      if (recordIndex !== -1) {
        dailyProgress.value[today].add(subjectInstance.id);
        recordsToCheck.splice(recordIndex, 1);
      }
    });

    saveDailyProgress();
    console.log("Progresso do cronograma sincronizado com os registros de estudo.");
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