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
    { name: 'Home', routeName: 'AdminHome' },
    // { name: 'Usuários', routeName: '' },
    // { name: 'Carreiras', routeName: '' },
    // { name: 'Matérias', routeName: '' }
];
</script>

<template>
    <div>
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
                :aria-label="isMenuMobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'">
                <i :class="[
                  'text-gray-600 transition-transform duration-200',
                  isMenuMobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
                ]"></i>
            </button>
            <transition name="menu-overlay">
                <div v-if="isMenuMobileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
                    <transition class="menu-slide">
                        <div class="fixed top-0 right-0 h-full w-60 bg-white p-2">
                            <!-- Header do menu mobile -->
                            <div class="flex items-center justify-between bg-blue-100">
                                <div>
                                    <p>Estuday Admin</p>
                                </div>
                                <button @click="toggleMenu" class="p-2">
                                    <i class="fa-solid fa-xmark text-gray-600"></i>
                                </button>
                            </div>
                            <!-- Conteudo do menu -->
                            <div class="flex-1 overflow-y-auto p-4 bg-red-100">
                                <nav class="text-center">
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
                            <div>Footer do menu</div>
                        </div>
                    </transition>
                </div>
            </transition>
        </nav>
        <!-- Menu Desktop -->
        <div>
            <aside v-if="!isMobileView" class="flex justify-between p-4 items-center shadow-md bg-red-200">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <p>Estuday Admin</p>
                </div>
                <nav class="flex gap-2">
                    <template v-for="item in menuItems" :key="item.name">
                        <div v-if="!item.subItems">
                            <router-link :to="{ name: item.routeName }" @click="isMenuMobileOpen = false">
                                {{ item.name }}
                            </router-link>
                        </div>
                    </template>
                </nav>
            </aside>
        </div>
        <!-- Desktop -->
        <main 
            :class="[
                'flex-1 overflow-y-auto h-full px-4', 
                isMobileView ? 'pt-16' : 'pt-4' ]">
            <!-- Conteudo das páginas acessadas aqui Mobile/Desktop -->
            <router-view />
        </main>
    </div>
</template>