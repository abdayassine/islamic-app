// Sidebar pour la navigation du dashboard admin
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  path: string;
  requiredRole?: 'admin' | 'superadmin';
}

export default function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: '📊',
      label: t('admin.sidebar.dashboard', 'Tableau de bord'),
      path: '/admin/dashboard',
    },
    {
      id: 'users',
      icon: '👥',
      label: t('admin.sidebar.users', 'Utilisateurs'),
      path: '/admin/users',
      requiredRole: 'admin'
    },
    {
      id: 'statistics',
      icon: '📈',
      label: t('admin.sidebar.statistics', 'Statistiques'),
      path: '/admin/statistics',
      requiredRole: 'admin'
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: t('admin.sidebar.settings', 'Paramètres'),
      path: '/admin/settings',
      requiredRole: 'admin'
    }
  ];

  // Filtrer les éléments du menu selon les permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    
    if (item.requiredRole === 'superadmin') {
      return userProfile?.role === 'superadmin';
    }
    
    if (item.requiredRole === 'admin') {
      return ['admin', 'superadmin'].includes(userProfile?.role || '');
    }
    
    return true;
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="bg-white h-full w-64 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-1">
            {t('admin.title', 'Dashboard Admin')}
          </h1>
          <p className="text-sm text-neutral-600">
            {userProfile?.full_name || 'Utilisateur Admin'}
          </p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            userProfile?.role === 'superadmin' 
              ? 'bg-semantic-error text-white' 
              : 'bg-primary-100 text-primary-700'
          }`}>
            {userProfile?.role === 'superadmin' ? 'Superadmin' : 'Admin'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-900 border-r-4 border-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-900'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:text-primary-900 transition-colors"
          >
            <span className="mr-2">🏠</span>
            {t('admin.sidebar.backToApp', 'Retour à l\'app')}
          </Link>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-center"
          >
            <span className="mr-2">🚪</span>
            {t('admin.sidebar.logout', 'Déconnexion')}
          </Button>
        </div>
      </div>
    </div>
  );
}