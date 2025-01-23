<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';

import Card from '../components/Card.vue';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.checkUserCareer();
  await userStore.fetchUserSubjects();
})

</script>

<template>
  <div>
    <p>Página de teste</p>
    <div class="grid grid-cols-6 gap-2 mt-2">
      <Card class="col-span-2">
      </Card>
      <Card  class="col-span-2">
      </Card>
      <Card  class="col-span-2">
      </Card>
      <div class="col-span-6">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem harum molestiae, facilis voluptates neque fugiat odio non repellat deserunt ad quo numquam explicabo tenetur ea. Voluptas ipsam sed vitae minus.</p>
      </div>
    </div>
  </div>
</template>