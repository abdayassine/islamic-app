// Composant de protection des routes admin
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'superadmin';
}

function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { userProfile, loading, isAuthenticated } = useAuth();

  // Afficher le chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers l'authentification si non connecté
  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/admin/login" replace />;
  }

  // Vérifier le rôle requis
  if (requiredRole === 'superadmin' && userProfile.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center">
        <div className="text-center">
          <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p>Vous n'avez pas les droits d'accès nécessaires pour cette section.</p>
            <p className="mt-2 text-sm">Rôle requis: Superadmin</p>
          </div>
        </div>
      </div>
    );
  }

  if (requiredRole === 'admin' && !['admin', 'superadmin'].includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center">
        <div className="text-center">
          <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p>Vous n'avez pas les droits d'accès nécessaires pour cette section.</p>
            <p className="mt-2 text-sm">Rôle requis: Admin ou Superadmin</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;