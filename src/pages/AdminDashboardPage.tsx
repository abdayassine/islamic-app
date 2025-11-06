// Page principale du dashboard admin
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  recentUsers: number;
  usersByRole: {
    superadmin: number;
    admin: number;
    user: number;
  };
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les statistiques en une requête
      const { data, error } = await supabase
        .from('profiles')
        .select('role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const totalUsers = data.length;
        const totalAdmins = data.filter(user => user.role === 'admin').length;
        const totalSuperAdmins = data.filter(user => user.role === 'superadmin').length;
        
        // Utilisateurs des 7 derniers jours
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentUsers = data.filter(user => 
          new Date(user.created_at) >= oneWeekAgo
        ).length;

        // Distribution par rôle
        const usersByRole = data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {
          superadmin: 0,
          admin: 0,
          user: 0
        });

        setStats({
          totalUsers,
          totalAdmins,
          totalSuperAdmins,
          recentUsers,
          usersByRole
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-dark-500">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card elevated>
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-semantic-error mb-2">Erreur</h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <Button onClick={fetchDashboardStats} variant="outline">
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              {t('admin.dashboard.title', 'Dashboard Admin')}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-dark-500">
              {t('admin.dashboard.subtitle', 'Vue d\'ensemble de l\'application Al-Nour')}
            </p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">👥</div>
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.dashboard.totalUsers', 'Total Utilisateurs')}
                  </p>
                  <p className="text-3xl font-bold text-primary-900 dark:text-primary-dark-900">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">🛡️</div>
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.dashboard.admins', 'Admins')}
                  </p>
                  <p className="text-3xl font-bold text-primary-700 dark:text-primary-dark-700">
                    {stats?.totalAdmins || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">👑</div>
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.dashboard.superAdmins', 'Superadmins')}
                  </p>
                  <p className="text-3xl font-bold text-semantic-error">
                    {stats?.totalSuperAdmins || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📈</div>
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.dashboard.recentUsers', 'Nouveaux (7j)')}
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.recentUsers || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Répartition par rôles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                {t('admin.dashboard.roleDistribution', 'Répartition par Rôles')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-dark-700">👑 Superadmin</span>
                  <span className="font-semibold text-semantic-error">
                    {stats?.usersByRole.superadmin || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-dark-700">🛡️ Admin</span>
                  <span className="font-semibold text-primary-700 dark:text-primary-dark-700">
                    {stats?.usersByRole.admin || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-dark-700">👤 Utilisateur</span>
                  <span className="font-semibold text-primary-600">
                    {stats?.usersByRole.user || 0}
                  </span>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-6">
                {stats && (
                  <div className="space-y-2">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-semantic-error h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.totalUsers > 0 ? (stats.usersByRole.superadmin / stats.totalUsers * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.totalUsers > 0 ? (stats.usersByRole.admin / stats.totalUsers * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.totalUsers > 0 ? (stats.usersByRole.user / stats.totalUsers * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                {t('admin.dashboard.quickActions', 'Actions Rapides')}
              </h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => window.location.href = '/admin/users'}
                >
                  👥 {t('admin.dashboard.manageUsers', 'Gérer les Utilisateurs')}
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => window.location.href = '/admin/statistics'}
                >
                  📊 {t('admin.dashboard.viewStats', 'Voir les Statistiques')}
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => window.location.href = '/admin/settings'}
                >
                  ⚙️ {t('admin.dashboard.appSettings', 'Paramètres App')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Informations système */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              {t('admin.dashboard.systemInfo', 'Informations Système')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-neutral-700 dark:text-neutral-dark-700">
                  {t('admin.dashboard.appName', 'Nom de l\'App')}:
                </span>
                <span className="ml-2 text-neutral-600 dark:text-neutral-dark-500">Al-Nour</span>
              </div>
              <div>
                <span className="font-medium text-neutral-700 dark:text-neutral-dark-700">
                  {t('admin.dashboard.version', 'Version')}:
                </span>
                <span className="ml-2 text-neutral-600 dark:text-neutral-dark-500">1.0.0</span>
              </div>
              <div>
                <span className="font-medium text-neutral-700 dark:text-neutral-dark-700">
                  {t('admin.dashboard.lastUpdate', 'Dernière MAJ')}:
                </span>
                <span className="ml-2 text-neutral-600 dark:text-neutral-dark-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}