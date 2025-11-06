// Page de connexion pour l'admin
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AdminLoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si déjà connecté en tant qu'admin
  useEffect(() => {
    if (isAuthenticated && userProfile && ['admin', 'superadmin'].includes(userProfile.role)) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, userProfile, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Vérifier le rôle après connexion
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profileError || !['admin', 'superadmin'].includes(profile?.role || '')) {
          await supabase.auth.signOut();
          throw new Error('Accès réservé aux administrateurs');
        }

        // Rediriger vers le dashboard
        const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-primary-900 mb-2">
            {t('admin.login.title', 'Connexion Admin')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-dark-500">
            {t('admin.login.subtitle', 'Accès sécurisé pour les administrateurs')}
          </p>
        </div>

        <Card elevated>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                {t('auth.email', 'Adresse email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-700 dark:border-primary-dark-700"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                {t('auth.password', 'Mot de passe')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-700 dark:border-primary-dark-700"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-3 bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {t('admin.login.button', 'Se connecter')}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-dark-500">
            {t('admin.login.backToApp', 'Retour à l\'application')}{' '}
            <Link to="/" className="text-primary-700 hover:underline font-medium">
              {t('admin.login.clickHere', 'ici')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}