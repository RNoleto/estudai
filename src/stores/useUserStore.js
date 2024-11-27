import { defineStore } from 'pinia';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

import { useSubjectStore } from './useSubjectStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
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
        } else {
          console.error("Não foi possível obter o ID do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
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
// Adiciona uma ou mais matérias ao usuário
  async addUserSubjects(subjectIds) {
    try {
      const response = await axios.post('user-subjects', {
        user_id: this.userId,
        subject_ids: subjectIds,
      });
      if (response.status === 200) {
        this.userSubjects.push(...subjectIds);
        // console.log("Matérias adicionadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar matérias:", error);
    }
  },
  // Remove (desativa) uma matéria do usuário
  async removeUserSubject(subjectId) {
    try {
      const response = await axios.patch('user-subjects/deactivate', {
        user_id: this.userId,
        subject_id: subjectId,
      });
      if (response.status === 200) {
        this.userSubjects = this.userSubjects.filter(id => id !== subjectId);
        // console.log("Matéria desativada com sucesso!");
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
          subject_ids: subjectIds, // Todas as matérias selecionadas
          subjects_to_deactivate: subjectsToDeactivate, // Matérias a desativar
        };
    
        const response = await axios.post('user-subjects', payload);
    
        if (response.status === 200) {
          this.userSubjects = subjectIds; // Atualiza o estado local
          // console.log("Matérias atualizadas com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao salvar matérias do usuário:", error);
      }
    },
    //Função para retornar o historico de estudo do usuário
    async fetchUserStudyRecords() {
      if(!this.userId){
        console.error("ID do usuário não encontrado.");
        return;
      }
      
      try {
          const response = await axios.get(`user-study-records/user/${this.userId}`);
          // console.log('historico de estudos', response.data);
          if(response.status === 200){
            const subjectStore = useSubjectStore();

            this.userStudyRecords = response.data.map((record) => {
              const subject = subjectStore.subjects.find(
                (subject) => subject.id === record.subject_id
              );
              return {
                id: record.id,
                subjectId: record.subject_id,
                subjectName: subject?.name || "Matéria não encontrada", // Nome da matéria obtido do subjectStore
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
            // console.log("Registros de estudos carregados com sucesso!")
          }
      } catch (error) {
          console.error('Erro ao buscar registros de estudo do usuário:', error);
      }
    }, 
  },
  getters: {
    combinedSubjects(state) {
      const subjectStore = useSubjectStore();
      return state.userSubjects
        .map((id) => subjectStore.subjects.find((subject) => subject.id === id))
        .filter(Boolean);
    },
    // Percentual de respostas corretas considerando todos os registros de estudo
    correctAnswerPercentage: (state) => {
      // Filtra os registros com dados válidos e calcula o total de respostas corretas e resolvidas
      const totalQuestionsResolved = state.userStudyRecords.reduce((sum, record) => sum + (record.questionsResolved || 0), 0);
      const totalCorrectAnswers = state.userStudyRecords.reduce((sum, record) => sum + (record.correctAnswers || 0), 0);
  
      if (totalQuestionsResolved > 0) {
        return (totalCorrectAnswers / totalQuestionsResolved) * 100;
      }
      return 0; // Retorna 0 caso não haja perguntas resolvidas
    },
    
    // Percentual de respostas incorretas considerando todos os registros de estudo
    incorrectAnswerPercentage: (state) => {
      const totalQuestionsResolved = state.userStudyRecords.reduce((sum, record) => sum + (record.questionsResolved || 0), 0);
      const totalCorrectAnswers = state.userStudyRecords.reduce((sum, record) => sum + (record.correctAnswers || 0), 0);
      const totalIncorrectAnswers = totalQuestionsResolved - totalCorrectAnswers;
  
      if (totalQuestionsResolved > 0) {
        return (totalIncorrectAnswers / totalQuestionsResolved) * 100;
      }
      return 0; // Retorna 0 caso não haja perguntas resolvidas
    }
  }
});
