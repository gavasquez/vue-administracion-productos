<template>
  <FullScreenLoader v-if="authStore.isChecking" />
  <RouterView v-else />
  <VueQueryDevtools />
</template>
<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { AuthStatus } from './modules/auth/interfaces';
import { useRoute, useRouter } from 'vue-router';
import FullScreenLoader from './modules/common/components/FullScreenLoader.vue';

const authStore = useAuthStore();

// Para realizar la navegación
const router = useRouter();
// para ver la información de ruta
const route = useRoute();

authStore.$subscribe(
  (mutation, state) => {
    // Cuando estamos en checking va a disparar la peticion para checkear el token
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus();
      return;
    }
    // Validamos si ya esta authenticado y lo enviamos al home
    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({
        name: 'home',
      });
      return;
    }
  },
  {
    immediate: true,
  },
);
</script>
