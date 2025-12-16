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
    isPremium: false,
    premiumExpiresAt: null,
    userSubjects: [],
    subjects: [],
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
      await this.fetchUserData();
    },
    // Buscar o ID do usuário atual do Firebase Auth
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
    //Buscar dados do usuario no banco de dados usando o ID do Firebase(firebase_uid)
    async fetchUserData() {
      if (!this.userId) {
        this.userId = localStorage.getItem('userId');
      }

      if (!this.userId) {
        console.warn("Impossível buscar dados: ID do usuário não encontrado.");
        return;
      }

      try {
        const userFirebaseUid = this.userId; 
        const response = await axios.get(`user/${userFirebaseUid}`);
        
        const userData = response.data;
        
        this.isPremium = Boolean(userData.is_premium);
        this.premiumExpiresAt = userData.premium_expires_at;

      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    },
    async login({ email, password }) {
      await AuthService.login(email, password);
    },
    async register({ email, password, name }) {
      const userCredential = await AuthService.register(email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      const idToken = await userCredential.user.getIdToken();
      try {
        const response = await axios.post('/users/sync-on-register', {},
          {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          }
        );
        console.log('Usuário sincronizado com o backend:', response.data.message);
      } catch (error) {
        console.error('Erro ao sincronizar usuário com o backend:', error.response?.data || error);
      }
    },
    async loginWithGoogle() {
      await AuthService.loginWithGoogle();
    },
    async logout() {
      await AuthService.logout();
    },
    clearUserData() {
      // Limpa as propriedades do usuário no Pinia
      this.userId = null;
      this.careerId = null;
      this.careerName = '';
      this.userSubjects = [];
      this.userStudyRecords = [];
      this.isPremium = false;
      this.premiumExpiresAt = null;
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
    async checkUserCareer(forceRefresh = false) {
      if (this.careerId && this.careerName && !forceRefresh) {
            return true;
      }
      try {
        // Fazendo uma requisição para o backend Laravel para verificar se já existe uma carreira
        const response = await axios.get(`user-career/${this.userId}`);
        this.careerId = response.data?.career_id || null;

        if (!this.careerId) {
          console.warn("Usuário sem carreira registrada.");
          return false;
        }

        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data?.career_name || null;

        return true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
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
        return { success: false, message: "Erro de conexão com o servidor." };
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
    async fetchUserSubjects(forceRefresh = false) {
      if(this.userSubjects.length > 0 && !forceRefresh) {
        console.log("Cache de Matérias utilizado. Nenhuma requisição feita.")
        return; // Já carregado, não faz nada
      }
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
    // async fetchUserStudyRecords(forceRefresh = false) {
    //   if (this.userStudyRecords.length > 0 && !forceRefresh) {
    //       console.log("Cache de Histórico utilizado.");
    //       return;
    //    }
    //   if (!this.userId) {
    //     console.error("ID do usuário não encontrado.");
    //     return;
    //   }

    //   try {
    //     const response = await axios.get(`user-study-records/user/${this.userId}`);

    //     if (response.status === 200) {
    //       const subjectStore = useSubjectStore();

    //       // Aguarda o carregamento das matérias, caso ainda não tenham sido carregadas
    //       if (!subjectStore.subjects.length) {
    //         await subjectStore.fetchSubjects();
    //       }

    //       const activeRecords = response.data.filter(record => record.ativo === 1);

    //       this.userStudyRecords = activeRecords.map((record) => {
    //         const subject = subjectStore.subjects.find(sub => sub.id === record.subject_id);
    //         return {
    //           ...record,
    //           subjectName: subject ? subject.name : "Matéria não encontrada",
    //         };
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Erro ao carregar registros de estudo do usuário fetchUserStudyRecords:", error);
    //   }
    // },
    //Versão otimizada do fetchUserStudyRecords com cache
    async fetchUserStudyRecords(forceRefresh = false) {
      if (!this.userId) return;
    
      if (this.userStudyRecords.length > 0 && !forceRefresh) {
          console.log("Usando cache de histórico de estudos.");
          return; 
      }

      try {
        const response = await axios.get(`user-study-records/user/${this.userId}`);
    
        if (response.status === 200) {
          const subjectStore = useSubjectStore();
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
        console.error("Erro ao carregar registros:", error);
      }
    },
    // async saveUserStudyRecord(newRecord) {
    //   const timerStore = useTimerStore();
    //   const studyStore = useStudyStore();

    //   if (!this.userId) {
    //     console.error("ID do usuário não encontrado.");
    //     return;
    //   }

    //   let studyTimeInSeconds = 0;

    //   // Verificar se o tempo de estudo foi passado manualmente
    //   if (newRecord.totalStudyTime) {
    //     const timeParts = newRecord.totalStudyTime.split(':');
    //     let hoursInSeconds = 0;
    //     let minutesInSeconds = 0;
    //     let seconds = 0;

    //     // Verificar se o formato é "HH:MM:SS" ou "MM:SS"
    //     if (timeParts.length === 3) {
    //       // Formato "HH:MM:SS"
    //       hoursInSeconds = parseInt(timeParts[0]) * 3600; // Converte horas para segundos
    //       minutesInSeconds = parseInt(timeParts[1]) * 60; // Converte minutos para segundos
    //       seconds = parseInt(timeParts[2]); // Converte segundos diretamente
    //     } else if (timeParts.length === 2) {
    //       // Formato "MM:SS"
    //       minutesInSeconds = parseInt(timeParts[0]) * 60; // Converte minutos para segundos
    //       seconds = parseInt(timeParts[1]); // Converte segundos diretamente
    //     }

    //     // console.log("Horas em segundos:", timeParts);

    //     // Soma os valores em segundos
    //     studyTimeInSeconds = hoursInSeconds + minutesInSeconds + seconds;
    //   } else if (newRecord.study_time) {
    //     // Caso o tempo venha diretamente como número (em segundos)
    //     studyTimeInSeconds = Math.floor(newRecord.study_time); // Garantir que é um número inteiro de segundos
    //   } else {
    //     console.error("Tempo de estudo não fornecido.");
    //     return;
    //   }

    //   try {
    //     const payload = {
    //       user_id: this.userId,
    //       subject_id: newRecord.subject_id || studyStore.subject,
    //       topic: newRecord.topic || studyStore.topic,
    //       questions_resolved: newRecord.totalQuestions || 0,
    //       correct_answers:
    //         newRecord.totalQuestions && newRecord.incorrectAnswers !== undefined
    //           ? newRecord.totalQuestions - newRecord.incorrectAnswers
    //           : 0,
    //       incorrect_answers: newRecord.incorrectAnswers || 0,
    //       total_pauses: newRecord.totalPauses || 0,
    //       study_time: studyTimeInSeconds, // Agora em segundos
    //     };

    //     // Exibe o valor de estudo em segundos para verificar a conversão
    //     // console.log("Estudo em segundos:", studyTimeInSeconds);

    //     const response = await axios.post('user-study-records', payload);
    //     // console.log('Registro salvo com sucesso:', response.data);
    //   } catch (error) {
    //     console.error("Erro ao salvar os dados de estudos no banco de dados:", error);
    //   }
    // },
    //Versão otimizada do saveUserStudyRecord para atualizar localmente o Pinia
    async saveUserStudyRecord(newRecord) {
      const timerStore = useTimerStore();
      const studyStore = useStudyStore();
      const subjectStore = useSubjectStore(); // <--- Importante para pegar o nome da matéria

      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }

      // --- (Sua lógica de cálculo de tempo permanece IGUAL) ---
      let studyTimeInSeconds = 0;
      if (newRecord.totalStudyTime) {
        const timeParts = newRecord.totalStudyTime.split(':');
        let hoursInSeconds = 0, minutesInSeconds = 0, seconds = 0;
        if (timeParts.length === 3) {
          hoursInSeconds = parseInt(timeParts[0]) * 3600;
          minutesInSeconds = parseInt(timeParts[1]) * 60;
          seconds = parseInt(timeParts[2]);
        } else if (timeParts.length === 2) {
          minutesInSeconds = parseInt(timeParts[0]) * 60;
          seconds = parseInt(timeParts[1]);
        }
        studyTimeInSeconds = hoursInSeconds + minutesInSeconds + seconds;
      } else if (newRecord.study_time) {
        studyTimeInSeconds = Math.floor(newRecord.study_time);
      } else {
        return;
      }
      // -------------------------------------------------------

      try {
        const payload = {
          user_id: this.userId,
          subject_id: newRecord.subject_id || studyStore.subject,
          topic: newRecord.topic || studyStore.topic,
          questions_resolved: newRecord.totalQuestions || 0,
          correct_answers: newRecord.totalQuestions && newRecord.incorrectAnswers !== undefined
            ? newRecord.totalQuestions - newRecord.incorrectAnswers
            : 0,
          incorrect_answers: newRecord.incorrectAnswers || 0,
          total_pauses: newRecord.totalPauses || 0,
          study_time: studyTimeInSeconds,
        };

        // 1. Envia para o Backend
        const response = await axios.post('user-study-records', payload);

        // 2. OTIMIZAÇÃO AQUI: Atualiza a lista LOCALMENTE sem buscar tudo de novo
        if (response.data) {
            // O Laravel geralmente retorna o objeto criado. Vamos usá-lo.
            // Se o Laravel retornar apenas { message: 'ok' }, você terá que montar o objeto manualmente com 'payload'
            
            // Precisamos encontrar o nome da matéria para exibir na tabela
            // (pois o banco só salvou o ID, mas a tabela quer o Nome)
            const subjectId = payload.subject_id;
            const subjectObj = subjectStore.subjects.find(s => s.id === subjectId);
            
            // Cria o objeto visualmente completo
            const newLocalRecord = {
                ...response.data, // Dados que vieram do banco (id, created_at, etc)
                ...payload,       // Dados que acabamos de enviar
                subjectName: subjectObj ? subjectObj.name : 'Matéria Nova',
                ativo: 1          // Garante que aparece na lista
            };

            // Adiciona ao array local do Pinia
            this.userStudyRecords.push(newLocalRecord);
            
            console.log("Registro adicionado localmente com sucesso!");
        }

      } catch (error) {
        console.error("Erro ao salvar os dados de estudos:", error);
      }
    },
    async updateUserStudyRecord(recordId, updatedData) {
      if (!this.userId) return;
    
      const payload = {
        user_id: this.userId,
        subject_id: updatedData.subject_id,
        topic: updatedData.topic,
        study_time: updatedData.study_time,
        total_pauses: updatedData.total_pauses,
        questions_resolved: updatedData.questions_resolved,
        correct_answers: updatedData.correct_answers,
        incorrect_answers: updatedData.incorrect_answers
      };
    
      const response = await axios.put(`user-study-records/${recordId}`, payload);
    
      // 🔥 ATUALIZA LOCAL
      const index = this.userStudyRecords.findIndex(r => r.id === recordId);
    
      if (index !== -1) {
        this.userStudyRecords[index] = {
          ...this.userStudyRecords[index],
          ...payload
        };
      }
    
      return response.data;
    },
    // async deleteUserStudyRecord(recordId) {

    //   if (!recordId) {
    //     console.error("ID do registro de estudo não fornecido.");
    //     return;
    //   }
    //   try {
    //     const response = await axios.delete(`user-study-records/${recordId}`);
    //     return response.data;

    //   } catch (error) {
    //     console.error("Erro ao deletar o registro de estudo:", error.response?.data || error.message);
    //     throw error;
    //   }
    // },
    //Versão otimizada do deleteUserStudyRecord que atualiza localmente o Pinia
    async deleteUserStudyRecord(recordId) {
      if (!recordId) {
        console.error("ID do registro de estudo não fornecido.");
        return;
      }

      try {
        // 1. Deleta no Backend
        const response = await axios.delete(`user-study-records/${recordId}`);

        // 2. OTIMIZAÇÃO AQUI: Atualiza a lista LOCALMENTE
        // Filtramos a lista para manter apenas os registros cujo ID seja DIFERENTE do ID deletado
        this.userStudyRecords = this.userStudyRecords.filter(
            (record) => record.id !== recordId
        );

        console.log("Registro removido da lista local.");

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