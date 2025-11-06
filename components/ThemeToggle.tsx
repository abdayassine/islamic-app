import React from 'react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '🌙';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Mode Clair';
      case 'dark':
        return 'Mode Sombre';
      case 'system':
        return 'Mode Système';
      default:
        return 'Mode Sombre';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      title={getLabel()}
      aria-label={getLabel()}
    >
      <span className="text-xl">{getIcon()}</span>
    </button>
  );
}