import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const stored = localStorage.getItem('theme');
      return (stored as Theme) || 'system';
    } catch {
      return 'system';
    }
  });

  const [isDark, setIsDark] = useState(false);

  const applyTheme = (currentTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    try {
      const root = document.documentElement;
      
      if (currentTheme === 'system') {
        // Détecter la préférence système
        const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
        const systemDark = mediaQuery?.matches || false;
        if (systemDark) {
          root.classList.add('dark');
          setIsDark(true);
        } else {
          root.classList.remove('dark');
          setIsDark(false);
        }
      } else if (currentTheme === 'dark') {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.remove('dark');
        setIsDark(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du thème:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Écouter les changements de préférence système
      const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
      
      if (!mediaQuery) return;
      
      const handleChange = () => {
        if (theme === 'system') {
          applyTheme('system');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      
      // Application initiale
      applyTheme(theme);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du thème:', error);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    try {
      setTheme(newTheme);
    } catch (error) {
      console.error('Erreur lors du changement de thème:', error);
    }
  };

  return {
    theme,
    setTheme: changeTheme,
    isDark
  };
}