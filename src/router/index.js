import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Career from '../views/CareerSelection.vue'
import Subjects from '../views/Subjects.vue'
import StudyCycle from '../views/StudyCycle.vue'
import StudyStart from '../views/StudyStart.vue'

const routes = [
    {
        path: '/', 
        component: Home,
    },
    {
        path: '/carreira', 
        name: 'Carreiras',
        component: Career,
    },
    {
        path: '/materias', 
        name: 'Materias',
        component: Subjects,
    },
    {
        path: '/ciclo-de-estudos',
        name: 'Ciclo', 
        component: StudyCycle,
    },
    {
        path: '/estudar', 
        name: 'Estudar',
        component: StudyStart,
    }
    
]

const router = createRouter({
    history: createWebHistory(),
  routes,
})

export default router;