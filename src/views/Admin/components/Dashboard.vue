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
    console.log('Menu Aberto')
}


const menuItems = [
    { name: 'Home', routeName: 'AdminHome', icon: 'fa-solid fa-house' },
    { name: 'Usuários', routeName: 'AdminUsers', icon: 'fa-solid fa-users' },
    { name: 'Configurações', routeName: 'AdminSettings', icon: 'fa-solid fa-cog' },
    // { name: 'Carreiras', routeName: '', icon: 'fa-solid fa-brefcase' },
    // { name: 'Matérias', routeName: '', icon: 'fa-solid fa-book-open' }
];
</script>

<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Navbar Mobile -->
        <nav v-if="isMobileView"
            class="fixed top-0 left-0 w-full bg-blue-100 border-b border-gray-200 shadow-sm z-50 flex items-center justify-between p-4">
            <!-- Logo Aqui -->
            <router-link to="/admin" class="flex items-center gap-2 cursor-pointer">
                <div>
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <span>Estuday</span>
            </router-link>
            <button @click="toggleMenu"
                class="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                :aria-label="isMenuMobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'">
                <i :class="[
                  'text-gray-600 transition-transform duration-200',
                  isMenuMobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
                ]"></i>
            </button>
        </nav>
        <!-- Menu Mobile -->
            <transition name="menu-overlay">
                <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
                    <transition class="menu-slide">
                        <div class="fixed top-0 right-0 h-full w-60 bg-white shadow-2xl flex flex-col">
                            <!-- Header do menu mobile -->
                            <div class="mt-[67px] flex items-center justify-between p-6 border-b border-gray-100">
                                <div>
                                    <p>Estuday | Admin</p>
                                </div>
                            </div>
                            <!-- Conteudo do menu -->
                            <div class="flex-1 overflow-y-auto p-4 bg-red-100">
                                <nav class="flex flex-col gap-2 text-center">
                                    <template v-for="item in menuItems" :key="item.name">
                                        <div v-if="!item.subItems">
                                            <router-link :to="{ name: item.routeName }" @click="isMenuMobileOpen = false">
                                                {{ item.name }}
                                            </router-link>
                                        </div>
                                    </template>
                                </nav>
                            </div>
                            <!-- Footer do menu -->
                            <div class="bg-blue-100">
                                <p class="border border-gray-400 text-center p-2">Botão de logout</p>
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>
        <!-- Menu Desktop -->
        <div class="min-h-screen z-10">
            <aside v-if="!isMobileView" :class="['flex flex-col h-full bg-white border-r border-gray-200 shadow-md transition-[width] duration-300 ease-in-out w-[15rem] p-4']">
                <div class="flex items-center gap-2 p-4 justify-center border-b mb-4">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <p>Estuday Admin</p>
                </div>
                <nav class="flex flex-col gap-2">
                    <template v-for="item in menuItems" :key="item.name">
                        <div v-if="!item.subItems">
                            <router-link :to="{ name: item.routeName }" @click="isMenuMobileOpen = false" class="flex text-sm items-center gap-2  py-1 px-2 hover:bg-zinc-100">
                               <i :class='item.icon' class="text-[14px]"></i> {{ item.name }}
                            </router-link>
                        </div>
                    </template>
                </nav>
            </aside>
        </div>
        <!-- Desktop -->
        <main 
            :class="[
                'flex-1 overflow-y-auto h-full', 
                isMobileView ? 'pt-16' : 'pt-0' ]">
            <!-- Conteudo das páginas acessadas aqui Mobile/Desktop -->
            <router-view />
        </main>
    </div>
</template>

<style scoped>
aside {
    box-shadow: 4px 0 8px rgba(0,0,0, 0.1);
}
</style>