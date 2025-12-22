import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';
import { waitForAuthReady } from '../utils/authReady';
import { useUserStore } from '../stores/useUserStore';

// Partes da landing page
import LangingPage from '../views/LandingPage/LangingPage.vue';

//Rotas Administrativas
import AdminDashboard from '../views/Admin/components/Dashboard.vue';
import AdminHome from '../views/Admin/views/Home.vue';
import AdminUsers from '../views/Admin/views/Users.vue';
import UserEdit from '../views/Admin/views/UserEdit.vue';
import AdminSettings from '../views/Admin/views/AdminSettings.vue';

// Rotas de Alunos
import Dashboard from '../views/Dashboard.vue';
import DashboardHome from '../views/DashboardHome.vue';
import StudyHistory from '../views/StudyHistory.vue';
import Home from '../views/Home.vue';
import Career from '../views/CareerSelection.vue';
import Subjects from '../views/Subjects.vue';
import StudyCycle from '../views/StudyCycle.vue';
import OpenCompetitions from '../views/OpenCompetitions.vue';
import StudyStart from '../views/StudyStart.vue';
import StudySchedule from '../views/StudySchedule.vue'
import Challenges from '../views/Challenges.vue';
import SupportPage from '../views/SupportPage.vue';
import SubscriptionsPage from '../views/SubscriptionsPage.vue';
import PaymentSuccessPage from '../views/PaymentSuccessPage.vue';

// Rotas Globais (LandingPage, Admin e Alunos)
import ErrorPage from '../views/ErrorPage.vue';


const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LangingPage,
    meta: {
      requiresAuth: false,
      title: 'Estuday - Landing Page',
      description: 'Estude com o melhor método de aprendizado online e acelere sua carreira.'
    }
  },
  {
    path: '/login',
    component: Home,
    meta: {
      title: 'Estuday - Aprenda de Forma Inteligente',
      description: 'Estude com o melhor método de aprendizado online e acelere sua carreira.'
    }
  },
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
  // Area Administrativa do sistema
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: AdminHome,
        meta: {title: 'Admin Estuday | Home'}
      },
      {
        path: 'usuarios',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: {title: 'Admin Estuday | Lista de Usuários'}
      },
      {
        path: '/usuario/:id/edit',
        name: 'admin-user-edit',
        component: UserEdit,
        meta: { title: 'Admin Estuday | Editar Usuário' }
      },
      {
        path: 'configuracoes',
        name: "AdminSettings",
        component: AdminSettings,
        meta: { title: 'Admin Estuday | Configurações' }
      }
    ]
  },
  // Area do Aluno do sistema
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
        path: 'cronograma',
        name: 'Cronograma de Estudos',
        component: StudySchedule,
        meta: { 
          title: 'Criar Cronograma | Estuday',
          requiresPremium: true
        }
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
      {
        path: 'suporte',
        name: 'Suporte',
        component: SupportPage,
        meta: { 
          title: 'Suporte ao usuário | Estuday',
          description: 'Precisa de suporte? Entre em contato com Estuday.'
        }
      },
      // {
      //   path: 'desafios',
      //   name: 'Challenges',
      //   component: Challenges,
      //   meta: { 
      //     title: 'Desafios | Estuday',
      //     description: 'Que tal fazer um desafio? Chegue mais perto da sua aprovação com Estuday.'
      //   }
      // },
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
      // {
      //   path: '/checkout/concluido', 
      //   name: 'CheckoutSuccess',
      //   component: PaymentSuccessPage,
      //   meta: {requiresAuth: true}
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
  await waitForAuthReady();
  
  const userStore = useUserStore();
  const currentUser = auth.currentUser;

  // Se a rota exige autenticação e o usuário não está logado
  if (to.meta.requiresAuth && !currentUser) {
    next({ path: '/' }); // ou para uma página de login
    return;
  }

  if (currentUser) {
    try {
      if (!userStore.userId) await userStore.fetchUserId();
      
      const hasCareer = await userStore.checkUserCareer();
      
      if (userStore.userSubjects.length === 0) {
       await userStore.fetchUserSubjects();
      }

      if(to.meta.requiresPremium && !userStore.isPremium){
        next({ path: '/area-do-aluno' });
        return;
      }

      if (to.path === '/' && currentUser) {
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
      
      // Verifica se o usuário está tentando acessar a dashboard sem ter carreira ou matérias
      if (to.path.startsWith('/area-do-aluno') && currentUser) {
        if (!hasCareer) {
          next({ path: '/carreiras' });
          return;
        }
        if (userStore.userSubjects.length <= 0) {
          next({ path: '/materias' });
          return;
        }
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

  // Envia dados de páginas alteradas para o Google Tag Manager
  if (window.dataLayer) {
      window.dataLayer.push({
          'event': 'page_view',
          'page_path': to.path,
          'page_title': to.meta.title || 'Estuday'
      });
  }
});

export default router;
