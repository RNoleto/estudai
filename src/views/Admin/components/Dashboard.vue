<script setup>
import { RouterView, useRoute, RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRoute();

const isMobileView = ref(window.innerWidth <= 640)

const updateIsMobileView = () => {
    isMobileView.value = window.innerWidth <= 640;
}

onMounted(() => {
    window.addEventListener('resize', updateIsMobileView);
});

const isMenuMobileOpen = ref(false);

const toggleMenu = () => {
    isMenuMobileOpen.value = !isMenuMobileOpen.value;
}


const menuItems = [
    { name: 'Resumo', path: '#' },
    { name: 'Usuários', path: '#' },
    { name: 'Carreiras', path: '#' },
    { name: 'Matérias', path: '#' }
];
</script>

<template>
    <div>
        <!-- Mobile -->
        <nav v-if="isMobileView"
            class="fixed top-0 left-0 w-full bg-blue-100 border-b border-gray-200 shadow-sm z-50 flex items-center justify-between p-4">
            <!-- Logo Aqui -->
            <router-link to="/admin" class="flex items-center gap-2 cursor-pointer">
                <div>
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <span>Estuday</span>
            </router-link>
             <button> Menu </button>
            <!-- <template v-for="item in menuItems" :key="item.name">
                <div v-if="!item.subItems">
                    <router-link
                        :to="item.path"
                        @click="isMenuMobileOpen = false"
                    >
                        {{ item.name }}
                    </router-link>
                </div>
            </template> -->
        </nav>
        <!-- Desktop -->
        <main class="flex-1 overflow-y-auto h-full">
            <!-- Conteudo das páginas acessadas aqui -->
            <router-view />
        </main>
    </div>
</template>