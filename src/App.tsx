import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import Navigation from './components/Navigation';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import { AudioProvider } from './contexts/AudioContext';
import { useTheme } from './hooks/useTheme';

// HomePage chargée immédiatement (first paint rapide)
import HomePage from './pages/HomePage';

// Lazy loading des pages (code splitting)
const PrayerTimesPage = lazy(() => import('./pages/PrayerTimesPage'));
const QuranPage = lazy(() => import('./pages/QuranPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage'));
const DhikrPage = lazy(() => import('./pages/DhikrPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const DuasPage = lazy(() => import('./pages/DuasPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const RadioQuranPage = lazy(() => import('./pages/RadioQuranPage'));

// Pages Admin (lazy loading)
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminStatisticsPage = lazy(() => import('./pages/AdminStatisticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));

// Page de test RTL
const RTLTestPage = lazy(() => import('./pages/RTLTestPage'));

// Composant ProtectedRoute (chargé uniquement si nécessaire)
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Composant de chargement (Loading Fallback)
function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-background-page dark:bg-background-dark-page flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 dark:border-primary-dark-700 mx-auto mb-4"></div>
        <p className="text-neutral-700 dark:text-neutral-dark-700 text-lg">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  
  // Initialiser le thème
  const themeData = useTheme();

  useEffect(() => {
    // Set document direction based on language
    const setDocumentDirection = (language: string) => {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    };

    // Set initial direction
    setDocumentDirection(i18n.language);

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setDocumentDirection(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen bg-background-page dark:bg-background-dark-page">
          {/* Navigation principale - uniquement pour les routes publiques */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Navigation />} />
          </Routes>

          {/* Contenu principal avec ID pour skip link */}
          <main id="main-content" tabIndex={-1} role="main">
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Routes publiques de l'application */}
                <Route path="/" element={<HomePage />} />
                <Route path="/prayer-times" element={<PrayerTimesPage />} />
                <Route path="/quran" element={<QuranPage />} />
                <Route path="/radio" element={<RadioQuranPage />} />
                <Route path="/qibla" element={<QiblaPage />} />
                <Route path="/dhikr" element={<DhikrPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/duas" element={<DuasPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Route de test RTL */}
                <Route path="/rtl-test" element={<RTLTestPage />} />

                {/* Routes d'authentification admin */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Routes protégées du dashboard admin */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/statistics" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminStatisticsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>

          {/* Lecteur audio global persistant */}
          <GlobalAudioPlayer />
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
