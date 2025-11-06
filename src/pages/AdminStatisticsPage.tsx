// Page des statistiques avancées
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

interface StatsData {
  totalUsers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  recentUsers: number;
  usersByRole: {
    superadmin: number;
    admin: number;
    user: number;
  };
  usersByLanguage: {
    fr: number;
    ar: number;
    en: number;
  };
  usersByMonth: Array<{
    month: string;
    count: number;
  }>;
  growthRate: number;
}

export default function AdminStatisticsPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90 jours

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('profiles')
        .select('role, language_preference, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const now = new Date();
        const daysAgo = parseInt(dateRange);
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

        // Statistiques générales
        const totalUsers = data.length;
        const totalAdmins = data.filter(user => user.role === 'admin').length;
        const totalSuperAdmins = data.filter(user => user.role === 'superadmin').length;
        
        // Utilisateurs récents
        const recentUsers = data.filter(user => 
          new Date(user.created_at) >= cutoffDate
        ).length;

        // Répartition par rôle
        const usersByRole = data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {
          superadmin: 0,
          admin: 0,
          user: 0
        });

        // Répartition par langue
        const usersByLanguage = data.reduce((acc, user) => {
          const lang = user.language_preference || 'fr';
          acc[lang] = (acc[lang] || 0) + 1;
          return acc;
        }, {
          fr: 0,
          ar: 0,
          en: 0
        });

        // Croissance mensuelle
        const monthlyData = data.reduce((acc, user) => {
          const month = new Date(user.created_at).toISOString().substring(0, 7); // YYYY-MM
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const usersByMonth = Object.entries(monthlyData)
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month));

        // Taux de croissance
        const currentMonth = now.toISOString().substring(0, 7);
        const currentMonthUsers = data.filter(user => 
          user.created_at.startsWith(currentMonth)
        ).length;
        
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().substring(0, 7);
        const lastMonthUsers = data.filter(user => 
          user.created_at.startsWith(lastMonth)
        ).length;
        
        const growthRate = lastMonthUsers > 0 
          ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100)
          : 0;

        setStats({
          totalUsers,
          totalAdmins,
          totalSuperAdmins,
          recentUsers,
          usersByRole,
          usersByLanguage,
          usersByMonth,
          growthRate
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'fr': return 'Français';
      case 'ar': return 'العربية';
      case 'en': return 'English';
      default: return code.toUpperCase();
    }
  };

  const getLanguageFlag = (code: string) => {
    switch (code) {
      case 'fr': return '🇫🇷';
      case 'ar': return '🇸🇦';
      case 'en': return '🇺🇸';
      default: return '🌍';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-dark-500">Chargement des statistiques...</p>
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
              <Button onClick={fetchStatistics} variant="outline">
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                {t('admin.statistics.title', 'Statistiques Avancées')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-dark-500">
                {t('admin.statistics.subtitle', 'Analyse détaillée des données de l\'application')}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
                <option value="365">1 an</option>
              </select>
              
              <Button onClick={fetchStatistics} variant="outline">
                🔄 Actualiser
              </Button>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.statistics.totalUsers', 'Total Utilisateurs')}
                  </p>
                  <p className="text-3xl font-bold text-primary-900 dark:text-primary-dark-900">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                  {stats?.recentUsers || 0} {t('admin.statistics.recent', 'nouveaux')}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.statistics.growthRate', 'Taux de Croissance')}
                  </p>
                  <p className={`text-3xl font-bold ${(stats?.growthRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(stats?.growthRate || 0) >= 0 ? '+' : ''}{(stats?.growthRate || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                  {t('admin.statistics.thisMonth', 'vs mois dernier')}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.statistics.admins', 'Administrateurs')}
                  </p>
                  <p className="text-3xl font-bold text-primary-700 dark:text-primary-dark-700">
                    {(stats?.totalAdmins || 0) + (stats?.totalSuperAdmins || 0)}
                  </p>
                </div>
                <div className="text-4xl">🛡️</div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                  {stats?.totalSuperAdmins || 0} superadmins
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-dark-500">
                    {t('admin.statistics.topLanguage', 'Langue Principale')}
                  </p>
                  <p className="text-3xl font-bold text-primary-900 dark:text-primary-dark-900">
                    {stats && Object.entries(stats.usersByLanguage).sort(([,a], [,b]) => b - a)[0] ? 
                      getLanguageFlag(Object.entries(stats.usersByLanguage).sort(([,a], [,b]) => b - a)[0][0]) : '🌍'}
                  </p>
                </div>
                <div className="text-4xl">🗣️</div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                  {stats && Object.entries(stats.usersByLanguage).sort(([,a], [,b]) => b - a)[0] ? 
                    getLanguageName(Object.entries(stats.usersByLanguage).sort(([,a], [,b]) => b - a)[0][0]) : ''}
                </p>
              </div>
            </Card>
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par rôle */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                {t('admin.statistics.roleDistribution', 'Répartition par Rôles')}
              </h3>
              
              <div className="space-y-4">
                {stats && Object.entries(stats.usersByRole).map(([role, count]) => (
                  <div key={role} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {role === 'superadmin' ? '👑' : role === 'admin' ? '🛡️' : '👤'}
                      </span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-dark-700">
                        {role === 'superadmin' ? 'Superadmin' : role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-neutral-900 mr-2">{count}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                        ({stats.totalUsers > 0 ? ((count / stats.totalUsers * 100).toFixed(1)) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barre de progression visuelle */}
              <div className="mt-6 space-y-2">
                {stats && Object.entries(stats.usersByRole).map(([role, count]) => (
                  <div key={role}>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          role === 'superadmin' ? 'bg-semantic-error' : 
                          role === 'admin' ? 'bg-primary-700' : 'bg-primary-400'
                        }`}
                        style={{ 
                          width: `${stats.totalUsers > 0 ? (count / stats.totalUsers * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Répartition par langue */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                {t('admin.statistics.languageDistribution', 'Répartition par Langue')}
              </h3>
              
              <div className="space-y-4">
                {stats && Object.entries(stats.usersByLanguage)
                  .sort(([,a], [,b]) => b - a)
                  .map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getLanguageFlag(lang)}</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-dark-700">
                        {getLanguageName(lang)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-neutral-900 mr-2">{count}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                        ({stats.totalUsers > 0 ? ((count / stats.totalUsers * 100).toFixed(1)) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Tendances mensuelles */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              {t('admin.statistics.monthlyTrends', 'Tendances Mensuelles')}
            </h3>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {stats?.usersByMonth.map((item, index) => {
                  const maxCount = Math.max(...(stats.usersByMonth.map(m => m.count)));
                  const width = maxCount > 0 ? (item.count / maxCount * 100) : 0;
                  
                  return (
                    <div key={item.month} className="flex flex-col items-center min-w-16">
                      <div className="text-xs font-bold text-primary-900 mb-1">
                        {item.count}
                      </div>
                      <div className="w-8 bg-primary-100 rounded-t" style={{ height: '120px' }}>
                        <div 
                          className="bg-primary-600 rounded-t transition-all duration-500"
                          style={{ height: `${width}%`, minHeight: item.count > 0 ? '4px' : '0px' }}
                        ></div>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 text-center">
                        {item.month.split('-')[1]}/{item.month.split('-')[0].slice(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Actions rapides */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              {t('admin.statistics.quickActions', 'Actions Rapides')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => window.print()}
              >
                🖨️ {t('admin.statistics.printReport', 'Imprimer le Rapport')}
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => {
                  const data = {
                    exportDate: new Date().toISOString(),
                    statistics: stats
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `stats-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                📊 {t('admin.statistics.exportData', 'Exporter les Données')}
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => window.location.href = '/admin/users'}
              >
                👥 {t('admin.statistics.manageUsers', 'Gérer les Utilisateurs')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}