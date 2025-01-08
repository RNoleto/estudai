import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from 'vue-clerk';
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
  const { isSignedIn, isLoaded } = useAuth();
  const userStore = useUserStore();

  // Aguarda até que a autenticação esteja carregada
  if (!isLoaded.value) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (isLoaded.value) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  // Verifica autenticação para rotas protegidas
  if (to.meta.requiresAuth && !isSignedIn.value) {
    next({ path: '/' });
    return;
  }

  // Verifica se o usuário está logado e precisa de redirecionamento após o login
  if (isSignedIn.value && to.path === '/') {
    try {
      // Carrega o userId
      if (!userStore.userId) {
        await userStore.fetchUserId();
      }

      // Verifica a carreira do usuário
      const hasCareer = await userStore.checkUserCareer();

      if (hasCareer) {
        // Carrega as matérias do usuário
        await userStore.fetchUserSubjects();
        if (userStore.userSubjects.length > 0) {
          // Redireciona para dashboard
          next({ path: '/area-do-aluno' });
          return;
        }
        // Redireciona para seleção de matérias
        next({ path: '/materias' });
        return;
      }

      // Redireciona para seleção de carreiras
      next({ path: '/teste' });
      return;
    } catch (error) {
      console.error("Erro durante o redirecionamento do usuário:", error);
      next(); // Continua a navegação em caso de erro
    }
  }

  next();
});



export default router;
