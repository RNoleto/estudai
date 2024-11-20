import { createMemoryHistory, createRouter } from 'vue-router'

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
        component: Career,
    },
    {
        path: '/materias', 
        component: Subjects,
    },
    {
        path: '/ciclo-de-estudos', 
        component: StudyCycle,
    },
    {
        path: '/estudar', 
        component: StudyStart,
    }
    
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;