import * as AuthService from '../services/AuthService';
import { defineStore } from 'pinia';
// import { useAuth } from 'vue-clerk';
import axios from 'axios';
import { auth } from '../firebase';
import { updateProfile } from "firebase/auth";

import { useSubjectStore } from './useSubjectStore';
import { useTimerStore } from './useTimerStore';
import { useStudyStore } from './useStudyStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    userId: null,
    userName: null,
    careerId: null,
    careerName: '',
    userSubjects: [],
    subjects:[],
    userStudyRecords: [],
  }),
  actions: {
    // async fetchToken() {
    //   const { getToken, isSignedIn } = useAuth();
    //   try {
    //     if (isSignedIn.value) {
    //       const token = await getToken.value();
    //       this.token = token;
    //       localStorage.setItem('token', token); // Armazena localmente para persistência
    //       console.log("Token obtido no useUserStore:", token);
    //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configura cabeçalhos globais
    //     } else {
    //       console.warn("Usuário não está autenticado.");
    //     }
    //   } catch (error) {
    //     console.error("Erro ao buscar o token:", error);
    //   }
    // },
    async initializeUser() {
      // await this.fetchToken();
      await this.fetchUserId();
    },
    async fetchUserId() {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          this.userId = user.uid;
          this.userName = user.displayName;
          localStorage.setItem('userId', this.userId);
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },
    async login({ email, password }){
      await AuthService.login(email, password);
    },
    async register({ email, password, name }) {
      const userCredential = await AuthService.register(email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
    },
    async loginWithGoogle(){
      await AuthService.loginWithGoogle();
    },
    async logout(){
      await AuthService.logout();
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
      this.careerName = careerName;
    
      const userCareerData = {
        user_id: this.userId,
        career_id: careerId,
      };
    
      try {
        const response = await axios.post('user-career', userCareerData);
    
        if (response.status === 200 || response.status === 201) {
          return { success: true, message: response.data.message };
        } else {
          return { success: false, message: 'Não foi possível salvar a carreira. Tente novamente.' };
        }
      } catch (error) {
        console.error("Erro ao salvar a carreira no banco de dados:", error);
        return {
          success: false,
          message: error.response?.data?.message || 'Erro ao comunicar com o servidor. Verifique sua conexão.',
        };
      }
    },
    async checkUserCareer() {
      try {
        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira
        const response = await axios.get(`user-career/${this.userId}`);
        this.careerId = response.data?.career_id || null;

        if(!this.careerId){
          console.warn("Usuário sem carreira registrada.");
          return false;
        }
    
        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data?.career_name || null;

        return true;
      } catch (error) {
        if(error.response && error.response.status === 404){
          console.warn("usuário sem carreira registrada.");
          this.careerId = null;
          this.careerName = null;
          return false;
        }
        console.error("Erro ao verificar carreira do usuário:", error);
        return false;
      }
    },
    async createUserSubject(subjectName) {
      try {
        const response = await axios.post('subjects', { name: subjectName });
    
        if (response.status === 201) {
          this.subjects.push(response.data);
          return { success: true, message: response.data.message };
        }
      } catch (error) {
        console.error("Erro ao salvar nova matéria:", error);
        
        if (error.response) {
          return { 
            success: false, 
            message: error.response.data.message || "Erro desconhecido frontend.", 
            errors: error.response.data.errors || null
          };
        }
        return { success: false, message: "Erro de conexão com o servidor."};
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
        // Se não há matérias, inicializa como array vazio
        if (error.response && error.response.status === 404) {
          this.userSubjects = [];
        }
      }
    },
    async saveUserSubjects(subjectIds) {
      const subjectsToDeactivate = this.userSubjects.filter(
        (id) => !subjectIds.includes(id)
      ); // Matérias desmarcadas

      const payload = {
        user_id: this.userId,
        subject_ids: subjectIds,
        subjects_to_deactivate: subjectsToDeactivate,
      };

      try {
        const response = await axios.post('user-subjects', payload);

        if (response.status === 200) {
          // this.userSubjects = subjectIds;
          return { success: true, message: response.data.message };
        }
      } catch (error) {
        console.error("Erro ao atribuir matérias ao usuário:", error);
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
          const subjectStore = useSubjectStore();
    
          // Aguarda o carregamento das matérias, caso ainda não tenham sido carregadas
          if (!subjectStore.subjects.length) {
            await subjectStore.fetchSubjects();
          }
    
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

        // console.log("Horas em segundos:", timeParts);
    
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
          correct_answers: 
            newRecord.totalQuestions && newRecord.incorrectAnswers !== undefined
              ? newRecord.totalQuestions - newRecord.incorrectAnswers
              : 0,
          incorrect_answers: newRecord.incorrectAnswers || 0,
          total_pauses: newRecord.totalPauses || 0,
          study_time: studyTimeInSeconds, // Agora em segundos
        };
    
        // Exibe o valor de estudo em segundos para verificar a conversão
        // console.log("Estudo em segundos:", studyTimeInSeconds);
    
        const response = await axios.post('user-study-records', payload);
        // console.log('Registro salvo com sucesso:', response.data);
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
    },
    todayStudyRecords(state) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      return state.userStudyRecords.filter(record => {
        if (!record.created_at) return false;
        const recordDate = new Date(record.created_at);
        return recordDate >= startOfToday && recordDate < endOfToday;
      });
    },
  }
});
