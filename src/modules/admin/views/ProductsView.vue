<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">Productos</h1>
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">Imagen</th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">Título</th>
              <th class="w-28 py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="w-60 text-left py-3 px-4 uppercase font-semibold text-sm">Tallas</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(product, index) in products"
              :key="product.id"
              :class="{
                'bg-gray-300': index % 2 === 0,
              }"
            >
              <td class="text-left py-3 px-4">
                <img :src="product.images[0]" :alt="product.title" class="h-10 w-10 object-cover" />
              </td>
              <td class="text-left py-3 px-4">
                <RouterLink
                  class="hover:text-blue-500 hover:underline"
                  :to="`/admin/products/${product.id}`"
                >
                  {{ product.title }}
                </RouterLink>
              </td>
              <td class="text-left py-3 px-4">
                <span class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">{{
                  product.price
                }}</span>
              </td>
              <td class="text-left py-3 px-4">
                {{ product.sizes.join(',') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ButtonPagination :page="page" :has-more-date="!!products && products.length < 10" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { geProductsActions } from '../../products/actions/get-products';
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { usePagination } from '../../common/composables/usePagination';
import { watchEffect } from 'vue';

const { page } = usePagination();
// Query pluggin
const queryClient = useQueryClient();

const { data: products, isLoading } = useQuery({
  queryKey: ['products', { page: page }],
  queryFn: () => geProductsActions(page.value),
});

//* cuando cambia la pagina, esta pendiendo de las variables reactivas
watchEffect(() => {
  // Hacemos el prefetch de la siguiente pagina
  // Nota el watchEffect va estar pendiente si cambia la variable page
  queryClient.prefetchQuery({
    queryKey: ['products', { page: page.value + 1 }],
    queryFn: () => geProductsActions(page.value + 1),
  });
});
</script>
