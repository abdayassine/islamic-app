// Hook pour la gestion de l'authentification et des rôles
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'superadmin' | 'admin' | 'user';
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'utilisateur actuel
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          setLoading(false);
          return;
        }

        if (user) {
          setUser(user);
          setIsAuthenticated(true);
          
          // Récupérer le profil utilisateur avec le rôle (approche robuste)
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (!profileError && profile) {
              setUserProfile(profile);
            } else {
              // En cas d'erreur, créer un profil de base
              console.warn('Profil non trouvé, création d\'un profil par défaut');
              const defaultProfile = {
                id: user.id,
                user_id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
                role: user.email === 'abdayssin@gmail.com' ? 'superadmin' : 'user',
                language_preference: 'fr',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(defaultProfile as User);
            }
          } catch (profileError) {
            console.error('Erreur lors de la récupération du profil:', profileError);
            // Créer un profil par défaut
            const defaultProfile = {
              id: user.id,
              user_id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
              role: user.email === 'abdayssin@gmail.com' ? 'superadmin' : 'user',
              language_preference: 'fr',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(defaultProfile as User);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        } else if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Récupérer le profil avec gestion d'erreur robuste
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (profile) {
              setUserProfile(profile);
            } else {
              // Profil par défaut si pas trouvé
              const defaultProfile = {
                id: session.user.id,
                user_id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
                role: session.user.email === 'abdayssin@gmail.com' ? 'superadmin' : 'user',
                language_preference: 'fr',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(defaultProfile as User);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            // Profil par défaut en cas d'erreur
            const defaultProfile = {
              id: session.user.id,
              user_id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
              role: session.user.email === 'abdayssin@gmail.com' ? 'superadmin' : 'user',
              language_preference: 'fr',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(defaultProfile as User);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour vérifier si l'utilisateur est un admin ou superadmin
  const isAdminOrSuperAdmin = () => {
    return userProfile?.role === 'admin' || userProfile?.role === 'superadmin';
  };

  // Fonction pour obtenir l'URL de redirection appropriée
  const getRedirectUrl = () => {
    if (isAdminOrSuperAdmin()) {
      return '/admin/dashboard';
    }
    return '/';
  };

  return {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signOut,
    isAdmin: userProfile?.role === 'admin' || userProfile?.role === 'superadmin',
    isSuperAdmin: userProfile?.role === 'superadmin',
    isAdminOrSuperAdmin,
    getRedirectUrl
  };
}