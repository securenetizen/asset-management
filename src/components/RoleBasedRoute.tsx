import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './ui/Loading';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export default function RoleBasedRoute({ children, roles }: RoleBasedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Check if user has one of the required roles
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}