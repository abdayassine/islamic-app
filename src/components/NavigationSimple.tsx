import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function NavigationSimple() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: '🏠', key: 'home' },
    { path: '/prayer-times', icon: '🕐', key: 'prayerTimes' },
    { path: '/quran', icon: '📖', key: 'quran' },
    { path: '/surahs', icon: '📜', key: 'surahs' },
    { path: '/auth', icon: '👤', key: 'auth' }
  ];

  const getNavItemLabel = (item: any) => {
    const translationKey = `navigation.${item.key}`;
    return `${item.icon} ${t(translationKey, item.key)}`;
  };

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '15px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      direction: (document.documentElement.dir as any) || 'ltr'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <Link 
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🕌 Al-Nour
        </Link>

        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#60a5fa' : 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: location.pathname === item.path ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                border: location.pathname === item.path ? '1px solid #60a5fa' : '1px solid transparent',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {getNavItemLabel(item)}
            </Link>
          ))}
          
          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
}