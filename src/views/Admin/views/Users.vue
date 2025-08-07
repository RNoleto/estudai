<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '../../../stores/useAdminStore'; // Ajuste o caminho se necessário

const adminStore = useAdminStore();

// Quando o componente for montado, busca a primeira página de usuários
onMounted(() => {
    adminStore.fetchUsers();
});

// Função para mudar de página
function changePage(page) {
    if (page > 0 && page <= adminStore.pagination.last_page) {
        adminStore.fetchUsers(page);
    }
}
</script>

<template>
    <header class="bg-white text-center shadow-md p-4 md:p-6">
        <p class="font-bold">Administrador | Usuários</p>
    </header>
    <div class="min-h-screen p-4 md:p-8">
        
        <div v-if="adminStore.isUsersLoading" class="text-center p-8">
            <p>Carregando usuários...</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">Nome</th>
                        <th scope="col" class="px-6 py-3">Email</th>
                        <th scope="col" class="px-6 py-3">Carreira</th>
                        <th scope="col" class="px-6 py-3">Status da Carreira</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in adminStore.users" :key="user.id" class="bg-white border-b hover:bg-gray-50">
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ user.name }}</td>
                        <td class="px-6 py-4">{{ user.email }}</td>
                        <td class="px-6 py-4">
                            {{ user.user_career?.career?.name || 'Não definida' }}
                        </td>
                        <td class="px-6 py-4">
                            <span v-if="user.user_career" 
                                  :class="user.user_career.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                  class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                {{ user.user_career.ativo ? 'Ativo' : 'Inativo' }}
                            </span>
                            <span v-else class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                N/A
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="!adminStore.isUsersLoading && adminStore.pagination && adminStore.pagination.total > 0" class="flex justify-between items-center mt-4">
            <div>
                <p class="text-sm text-gray-700">
                    Mostrando 
                    <span class="font-medium">{{ adminStore.pagination.from }}</span>
                    a
                    <span class="font-medium">{{ adminStore.pagination.to }}</span>
                    de
                    <span class="font-medium">{{ adminStore.pagination.total }}</span>
                    resultados
                </p>
            </div>
            <div class="flex gap-2">
                <button @click="changePage(adminStore.pagination.current_page - 1)" 
                        :disabled="adminStore.pagination.current_page === 1"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>
                <button @click="changePage(adminStore.pagination.current_page + 1)"
                        :disabled="adminStore.pagination.current_page === adminStore.pagination.last_page"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próxima
                </button>
            </div>
        </div>

    </div>
</template>