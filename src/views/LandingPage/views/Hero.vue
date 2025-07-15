<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goToLogin() {
  router.push('/');
}
</script>

<template>
    <section class="relative min-h-screen overflow-hidden" id="hero">
        <!-- Imagem de fundo -->
        <img 
            src="/img/estuday_wallpaper_landingpage.webp" 
            class="absolute right-0 top-0 h-full object-cover w-full md:w-1/2 lg:w-1/2"
            alt="Estuday Wallpaper"
        />
        
        <!-- Gradiente sobreposto -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent md:from-primary/80 md:via-primary/60 md:to-transparent"></div>
        
        <!-- Conteúdo -->
        <div class="relative z-1 container mx-auto h-full flex items-center px-4 py-16 md:py-0">
            <div class="text-white max-w-full md:max-w-2xl lg:max-w-3xl">
                <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                    Transforme Seu Estudo com Inteligência Artificial
                </h1>
                <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed opacity-90">
                    Gerencie seu tempo, acompanhe seu progresso e melhore seu desempenho com insights personalizados.
                </p>
                <button
                    @click="goToLogin"
                    class="bg-primary text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-lg hover:bg-baseGreen transition duration-300 text-sm sm:text-base md:text-lg"
                >
                    Comece Agora - É Grátis!
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
#hero {
    position: relative;
}

/* Ajustes específicos para mobile */
@media (max-width: 768px) {
    #hero {
        padding-top: 80px; /* Espaço para o header fixo */
    }
}

/* Ajustes para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
    #hero {
        padding-top: 60px;
    }
}

/* Ajustes para desktop */
@media (min-width: 1025px) {
    #hero {
        padding-top: 0;
    }
}
</style>
  