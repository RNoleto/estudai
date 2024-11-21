import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from 'vue-clerk'
import './style.css'
import App from './App.vue'
import axios from 'axios'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import router from './router'

const vuetify = createVuetify({
    components,
    directives,
})


const pinia = createPinia();

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

const app = createApp(App);

app.use(clerkPlugin, {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
});

app.use(vuetify)
app.use(pinia)
app.use(router);

app.mount('#app');
