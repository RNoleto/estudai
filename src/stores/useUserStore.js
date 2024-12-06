import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

import { useSubjectStore } from './useSubjectStore';
import { useTimerStore } from './useTimerStore';
import { useStudyStore } from './useStudyStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getItem('userId') || null, // Recupera do localStorage
    careerId: null,
    careerName: '',
    userSubjects: [],
    userStudyRecords: [],
  }),

  actions: {
    // Função para carregar o ID do usuário logado usando o Clerk
    async fetchUserId() {
      try {
        const { userId } = await useAuth();
        if (userId) {
          this.userId = userId.value; // Armazena o ID do usuário no estado
          localStorage.setItem('userId', userId.value); // Persiste no localStorage
        } else {
          console.error("Não foi possível obter o ID do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },
    clearUserData() {
      this.userId = null;
      localStorage.removeItem('userId'); // Remove do localStorage
    },
    // Função para salvar a carreira do usuário no banco de dados
    async saveUserCareer(careerId, careerName) {
      this.careerId = careerId;
      this.careerName = careerName; // Salve o nome da carreira também no Pinia

      // Lógica para enviar para o backend
      const userCareerData = {
        user_id: this.userId,
        career_id: careerId,
      };

      try {
        // Fazendo a requisição para o backend Laravel para salvar a carreira
        const response = await axios.post('user-career', userCareerData);

        if (response.status === 200) {
          localStorage.setItem('userCareerData', JSON.stringify(userCareerData));
          // console.log("Carreira armazenada no banco de dados com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao salvar a carreira no banco de dados:", error);
      }
    },
    // Função para verificar se o usuário já tem uma carreira salva
    async checkUserCareer() {
      try {
        if (!this.userId) {
          console.error("ID do usuário não encontrado");
          return false;
        }

        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira
        const response = await axios.get(`user-career/${this.userId}`);
        this.careerId = response.data.career_id;

        // Aqui, garantimos que o nome da carreira seja carregado
        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data.career_name;

        return true; // O usuário tem uma carreira atribuída
      } catch (error) {
        console.error("Erro ao verificar carreira do usuário:", error);
        return false;
      }
    },
    async addUserSubjects(subjectIds) {
      try {
        const response = await axios.post('user-subjects', {
          user_id: this.userId,
          subject_ids: subjectIds,
        });
        if (response.status === 200) {
          this.userSubjects.push(...subjectIds);
        }
      } catch (error) {
        console.error("Erro ao adicionar matérias:", error);
      }
    },
    async removeUserSubject(subjectId) {
      try {
        const response = await axios.patch('user-subjects/deactivate', {
          user_id: this.userId,
          subject_id: subjectId,
        });
        if (response.status === 200) {
          this.userSubjects = this.userSubjects.filter(id => id !== subjectId);
        }
      } catch (error) {
        console.error("Erro ao desativar matéria:", error);
      }
    },
    // Carrega as matérias do usuário do backend
    async fetchUserSubjects() {
      try {
        const response = await axios.get(`user-subjects/${this.userId}`);
        this.userSubjects = response.data.map((subject) => subject.subject_id);
      } catch (error) {
        console.error("Erro ao carregar matérias do usuário:", error);
      }
    },
    async saveUserSubjects(subjectIds) {
      try {
        const subjectsToDeactivate = this.userSubjects.filter(
          (id) => !subjectIds.includes(id)
        ); // Matérias desmarcadas

        const payload = {
          user_id: this.userId,
          subject_ids: subjectIds,
          subjects_to_deactivate: subjectsToDeactivate,
        };

        const response = await axios.post('user-subjects', payload);

        if (response.status === 200) {
          this.userSubjects = subjectIds;
        }
      } catch (error) {
        console.error("Erro ao salvar matérias do usuário:", error);
      }
    },
    //Função para retornar o historico de estudo do usuário
    async fetchUserStudyRecords() {
      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }
    
      try {
        const response = await axios.get(`user-study-records/user/${this.userId}`);
        
        if (response.status === 200) {
          const subjectStore = useSubjectStore(); // Obtém o subjectStore para acesso às matérias
    
          this.userStudyRecords = response.data.map((record) => {
            const subject = subjectStore.subjects.find(sub => sub.id === record.subject_id);
            return {
              id: record.id,
              subjectId: record.subject_id,
              subjectName: subject?.name || "Matéria não encontrada", // Nome da matéria
              topic: record.topic,
              studyTime: record.study_time,
              totalPauses: record.total_pauses,
              questionsResolved: record.questions_resolved,
              correctAnswers: record.correct_answers,
              incorrectAnswers: record.incorrect_answers,
              createdAt: record.created_at,
              updatedAt: record.updated_at,
            };
          });
        }
      } catch (error) {
        console.error('Erro ao buscar registros de estudo do usuário:', error);
      }
    },
    //Função para salvar o historico de estudo do usuário
    async saveUserStudyRecord(newRecord) {
      console.log("Função saveUserStudyRecord foi chamada!"); // Confirmação inicial
      const timerStore = useTimerStore();
      const studyStore = useStudyStore();

      if (!this.userId) {
        console.error("ID do usuário não encontrado.")
        return;
      }

      const timeParts = newRecord.totalStudyTime.split(':'); // Divide a string em horas e minutos
      const studyTimeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]); // Converte para minutos

      try {
        const payload = {
          user_id: this.userId,
          subject_id: studyStore.subject,
          topic: studyStore.topic, //falta aqui
          questions_resolved: newRecord.totalQuestions,
          correct_answers: newRecord.correctAnswers,
          incorrect_answers: newRecord.totalQuestions - newRecord.correctAnswers,
          total_pauses: newRecord.totalPauses,
          study_time: studyTimeInMinutes,
        }

        const response = await axios.post('user-study-records', payload);

        console.log("Dados salvos no banco de dados com sucesso:", response);
      } catch (error) {
        console.error("Erro ao salvar no dados de estudos banco de dados:", error);
      }
    },
    getCorrectAnswerPercentage(record) {
      const { questionsResolved, correctAnswers } = record;

      if (questionsResolved > 0) {
        return (correctAnswers / questionsResolved) * 100;
      }
      return 0; // Retorna 0 caso não haja perguntas resolvidas
    },
    getIncorrectAnswerPercentage(record) {
      const { questionsResolved, correctAnswers } = record;

      if (questionsResolved > 0) {
        const incorrectAnswers = questionsResolved - correctAnswers;
        return (incorrectAnswers / questionsResolved) * 100;
      }
      return 0; // Retorna 0 caso não haja perguntas resolvidas
    }
  },
  getters: {
    combinedSubjects(state) {
      const subjectStore = useSubjectStore();
      return state.userSubjects
        .map((id) => subjectStore.subjects.find((subject) => subject.id === id))
        .filter(Boolean);
    },
    correctAnswerPercentage: (state) => {
      const totalQuestionsResolved = state.userStudyRecords.reduce((sum, record) => sum + (record.questionsResolved || 0), 0);
      const totalCorrectAnswers = state.userStudyRecords.reduce((sum, record) => sum + (record.correctAnswers || 0), 0);

      if (totalQuestionsResolved > 0) {
        return (totalCorrectAnswers / totalQuestionsResolved) * 100;
      }
      return 0; // Retorna 0 caso não haja perguntas resolvidas
    },
    incorrectAnswerPercentage: (state) => {
      const totalQuestionsResolved = state.userStudyRecords.reduce((sum, record) => sum + (record.questionsResolved || 0), 0);
      const totalCorrectAnswers = state.userStudyRecords.reduce((sum, record) => sum + (record.correctAnswers || 0), 0);
      const totalIncorrectAnswers = totalQuestionsResolved - totalCorrectAnswers;

      if (totalQuestionsResolved > 0) {
        return (totalIncorrectAnswers / totalQuestionsResolved) * 100;
      }
      return 0;
    }
  }
});
