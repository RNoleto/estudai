import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from 'vue-clerk'
import Home from '../views/Home.vue'
import Career from '../views/CareerSelection.vue'
import Subjects from '../views/Subjects.vue'
import StudyCycle from '../views/StudyCycle.vue'
import StudyStart from '../views/StudyStart.vue'

import Test from '../views/Test.vue'

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
    }    
]

const router = createRouter({
    history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const { isSignedIn } = useAuth();

    //Se a rota exigir autenticação e o usuário não estiver logado, redirecione para a home
    if(to.meta.requiresAuth && !isSignedIn.value) {
        next({ path: '/'});
    } else {
        next();
    }
});

export default router;