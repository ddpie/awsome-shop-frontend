import { useAuthStore } from '../stores/auth.store';

/**
 * Convenience hook for auth state and actions
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return { user, isAuthenticated, loading, login, logout };
};
