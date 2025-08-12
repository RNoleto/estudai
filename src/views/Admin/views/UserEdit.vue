<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '../../../stores/useAdminStore';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const userId = route.params.id;
const user = ref(null);
const loading = ref(true);

onMounted(async () => {
    // Busca os dados do usuário para preencher o formulário
    const userData = await adminStore.fetchUser(userId);
    user.value = userData;
    loading.value = false;
});

async function saveChanges() {
    if (!user.value) return;

    // 1. Crie um objeto 'payload' apenas com os campos que o backend espera.
    const payload = {
        name: user.value.name,
        email: user.value.email,
        // 2. Extraia o career_id do objeto aninhado.
        //    A verificação `user.value.user_career` evita erros se a carreira não estiver definida.
        career_id: user.value.user_career ? user.value.user_career.career_id : null
    };

    // DEBUG: Adicione esta linha para ver exatamente o que está sendo enviado
    console.log('Enviando para o backend:', payload);

    // 3. Envie o novo 'payload' simplificado para a action da store.
    const success = await adminStore.updateUser(userId, payload);
    
    if (success) {
        alert('Usuário atualizado com sucesso!');
        router.push({ name: 'admin-users' });
    } else {
        alert('Falha ao atualizar o usuário. Verifique o log do Laravel para mais detalhes.');
    }
}
</script>

<template>
    <div v-if="loading">Carregando...</div>
    <div v-else-if="user">
        <h1>Editando {{ user.name }}</h1>
        <form @submit.prevent="saveChanges">
            <div>
                <label for="name">Nome:</label>
                <input type="text" id="name" v-model="user.name" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="user.email" required />
            </div>
            <button type="submit">Salvar Alterações</button>
        </form>
    </div>
</template>