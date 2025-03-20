import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePrerender from 'vite-plugin-prerender';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePrerender({
      routes: [
        '/',
        '/carreiras',
        '/materias',
        '/area-do-aluno',
        '/area-do-aluno/estudar',
        '/area-do-aluno/historico-de-estudos',
        '/area-do-aluno/carreiras',
        '/area-do-aluno/materias'
      ]
    })
  ],
  optimizeDeps: {
    include: ['vite-plugin-prerender']
  }
});
