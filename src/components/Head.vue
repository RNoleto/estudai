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
    default: "Seu gerenciador de estudos para organizar seu tempo, acompanhar seu desempenho e alcançar seus objetivos. Simplifique seus estudos e estude com mais eficiência!",
  },
  image: {
    type: String,
    default: "https://estuday.com.br/img/metaImg.png",
  },
  url: {
    type: String,
    default: "https://estuday.com.br",
  },
  keywords:{
    type: String,
    default: "concursos públicos, gestão do tempo de estudo, organização de estudos, preparação para concurso, questões de concurso, acompanhamento de desempenho, planejamento de estudos"
  }
});

const updateHead = () => {
  setTimeout(() => {
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
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute("content", props.keywords);
  }, 100); // Espera 100ms antes de atualizar as meta tags
};

// Atualiza ao montar o componente
onMounted(updateHead);

// Atualiza dinamicamente se os props mudarem
watchEffect(updateHead);
</script>
