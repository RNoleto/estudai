<script setup>
import { onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Descrição padrão do site Estuday.",
  },
  image: {
    type: String,
    default: "https://estuday.com.br/imagem-padrao.jpg",
  },
  url: {
    type: String,
    default: "https://estuday.com.br",
  },
});

const updateHead = () => {
  document.title = props.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", props.description);

  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", props.title);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", props.description);
  document
    .querySelector('meta[property="og:image"]')
    ?.setAttribute("content", props.image);
  document
    .querySelector('meta[property="og:url"]')
    ?.setAttribute("content", props.url);

  document
    .querySelector('meta[name="twitter:title"]')
    ?.setAttribute("content", props.title);
  document
    .querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", props.description);
  document
    .querySelector('meta[name="twitter:image"]')
    ?.setAttribute("content", props.image);
};

// Atualiza ao montar o componente
onMounted(updateHead);

// Atualiza dinamicamente se os props mudarem
watchEffect(updateHead);
</script>
