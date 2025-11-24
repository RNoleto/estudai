import { defineStore } from 'pinia';
import axios from 'axios';
import { auth } from '../firebase';
import { updateProfile } from "firebase/auth";
import * as AuthService from '../services/AuthService';

import { useSubjectStore } from './useSubjectStore';
import { useTimerStore } from './useTimerStore';
import { useStudyStore } from './useStudyStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    // Tenta recuperar do storage imediatamente para evitar delay no F5
    userId: localStorage.getItem('userId') || null,
    userName: null,
    careerId: null,
    careerName: '',
    
    // Status Premium
    isPremium: false,
    premiumExpiresAt: null,
    
    // Listas de dados
    userSubjects: [],
    subjects: [],
    userStudyRecords: [],
  }),

  actions: {
    // --- AUXILIAR: Atualiza dados do usuário (usado no Login e Registro) ---
    setUserData(userData) {
      if (!userData) return;
      this.isPremium = Boolean(userData.is_premium);
      this.premiumExpiresAt = userData.premium_expires_at;
      if (userData.name) this.userName = userData.name;
      console.log("Dados de usuário atualizados. Premium:", this.isPremium);
    },

    // --- INICIALIZAÇÃO ---
    async initializeUser() {
      await this.fetchUserId();
      // Se temos ID, buscamos o perfil completo (Premium, etc)
      if (this.userId) {
        await this.fetchUserProfile();
      }
    },

    async fetchUserId() {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          this.userId = user.uid;
          this.userName = user.displayName;
          localStorage.setItem('userId', this.userId);
        } else {
          // Fallback para F5
          const storedId = localStorage.getItem('userId');
          if (storedId) this.userId = storedId;
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    },

    // Busca dados do perfil no backend (Premium, Validade)
    async fetchUserProfile() {
      if (!this.userId) return;

      try {
        // Rota: GET /api/users/{firebase_uid}
        const response = await axios.get(`users/${this.userId}`);
        if (response.data) {
          this.setUserData(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        this.isPremium = false;
      }
    },

    // --- AUTENTICAÇÃO ---
    async login({ email, password }) {
      await AuthService.login(email, password);
      await this.initializeUser();
    },

    async register({ email, password, name }) {
      // 1. Cria no Firebase
      const userCredential = await AuthService.register(email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      this.userId = userCredential.user.uid;
      this.userName = name;
      localStorage.setItem('userId', this.userId);

      const idToken = await userCredential.user.getIdToken();
      
      try {
        // 2. Sincroniza com Laravel
        const response = await axios.post('/users/sync-on-register', {}, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        console.log('Sincronização:', response.data.message);

        // 3. OTIMIZAÇÃO: Usa os dados retornados para já definir o Premium sem nova requisição
        if (response.data.user) {
            this.setUserData(response.data.user);
        } else {
            await this.fetchUserProfile();
        }
      } catch (error) {
        console.error('Erro ao sincronizar usuário:', error.response?.data || error);
      }
    },

    async loginWithGoogle() {
      await AuthService.loginWithGoogle();
      await this.initializeUser();
    },

    async logout() {
      await AuthService.logout();
      this.clearUserData();
      localStorage.removeItem('userId');
    },

    clearUserData() {
      this.userId = null;
      this.careerId = null;
      this.careerName = '';
      this.userSubjects = [];
      this.userStudyRecords = [];
      this.isPremium = false;
      this.premiumExpiresAt = null;
    },

    // --- CARREIRAS ---
    async checkUserCareer(forceRefresh = false) {
      // Otimização de Cache
      if (this.careerId && this.careerName && !forceRefresh) {
        return true;
      }

      try {
        const response = await axios.get(`user-career/${this.userId}`);
        this.careerId = response.data?.career_id || null;

        if (!this.careerId) {
          return false;
        }

        const response_name = await axios.get(`user-career/career_name/${this.userId}`);
        this.careerName = response_name.data?.career_name || null;

        return true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.careerId = null;
          this.careerName = null;
          return false;
        }
        console.error("Erro ao verificar carreira:", error);
        return false;
      }
    },

    async saveUserCareer(careerId, careerName) {
      this.careerId = careerId;
      this.careerName = careerName;
      try {
        const response = await axios.post('user-career', {
          user_id: this.userId,
          career_id: careerId,
        });
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error("Erro ao salvar carreira:", error);
        return { success: false, message: error.response?.data?.message || 'Erro no servidor.' };
      }
    },

    // --- MATÉRIAS ---
    async fetchUserSubjects(forceRefresh = false) {
      if (!this.userId) return;

      // Otimização de Cache
      if (this.userSubjects.length > 0 && !forceRefresh) {
        console.log("Cache de Matérias utilizado.");
        return;
      }

      try {
        const response = await axios.get(`user-subjects/${this.userId}`);
        this.userSubjects = response.data.map((subject) => subject.subject_id);
      } catch (error) {
        console.error("Erro ao carregar matérias:", error);
        if (error.response && error.response.status === 404) {
          this.userSubjects = [];
        }
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
        console.error("Erro ao criar matéria:", error);
        return { success: false, message: "Erro ao criar matéria." };
      }
    },

    async saveUserSubjects(subjectIds) {
      const subjectsToDeactivate = this.userSubjects.filter(id => !subjectIds.includes(id));
      try {
        const response = await axios.post('user-subjects', {
          user_id: this.userId,
          subject_ids: subjectIds,
          subjects_to_deactivate: subjectsToDeactivate,
        });
        if (response.status === 200) {
          // Atualiza localmente para evitar refresh
          this.userSubjects = subjectIds; 
          return { success: true, message: response.data.message };
        }
      } catch (error) {
        console.error("Erro ao salvar matérias:", error);
      }
    },

    // --- REGISTROS DE ESTUDO ---
    async fetchUserStudyRecords(forceRefresh = false) {
      if (!this.userId) return;

      // Otimização de Cache
      if (this.userStudyRecords.length > 0 && !forceRefresh) {
        console.log("Usando cache de histórico de estudos.");
        return;
      }

      try {
        const response = await axios.get(`user-study-records/user/${this.userId}`);
        if (response.status === 200) {
          const subjectStore = useSubjectStore();
          if (!subjectStore.subjects.length) await subjectStore.fetchSubjects();

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

    async saveUserStudyRecord(newRecord) {
      const timerStore = useTimerStore();
      const studyStore = useStudyStore();
      const subjectStore = useSubjectStore();

      if (!this.userId) {
        console.error("ID do usuário não encontrado.");
        return;
      }

      // Pega a hora que o timer começou (Correção do problema da meia-noite)
      const customCreatedAt = timerStore.sessionStartTime || new Date().toISOString();

      // Cálculo de Tempo (Mantido)
      let studyTimeInSeconds = 0;
      if (newRecord.totalStudyTime) {
        const timeParts = newRecord.totalStudyTime.split(':');
        let h = 0, m = 0, s = 0;
        if (timeParts.length === 3) {
          h = parseInt(timeParts[0]) * 3600;
          m = parseInt(timeParts[1]) * 60;
          s = parseInt(timeParts[2]);
        } else if (timeParts.length === 2) {
          m = parseInt(timeParts[0]) * 60;
          s = parseInt(timeParts[1]);
        }
        studyTimeInSeconds = h + m + s;
      } else if (newRecord.study_time) {
        studyTimeInSeconds = Math.floor(newRecord.study_time);
      } else {
        return;
      }

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
          created_at: customCreatedAt // Envia a data corrigida
        };

        const response = await axios.post('user-study-records', payload);

        // Limpa a data de início do timer
        timerStore.sessionStartTime = null;

        // Atualização Otimista: Adiciona na lista local sem nova requisição
        if (response.data) {
          const subjectId = payload.subject_id;
          const subjectObj = subjectStore.subjects.find(s => s.id === subjectId);
          
          const newLocalRecord = {
            ...response.data, // Dados do banco (id, etc)
            ...payload,       // Dados locais
            subjectName: subjectObj ? subjectObj.name : 'Matéria Nova',
            ativo: 1
          };

          this.userStudyRecords.push(newLocalRecord);
          console.log("Registro adicionado localmente.");
        }
      } catch (error) {
        console.error("Erro ao salvar estudo:", error);
      }
    },

    async deleteUserStudyRecord(recordId) {
      if (!recordId) return;
      try {
        const response = await axios.delete(`user-study-records/${recordId}`);
        
        // Atualização Otimista: Remove da lista local
        this.userStudyRecords = this.userStudyRecords.filter(r => r.id !== recordId);
        console.log("Registro removido localmente.");
        
        return response.data;
      } catch (error) {
        console.error("Erro ao deletar registro:", error);
        throw error;
      }
    },

    // Mantém o update (geralmente usado em modais de edição)
    async updateUserStudyRecord(recordId, updatedData) {
      if (!this.userId) return;
      try {
        const payload = { ...updatedData, user_id: this.userId };
        const response = await axios.put(`user-study-records/${recordId}`, payload);
        // Se quiser ser perfeito, atualize o item no array local aqui também
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        throw error;
      }
    },

    // Getters de Estatísticas
    getCorrectAnswerPercentage(record) {
      if (!record.questions_resolved) return 0;
      return (record.correct_answers / record.questions_resolved) * 100;
    },
    getIncorrectAnswerPercentage(record) {
      if (!record.questions_resolved) return 0;
      return (record.incorrect_answers / record.questions_resolved) * 100;
    }
  },

  getters: {
    combinedSubjects(state) {
      const subjectStore = useSubjectStore();
      return state.userSubjects
        .map((id) => subjectStore.subjects.find((subject) => subject.id === id))
        .filter(Boolean);
    },
    todayStudyRecords(state) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      return state.userStudyRecords.filter(record => {
        if (!record.created_at) return false;
        
        // Ajuste de data para garantir comparação correta (opcional, dependendo do formato do banco)
        const recordDate = new Date(record.created_at);
        
        // Ajuste de fuso horário simples se necessário, mas geralmente Date() já resolve
        return recordDate >= startOfToday && recordDate < endOfToday;
      });
    },
    // ... outros getters se necessário ...
  }
});