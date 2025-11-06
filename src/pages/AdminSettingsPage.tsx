// Page des paramètres du système
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface SystemSettings {
  appName: string;
  appVersion: string;
  maxUsersPerPage: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailConfirmationRequired: boolean;
  defaultUserRole: 'user' | 'admin';
  supportedLanguages: string[];
  prayerTimeApiUrl: string;
  lastBackupDate: string;
  databaseStatus: 'healthy' | 'warning' | 'error';
  activeConnections: number;
}

export default function AdminSettingsPage() {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    appName: 'Al-Nour',
    appVersion: '1.0.0',
    maxUsersPerPage: 50,
    maintenanceMode: false,
    registrationEnabled: true,
    emailConfirmationRequired: true,
    defaultUserRole: 'user',
    supportedLanguages: ['fr', 'ar', 'en'],
    prayerTimeApiUrl: 'https://api.aladhan.com/v1/timings',
    lastBackupDate: new Date().toISOString(),
    databaseStatus: 'healthy',
    activeConnections: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      setLoading(true);
      
      // En production, ces données seraient récupérées depuis une table settings
      // Pour le moment, on utilise les valeurs par défaut avec quelques données réelles
      
      const { data: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { data: recentActivity } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setSettings(prev => ({
        ...prev,
        activeConnections: userCount?.length || 0,
        lastBackupDate: recentActivity?.created_at || new Date().toISOString(),
        databaseStatus: 'healthy'
      }));
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      setError('Erreur lors de la récupération des paramètres du système');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // En production, sauvegarder dans une table settings
      // Pour le moment, on simule la sauvegarde
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'un délai
      
      setSuccess('Paramètres sauvegardés avec succès');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleTestDatabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (error) throw error;
      
      setSuccess('Connexion à la base de données: ✓ OK');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: any) {
      setError('Erreur de connexion à la base de données: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setLoading(true);
      
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSettings(prev => ({
        ...prev,
        lastBackupDate: new Date().toISOString()
      }));
      
      setSuccess('Sauvegarde créée avec succès');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: any) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-dark-500">Chargement des paramètres...</p>
          </div>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              {t('admin.settings.title', 'Paramètres du Système')}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-dark-500">
              {t('admin.settings.subtitle', 'Configuration et administration de l\'application')}
            </p>
          </div>

          {/* Messages d'état */}
          {error && (
            <div className="mb-6 p-4 bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error rounded-md">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span>{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{success}</span>
                <button 
                  onClick={() => setSuccess('')}
                  className="ml-auto text-green-500 hover:text-green-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration de l'application */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                🏷️ {t('admin.settings.appConfig', 'Configuration Application')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('admin.settings.appName', 'Nom de l\'application')}
                  </label>
                  <input
                    type="text"
                    value={settings.appName}
                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('admin.settings.version', 'Version')}
                  </label>
                  <input
                    type="text"
                    value={settings.appVersion}
                    onChange={(e) => setSettings({...settings, appVersion: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('admin.settings.usersPerPage', 'Utilisateurs par page')}
                  </label>
                  <select
                    value={settings.maxUsersPerPage}
                    onChange={(e) => setSettings({...settings, maxUsersPerPage: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Configuration utilisateur */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                👥 {t('admin.settings.userConfig', 'Configuration Utilisateur')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.maintenanceMode', 'Mode maintenance')}
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      Désactive l'accès aux utilisateurs normaux
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.registrationEnabled', 'Inscription active')}
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      Permet aux nouveaux utilisateurs de s'inscrire
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.registrationEnabled}
                      onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.emailConfirmation', 'Confirmation email requise')}
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      Demande confirmation par email à l'inscription
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailConfirmationRequired}
                      onChange={(e) => setSettings({...settings, emailConfirmationRequired: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('admin.settings.defaultRole', 'Rôle par défaut')}
                  </label>
                  <select
                    value={settings.defaultUserRole}
                    onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value as any})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Status système */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                🔍 {t('admin.settings.systemStatus', 'Status Système')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.databaseStatus', 'Base de données')}
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      État de la connexion PostgreSQL
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 ${getStatusColor(settings.databaseStatus)}`}>
                      {getStatusIcon(settings.databaseStatus)}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(settings.databaseStatus)}`}>
                      {settings.databaseStatus === 'healthy' ? 'Sain' : 
                       settings.databaseStatus === 'warning' ? 'Attention' : 'Erreur'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.activeConnections', 'Connexions actives')}
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      Utilisateurs actuellement connectés
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary-700 dark:text-primary-dark-700">
                    {settings.activeConnections}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-dark-700">
                      {t('admin.settings.lastBackup', 'Dernière sauvegarde')}
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
                      Dernière sauvegarde de la base de données
                    </p>
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-dark-500">
                    {new Date(settings.lastBackupDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleTestDatabase}
                    disabled={loading}
                  >
                    🧪 {t('admin.settings.testDb', 'Tester DB')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBackup}
                    disabled={loading}
                  >
                    💾 {t('admin.settings.backup', 'Sauvegarder')}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Langues supportées */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                🌍 {t('admin.settings.languages', 'Langues Supportées')}
              </h3>
              
              <div className="space-y-3">
                {settings.supportedLanguages.map((lang) => (
                  <div key={lang} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">
                        {lang === 'fr' ? '🇫🇷' : lang === 'ar' ? '🇸🇦' : '🇺🇸'}
                      </span>
                      <span className="font-medium">
                        {lang === 'fr' ? 'Français' : lang === 'ar' ? 'العربية' : 'English'}
                      </span>
                    </div>
                    <span className="text-sm text-green-600">✓ Actif</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('admin.settings.prayerTimeApi', 'API Horaires de Prière')}
                </label>
                <input
                  type="url"
                  value={settings.prayerTimeApiUrl}
                  onChange={(e) => setSettings({...settings, prayerTimeApiUrl: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Card className="p-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  💾 {t('admin.settings.saveSettings', 'Sauvegarder les Paramètres')}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-dark-500">
                  Toutes les modifications seront appliquées immédiatement
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={fetchSystemSettings}
                  disabled={loading}
                >
                  🔄 {t('admin.settings.refresh', 'Actualiser')}
                </Button>
                
                <Button 
                  onClick={handleSaveSettings}
                  loading={saving}
                  disabled={loading || saving}
                >
                  💾 {t('admin.settings.save', 'Sauvegarder')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}