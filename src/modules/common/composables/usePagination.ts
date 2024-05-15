import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const usePagination = () => {
  const route = useRoute();
  const page = ref(Number(route.query.page || 1));

  // Para que cuando cambie, el watch esta pendiente del parametro de la url
  watch(
    () => route.query.page,
    (newPage) => {
      page.value = Number(newPage || 1);
      // Movimiento del scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  );

  return {
    page,
  };
};
