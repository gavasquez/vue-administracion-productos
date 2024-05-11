import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();
  // Validamos si estamos authenticados
  await authStore.checkAuthStatus();
  authStore.authStatus === AuthStatus.unauthenticated ? next({ name: 'home' }) : next();
};

export default isAuthenticatedGuard;
