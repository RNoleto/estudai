import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';

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
        let parsedPlan = JSON.parse(savedPlan);
      
        // [VERIFICAÇÃO DE SEGURANÇA]
        // Garante que cada instância de matéria tenha um ID único.
        // Isso corrige dados antigos e previne bugs futuros.
        let idCounter = Date.now();
        parsedPlan.forEach(day => {
          if (day.subjects) {
            day.subjects.forEach(subject => {
              // Se o ID não for único (ou não existir), gera um novo.
              // Para simplificar, estamos gerando um novo ID para todos ao carregar.
              subject.id = idCounter++;
            });
          }
        });
        // Fim da verificação
      
        weeklyPlan.value = parsedPlan;
      }
    
      setTimeout(() => {
        isLoading.value = false;
        console.log("Cronograma carregado.");
        resolve();
      }, 200);
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