import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  LanguageIcon, 
  ShieldCheckIcon,
  HomeIcon,
  ClockIcon,
  BookOpenIcon,
  RadioIcon,
  MapPinIcon,
  SparklesIcon,
  CalendarDaysIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ClockIcon as ClockIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  RadioIcon as RadioIconSolid,
} from '@heroicons/react/24/solid';

// Language Selector Component
function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: t('language.fr'), flag: '🇫🇷' },
    { code: 'ar', name: t('language.ar'), flag: '🇸🇦' },
    { code: 'en', name: t('language.en'), flag: '🇺🇸' }
  ];

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          email: user.email,
          language_preference: langCode,
          updated_at: new Date().toISOString()
        });
    }
    
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200 rounded-md transition-colors focus-visible-ring"
        aria-label={t('language.selectLanguage')}
        aria-expanded={isOpen}
      >
        <LanguageIcon className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:block">{currentLanguage?.flag}</span>
        <span className="text-xs">{currentLanguage?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-neutral-dark-100 border border-neutral-200 dark:border-neutral-dark-300 rounded-md shadow-lg dark:shadow-dark-lg py-1 min-w-[150px] z-50 animate-scaleIn">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-neutral-dark-200 flex items-center gap-3 transition-colors focus-visible-ring ${
                i18n.language === language.code ? 'bg-primary-50 dark:bg-neutral-dark-200 text-primary-700 dark:text-primary-dark-700' : 'text-neutral-700 dark:text-neutral-dark-700'
              }`}
            >
              <span aria-hidden="true">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { 
      name: t('navigation.home'), 
      path: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    { 
      name: t('navigation.prayerTimes'), 
      path: '/prayer-times',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
    },
    { 
      name: t('navigation.quran'), 
      path: '/quran',
      icon: BookOpenIcon,
      iconSolid: BookOpenIconSolid,
    },
    { 
      name: t('navigation.radio', 'Radio'), 
      path: '/radio',
      icon: RadioIcon,
      iconSolid: RadioIconSolid,
    },
    { 
      name: t('navigation.qibla'), 
      path: '/qibla',
      icon: MapPinIcon,
    },
    { 
      name: t('navigation.dhikr'), 
      path: '/dhikr',
      icon: SparklesIcon,
    },
    { 
      name: t('navigation.calendar'), 
      path: '/calendar',
      icon: CalendarDaysIcon,
    },
    { 
      name: t('navigation.duas'), 
      path: '/duas',
      icon: HandRaisedIcon,
    },
  ];

  // Items principaux pour bottom nav mobile (les 4 plus importants)
  const mobileBottomItems = navItems.slice(0, 4);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Skip link pour accessibilité
  const SkipLink = () => (
    <a 
      href="#main-content" 
      className="skip-link focus-visible-ring"
    >
      Aller au contenu principal
    </a>
  );

  return (
    <>
      <SkipLink />
      
      {/* Top Navigation - Desktop & Mobile */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background-page dark:bg-background-dark-page border-b border-neutral-300 dark:border-neutral-dark-300 backdrop-blur-md"
        role="banner"
        aria-label="Navigation principale"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 focus-visible-ring rounded-md"
              aria-label="IslamApp - Accueil"
            >
              <div className="w-10 h-10 bg-primary-700 dark:bg-primary-dark-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold" aria-hidden="true">إ</span>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-dark-900 text-lg hidden sm:block">
                IslamApp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2" role="navigation">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-base focus-visible-ring ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-neutral-dark-200 text-primary-700 dark:text-primary-dark-700 border-b-2 border-primary-700 dark:border-primary-dark-700'
                      : 'text-neutral-700 dark:text-neutral-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu, Theme Toggle & Language Selector */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSelector />
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-700 dark:text-neutral-dark-700">
                    {userProfile?.full_name || userProfile?.email || user?.email}
                  </span>
                  {userProfile?.role === 'superadmin' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-semantic-success dark:text-semantic-dark-success bg-semantic-success bg-opacity-10 dark:bg-opacity-20 border border-semantic-success dark:border-semantic-dark-success rounded-md transition-colors focus-visible-ring"
                    >
                      <ShieldCheckIcon className="w-4 h-4" aria-hidden="true" />
                      Superadmin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200 rounded-md transition-colors focus-visible-ring"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200 rounded-md transition-colors focus-visible-ring"
                >
                  <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                  {t('common.login')}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button, Theme Toggle & Language Selector */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target p-2 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-dark-200 transition-colors focus-visible-ring"
                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-neutral-900 dark:text-neutral-dark-900" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-neutral-900 dark:text-neutral-dark-900" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-300 dark:border-neutral-dark-300 bg-background-page dark:bg-background-dark-page animate-slideInRight">
            <div className="container mx-auto py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`touch-target block px-4 py-3 rounded-md text-base font-medium transition-colors focus-visible-ring ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-neutral-dark-200 text-primary-700 dark:text-primary-dark-700'
                      : 'text-neutral-700 dark:text-neutral-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-dark-500">
                    {userProfile?.full_name || userProfile?.email || user?.email}
                  </div>
                  {userProfile?.role === 'superadmin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-semantic-success dark:text-semantic-dark-success bg-semantic-success bg-opacity-10 dark:bg-opacity-20 border border-semantic-success dark:border-semantic-dark-success rounded-md focus-visible-ring"
                    >
                      <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
                      Superadmin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base font-medium text-primary-700 dark:text-primary-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200 rounded-md focus-visible-ring"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-primary-700 dark:text-primary-dark-700 hover:bg-primary-50 dark:hover:bg-neutral-dark-200 rounded-md focus-visible-ring"
                >
                  <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                  {t('common.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-dark-100 border-t border-neutral-200 dark:border-neutral-dark-300 shadow-lg dark:shadow-dark-lg safe-area-pb"
          role="navigation"
          aria-label="Navigation mobile"
        >
          <div className="grid grid-cols-4 h-16">
            {mobileBottomItems.map((item) => {
              const Icon = isActive(item.path) ? (item.iconSolid || item.icon) : item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`touch-target flex flex-col items-center justify-center gap-1 transition-colors focus-visible-ring ${
                    isActive(item.path)
                      ? 'text-primary-700 dark:text-primary-dark-700 bg-primary-50 dark:bg-neutral-dark-200'
                      : 'text-neutral-600 dark:text-neutral-dark-500 hover:text-primary-700 dark:hover:text-primary-dark-700'
                  }`}
                  aria-label={item.name}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span className="text-xs font-medium truncate max-w-[60px]">
                    {item.name.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
