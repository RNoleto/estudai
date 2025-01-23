import { createRouter, createWebHistory } from 'vue-router';
import { initializeAuth, getAuthState } from '../services/AuthService';
import { useUserStore } from '../stores/useUserStore';
import Home from '../views/Home.vue';
import Career from '../views/CareerSelection.vue';
import Subjects from '../views/Subjects.vue';
import StudyCycle from '../views/StudyCycle.vue';
import StudyStart from '../views/StudyStart.vue';

import Dashboard from '../views/Dashboard.vue';
import DashboardHome from '../views/DashboardHome.vue';
import StudyHistory from '../views/StudyHistory.vue';

//Teste
import Test from '../views/Test.vue';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/carreiras',
    name: 'Carreiras',
    component: Career,
    meta: { requiresAuth: true },
  },
  {
    path: '/materias',
    name: 'Materias',
    component: Subjects,
    meta: { requiresAuth: true },
  },
  {
    path: '/ciclo-de-estudos',
    name: 'Ciclo',
    component: StudyCycle,
    meta: { requiresAuth: true },
  },
  {
    path: '/teste',
    name: 'Teste',
    component: Test,
  },
  {
    path: '/area-do-aluno',
    name: 'Dashboard',
    component: Dashboard,
    meta: {requiresAuth: true},
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome,
      },
      {
        path: 'estudar',
        name: 'Estudar',
        component: StudyStart,
      },
      {
        path: 'historico-de-estudos',
        name: 'Historico',
        component: StudyHistory,
      },
      {
        path: 'carreiras',
        name: 'DashboardCarreiras',
        component: Career,
      },
      {
        path: 'materias',
        name: 'DashboardMaterias',
        component: Subjects,
      },
      {
        path: 'ciclo-de-estudos',
        name: 'DashboardCiclo',
        component: StudyCycle,
      },
      {
        path: 'teste',
        name: 'DashboardTeste',
        component: Test,
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = initializeAuth();

  if (!auth.isLoaded.value) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (auth.isLoaded.value) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  const userStore = useUserStore();

  if (to.meta.requiresAuth && !auth.isSignedIn.value) {
    next({ path: '/' });
    return;
  }

  if (auth.isSignedIn.value) {
    try {
      await userStore.fetchUserId();
      const hasCareer = await userStore.checkUserCareer();
      await userStore.fetchUserSubjects();
      
      if (to.path === '/') { 

        if(!hasCareer){
          next({path: '/carreiras'});
          return;
        }

        if(userStore.userSubjects.length <= 0){
          next({path: '/materias'});
          return;
        }

        next({ path: '/area-do-aluno' });
        return;
      }
    } catch (error) {
      console.error("Erro durante a verificação de redirecionamento:", error);
      next(); // Continua a navegação em caso de erro inesperado
      return;
    }
  }

  next();
});

export default router;
