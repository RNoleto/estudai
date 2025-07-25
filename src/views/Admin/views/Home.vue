<script setup>
import Card from '../components/ui/Card.vue';

const datas = [
    { title: 'Total de usuários', icon: 'fa-solid fa-users', info: '51' },
    { title: 'Usuários ativos', icon: 'fa-solid fa-check', info: '30' },
    { title: 'Usuários inativos', icon: 'fa-solid fa-circle-xmark', info: '21' },
    { title: 'Cadastro do ultimo usuário', icon: 'fa-solid fa-calendar', info: '24/07/2025' }
]

</script>

<template>
    <header class="bg-white text-center shadow-md p-4 md:p-6">
        <p class="font-bold">Administrador | Home</p>
    </header>
    <div class="min-h-screen p-4 md:p-8">
        <div class="flex flex-1 gap-2 flex-wrap">
            <Card class="flex-1" v-for="item in datas" :key="item.name">
                <template #title>
                    <i :class="item.icon"></i>
                    <p>{{ item.title }}</p>
                </template>
                <template #content>
                    <p>{{ item.info }}</p>
                </template>
            </Card>
        </div>
        <div>
            <p>Espaço para os gráficos</p>
        </div>
        <div class="mt-2">
            <p>Essa tela tera as seguintes informações GERAIS:</p>
            <ul class="p-2">
                <li># Usar cards e Graficos</li>
                <li># 4/5 cards para usuários (totais, ativos, inativos premium e ultimo cadastro)</li>
                <li># Criar graficos abaixo</li>
                <li># Usuários cadastrados por mês</li>
                <li># Ativo/inativo/premium</li>
                <li># Crescimento total ao longo do tempo</li>
            </ul>
            <ul class="p-2">
                <li># Total de carreiras cadastradas</li>
                <li># Rank de carreira com total de usuários em cada uma</li>
            </ul>
            <p>Ainda é um rascunho de tela com base nas infos do banco de dados</p>
        </div>
    </div>
</template>