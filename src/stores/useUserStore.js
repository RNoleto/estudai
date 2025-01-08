import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

import { useSubjectStore } from './useSubjectStore';
import { useTimerStore } from './useTimerStore';
import { useStudyStore } from './useStudyStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null, // Recupera do localStorage
    careerId: null,
    careerName: '',
    userSubjects: [],
    userStudyRecords: [],
  }),
  actions: {
    async initializeUser() {
      await this.fetchUserId();
    },
    async fetchUserId() {
      try {
        const { userId } = useAuth();
        this.userId = userId.value; // Armazena o ID do usuário no Pinia
        if (this.userId) {
          localStorage.setItem('userId', this.userId);
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },
    clearUserData() {
      // Limpa as propriedades do usuário no Pinia
      this.userId = null;
      this.careerId = null;
      this.careerName = '';
      this.userSubjects = [];
      this.userStudyRecords = [];
    },
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

      } catch (error) {
        console.error("Erro ao salvar a carreira no banco de dados:", error);
      }
    },
    async checkUserCareer() {
      try {
        if (!this.userId) {
          console.error("ID do usuário não encontrado em checkUserCareer.");
          return false;
        }
    
        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira
        const response = await axios.get(`user-career/${this.userId}`);
        this.careerId = response.data.career_id;
    
        if (!this.careerId) {
          console.warn("Nenhuma carreira atribuída ao usuário checkUserCareer.");
          return false;
        }
    
        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data.career_name;
    
        return true;
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
    async fetchUserStudyRecords() {
      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }

      try {
        const response = await axios.get(`user-study-records/user/${this.userId}`);

        if (response.status === 200) {
          const subjectStore = useSubjectStore(); // Obtém o subjectStore para acesso às matérias

          const activeRecords = response.data.filter(record => record.ativo === 1);

          this.userStudyRecords = activeRecords.map((record) => {
            const subject = subjectStore.subjects.find(sub => sub.id === record.subject_id);
            return {
              ...record,
              subjectName: subject ? subject.name : "Matéria não encontrada",
            };
          });
        }
      } catch (error) {
        console.error("Erro ao carregar registros de estudo do usuário fetchUserStudyRecords:", error);
      }
    },
    async saveUserStudyRecord(newRecord) {
      const timerStore = useTimerStore();
      const studyStore = useStudyStore();
    
      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }
    
      let studyTimeInSeconds = 0;
    
      // Verificar se o tempo de estudo foi passado manualmente
      if (newRecord.totalStudyTime) {
        const timeParts = newRecord.totalStudyTime.split(':');
        let hoursInSeconds = 0;
        let minutesInSeconds = 0;
        let seconds = 0;
    
        // Verificar se o formato é "HH:MM:SS" ou "MM:SS"
        if (timeParts.length === 3) {
          // Formato "HH:MM:SS"
          hoursInSeconds = parseInt(timeParts[0]) * 3600; // Converte horas para segundos
          minutesInSeconds = parseInt(timeParts[1]) * 60; // Converte minutos para segundos
          seconds = parseInt(timeParts[2]); // Converte segundos diretamente
        } else if (timeParts.length === 2) {
          // Formato "MM:SS"
          minutesInSeconds = parseInt(timeParts[0]) * 60; // Converte minutos para segundos
          seconds = parseInt(timeParts[1]); // Converte segundos diretamente
        }

        console.log("Horas em segundos:", timeParts);
    
        // Soma os valores em segundos
        studyTimeInSeconds = hoursInSeconds + minutesInSeconds + seconds;
      } else if (newRecord.study_time) {
        // Caso o tempo venha diretamente como número (em segundos)
        studyTimeInSeconds = Math.floor(newRecord.study_time); // Garantir que é um número inteiro de segundos
      } else {
        console.error("Tempo de estudo não fornecido.");
        return;
      }
    
      try {
        const payload = {
          user_id: this.userId,
          subject_id: newRecord.subject_id || studyStore.subject,
          topic: newRecord.topic || studyStore.topic,
          questions_resolved: newRecord.totalQuestions || 0,
          correct_answers: newRecord.correctAnswers || 0,
          incorrect_answers:
            newRecord.totalQuestions && newRecord.correctAnswers !== undefined
              ? newRecord.totalQuestions - newRecord.correctAnswers
              : 0,
          total_pauses: newRecord.totalPauses || 0,
          study_time: studyTimeInSeconds, // Agora em segundos
        };
    
        // Exibe o valor de estudo em segundos para verificar a conversão
        console.log("Estudo em segundos:", studyTimeInSeconds);
    
        const response = await axios.post('user-study-records', payload);
        console.log('Registro salvo com sucesso:', response.data);
      } catch (error) {
        console.error("Erro ao salvar os dados de estudos no banco de dados:", error);
      }
    },        
    async updateUserStudyRecord(recordId, updatedData) {

      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }

      try {
        const payload = {
          user_id: this.userId, // Mantém o ID do usuário
          subject_id: updatedData.subject_id, // Atualiza o ID do assunto
          topic: updatedData.topic, // Atualiza o tópico, se necessário
          study_time: updatedData.study_time, // Valor imutável vindo do backend
          total_pauses: updatedData.total_pauses, // Valor imutável vindo do backend
          questions_resolved: updatedData.questions_resolved, // Atualiza questões resolvidas
          correct_answers: updatedData.correct_answers, // Atualiza respostas corretas
          incorrect_answers: updatedData.incorrect_answers // Atualiza respostas incorretas
        };

        const response = await axios.put(`user-study-records/${recordId}`, payload);

        return response.data; // Retorna os dados atualizados para uso
      } catch (error) {
        console.error("Erro ao atualizar os dados de estudos no banco de dados:", error);
        throw error; // Lança o erro para ser tratado no componente, se necessário
      }
    },
    async deleteUserStudyRecord(recordId) {

      if (!recordId) {
        console.error("ID do registro de estudo não fornecido.");
        return;
      }
      try {
        const response = await axios.delete(`user-study-records/${recordId}`);
        return response.data;

      } catch (error) {
        console.error("Erro ao deletar o registro de estudo:", error.response?.data || error.message);
        throw error;
      }
    },
    getCorrectAnswerPercentage(record) {
      if (!record.questions_resolved || record.questions_resolved === 0) return 0;
      return (record.correct_answers / record.questions_resolved) * 100;
    },
    getIncorrectAnswerPercentage(record) {
      if (!record.questions_resolved || record.questions_resolved === 0) return 0;
      return (record.incorrect_answers / record.questions_resolved) * 100;
    },
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
