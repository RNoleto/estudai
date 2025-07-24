<script setup>
import Card from '../components/ui/Card.vue';
</script>

<template>
    <div class="min-h-screen">
        <div class="flex flex-1 gap-2 flex-wrap">
            <Card class="flex-1">
                <template #title>
                    <p class="text-sm">Usuários Cadastrados</p>
                </template>
                <template #content>
                    <i class="fa-solid fa-graduation-cap text-4xl"></i>
                    <p>51</p>
                </template>
            </Card>
            <Card class="flex-1">
                <template #title>Usuários Ativos</template>
                <template #content>30</template>
            </Card>
            <Card class="flex-1">
                <template #title>Cadastro do ultimo usuário</template>
                <template #content>21/07/2025</template>
            </Card>
        </div>

        <h1>Home Administrativa</h1>
        <p>Admin pode executar todas as ações CRUD</p>
        <p>Essa tela tera as seguintes informações:</p>
        <ul class="p-2">
            <li># Total de usuários cadastrados</li>
            <li># Total de usuários ativos</li>
            <li># Total de usuários inativos</li>
        </ul>
        <p>Ainda é um rascunho de tela com base nas infos do banco de dados</p>
    </div>
</template>