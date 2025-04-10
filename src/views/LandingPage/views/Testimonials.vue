<script setup>

</script>

<template>
    <section class="py-16 bg-gray-50" id="testimonials">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-primary text-3xl md:text-4xl font-bold mb-8">
          O Que Nossos Usuários Dizem
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Testimonial Card 1 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <p class="text-gray-600 italic mb-4">
              "O Estuday revolucionou a forma como gerencio meu tempo de estudo. As dicas de IA são incríveis!"
            </p>
            <div class="flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D" alt="Depoimento de Maria" class="rounded-full mr-4 w-16 ">
              <div class="text-left">
                <p class="font-semibold text-primary">Maria Silva</p>
                <p class="text-sm text-gray-500">Estudante de Engenharia</p>
              </div>
            </div>
          </div>
          <!-- Testimonial Card 2 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <p class="text-gray-600 italic mb-4">
              "A interface é intuitiva e os insights me ajudaram a melhorar meu desempenho em concursos públicos."
            </p>
            <div class="flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww" alt="Depoimento de João" class="rounded-full mr-4 w-16">
              <div class="text-left">
                <p class="font-semibold text-primary">João Pereira</p>
                <p class="text-sm text-gray-500">Concurseiro</p>
              </div>
            </div>
          </div>
          <!-- Você pode adicionar mais cards conforme necessário -->
        </div>
        <!-- Se desejar, insira um slider ou mais elementos de prova social -->
      </div>
    </section>
  </template>
  
  <script setup>
  // Esse componente atualmente usa conteúdo estático.
  // Para dinamizar, você pode carregar os depoimentos de uma API ou store.
  </script>
  
  <style scoped>
  /* Adicione customizações extras se necessário */
  </style>
  