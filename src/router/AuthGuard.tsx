import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';
import type { UserRole } from '../types/auth.types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}
