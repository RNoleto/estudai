import { createRouter, createWebHistory } from 'vue-router';
import { initializeAuth } from '../services/AuthService';
import { useUserStore } from '../stores/useUserStore';
import Home from '../views/Home.vue';
import Career from '../views/CareerSelection.vue';
import Subjects from '../views/Subjects.vue';
import StudyCycle from '../views/StudyCycle.vue';
import StudyStart from '../views/StudyStart.vue';
import ErrorPage from '../views/ErrorPage.vue';

import SubscriptionsPage from '../views/SubscriptionsPage.vue';

import Dashboard from '../views/Dashboard.vue';
import DashboardHome from '../views/DashboardHome.vue';
import StudyHistory from '../views/StudyHistory.vue';

// Partes da landing page que não estão no dashboard
import LanginPage from '../views/LandingPage/LanginPage.vue';

// Rotas comentadas estão em desenvolvimento e não estão sendo utilizadas no momento

//Rota em teste
import OpenCompetitions from '../views/OpenCompetitions.vue';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Estuday - Aprenda de Forma Inteligente',
      description: 'Estude com o melhor método de aprendizado online e acelere sua carreira.'
    }
  },
  // {
  //   path: '/landing-page',
  //   name: 'LandingPage',
  //   component: LanginPage,
  //   meta: {
  //     requiresAuth: false,
  //     title: 'Estuday - Landing Page',
  //     description: 'Estude com o melhor método de aprendizado online e acelere sua carreira.'
  //   }
  // },
  {
    path: '/carreiras',
    name: 'Carreiras',
    component: Career,
    meta: { 
      requiresAuth: true,
      title: 'Escolha sua Carreira | Estuday',
      description: 'Descubra as melhores carreiras e trilhe seu caminho profissional com a Estuday.'
    }
  },
  {
    path: '/materias',
    name: 'Materias',
    component: Subjects,
    meta: { 
      requiresAuth: true,
      title: 'Matérias Disponíveis | Estuday',
      description: 'Confira todas as matérias disponíveis para estudo na Estuday.'
    }
  },
  // {
  //   path: '/ciclo-de-estudos',
  //   name: 'Ciclo',
  //   component: StudyCycle,
  //   meta: { 
  //     requiresAuth: true,
  //     title: 'Ciclo de Estudos | Estuday',
  //     description: 'Crie e gerencie seu ciclo de estudos de maneira eficiente.'
  //   }
  // },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: ErrorPage,
    meta: {
      title: 'Página de erro | Estuday',
      description: 'Página de erro do Estuday.'
    }
  },
  {
    path: '/area-do-aluno',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome,
        meta: { title: 'Área do Aluno | Estuday' }
      },
      {
        path: 'estudar',
        name: 'Estudar',
        component: StudyStart,
        meta: { title: 'Estudar Agora | Estuday' }
      },
      {
        path: 'historico-de-estudos',
        name: 'Historico',
        component: StudyHistory,
        meta: { title: 'Histórico de Estudos | Estuday' }
      },
      {
        path: 'carreiras',
        name: 'DashboardCarreiras',
        component: Career,
        meta: { title: 'Gerenciar Carreiras | Estuday' }
      },
      {
        path: 'materias',
        name: 'DashboardMaterias',
        component: Subjects,
        meta: { title: 'Gerenciar Matérias | Estuday' }
      },
      {
        path: 'concursos',
        name: 'Concursos',
        component: OpenCompetitions,
        meta: { 
          title: 'Lista de Concursos | Estuday',
          description: 'Confira os principais concursos abertos no Brasil na Estuday.'
        }
      },
      // {
      //   path: 'ciclo-de-estudos',
      //   name: 'DashboardCiclo',
      //   component: StudyCycle,
      //   meta: { title: 'Gerenciar Ciclo de Estudos | Estuday' }
      // },
      // {
      //   path: 'planos',
      //   name: 'DashboardSubscriptions',
      //   component: SubscriptionsPage,
      //   meta: { title: 'Planos de Assinatura | Estuday' }
      // },
      {
        path: '/:pathMatch(.*)*', 
        name: 'DashboardNotFound', 
        component: ErrorPage,
        meta: {title: 'Página de erro | Estuday '}
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
  const userStore = useUserStore();

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

  // Se a rota exige autenticação e o usuário não está logado, não redirecionamos para "/", apenas mostramos conteúdo público
  if (to.meta.requiresAuth && !auth.isSignedIn.value) {
    next();
    return;
  }

  if (auth.isSignedIn.value) {
    try {
      await userStore.fetchUserId();
      const hasCareer = await userStore.checkUserCareer();
      await userStore.fetchUserSubjects();
      
      // Não redirecionar a home para /area-do-aluno automaticamente para evitar problemas de indexação
      if (to.path === '/' && auth.isSignedIn.value) {
        if (!hasCareer) {
          next({ path: '/carreiras' });
          return;
        }

        if (userStore.userSubjects.length <= 0) {
          next({ path: '/materias' });
          return;
        }

        next({ path: '/area-do-aluno' });
        return;
      }
    } catch (error) {
      console.error("Erro durante a verificação de redirecionamento:", error);
      next();
      return;
    }
  }

  next();
});

// Atualiza título e meta descrição dinamicamente
router.afterEach((to) => {
  document.title = to.meta.title || 'Estuday';

  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute("content", to.meta.description || 'A melhor plataforma de estudos online.');
  }
});

export default router;
