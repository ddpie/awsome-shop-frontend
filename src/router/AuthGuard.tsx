import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to={user?.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}
