import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Si la connexion est réussie, vérifier le rôle
        if (data.user) {
          // Accès spécial pour le superadmin
          if (data.user.email === 'abdayssin@gmail.com') {
            navigate('/admin/dashboard');
            return;
          }
          
          // Vérification normale du rôle
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('user_id', data.user.id)
              .single();
            
            // Rediriger selon le rôle
            if (profile?.role === 'superadmin' || profile?.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/');
            }
          } catch (error) {
            console.error('Erreur lors de la vérification du rôle:', error);
            // En cas d'erreur, rediriger vers l'accueil
            navigate('/');
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Créer le profil utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').insert({
            user_id: user.id,
            email: user.email,
            full_name: email.split('@')[0],
            language_preference: i18n.language
          });
        }
        
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-md">
        <Card elevated>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h1>
            <p className="text-neutral-700 dark:text-neutral-dark-700">
              {isLogin
                ? t('auth.title')
                : t('auth.registerTitle')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-700 dark:border-primary-dark-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-700 dark:border-primary-dark-700"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {isLogin ? t('auth.loginButton') : t('auth.registerButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary-700 hover:underline"
            >
              {isLogin
                ? t('auth.switchToRegister')
                : t('auth.switchToLogin')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
