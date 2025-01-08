import { createRouter, createWebHistory } from 'vue-router';
import { initializeAuth, getAuthState } from '../services/AuthService';
import { useUserStore } from '../stores/useUserStore';
import Home from '../views/Home.vue';
import Career from '../views/CareerSelection.vue';
import Subjects from '../views/Subjects.vue';
import StudyCycle from '../views/StudyCycle.vue';
import StudyStart from '../views/StudyStart.vue';
import DashboardHome from '../views/DashboardHome.vue';

import Dashboard from '../views/Dashboard.vue';

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
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = initializeAuth();

  // Aguarda até que a autenticação esteja carregada
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

  // Verifica autenticação para rotas protegidas
  if (to.meta.requiresAuth && !auth.isSignedIn.value) {
    next({ path: '/' });
    return;
  }

  // Lógica de redirecionamento após o login
  if (auth.isSignedIn.value) {
    try {
      await userStore.fetchUserId();

      // Verifica a carreira do usuário
      const hasCareer = await userStore.checkUserCareer();
      if (!hasCareer) {
        next({ path: '/carreiras' }); // Redireciona para carreiras
        return;
      }

      // Verifica as matérias do usuário
      await userStore.fetchUserSubjects();
      if (!userStore.userSubjects.length) {
        next({ path: '/materias' }); // Redireciona para matérias
        return;
      }

      // Redireciona para a página inicial do Dashboard
      if (to.path === '/') {
        next({ path: '/area-do-aluno' });
        return;
      }
    } catch (error) {
      console.error("Erro durante a verificação de redirecionamento:", error);
      next(); // Continua a navegação em caso de erro
      return;
    }
  }

  next(); // Permite que a navegação continue
});



export default router;
