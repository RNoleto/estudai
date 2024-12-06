import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from 'vue-clerk';
import Home from '../views/Home.vue';
import Career from '../views/CareerSelection.vue';
import Subjects from '../views/Subjects.vue';
import StudyCycle from '../views/StudyCycle.vue';
import StudyStart from '../views/StudyStart.vue';
import StudentArea from '../views/StudentArea.vue';

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
    path: '/estudar',
    name: 'Estudar',
    component: StudyStart,
    meta: { requiresAuth: true },
  },
  {
    path: '/area-do-aluno',
    name: 'Area do aluno',
    component: StudentArea,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isSignedIn, isLoaded } = useAuth();

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
  } else {
    next();
  }
});

export default router;
