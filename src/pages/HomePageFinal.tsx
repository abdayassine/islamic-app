import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const locale = t('common.timeLocale', 'fr-FR');
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const features = [
    {
      title: t('home.feature1Title', '🕐 Horaires de Prière'),
      description: t('home.feature1Desc', 'Consultez les horaires de prière pour votre ville'),
      path: "/prayer-times",
      color: "#4F46E5"
    },
    {
      title: t('home.feature2Title', '📖 Saint Coran'),
      description: t('home.feature2Desc', 'Lisez et écoutez le Saint Coran'),
      path: "/quran",
      color: "#059669"
    },
    {
      title: t('home.feature3Title', '📻 Radio Coran'),
      description: t('home.feature3Desc', 'Écoutez les récitations du Coran en direct'),
      path: "/radio",
      color: "#DC2626"
    },
    {
      title: t('home.feature4Title', '🧭 Direction Qibla'),
      description: t('home.feature4Desc', 'Trouvez la direction de la Mecque'),
      path: "/qibla",
      color: "#7C3AED"
    },
    {
      title: t('home.feature5Title', '📿 Compteur Dhikr'),
      description: t('home.feature5Desc', 'Compteur de dhikr numérique'),
      path: "/dhikr",
      color: "#EA580C"
    },
    {
      title: t('home.feature6Title', '📅 Calendrier Islamique'),
      description: t('home.feature6Desc', 'Calendrier Hijri et événements islamiques'),
      path: "/calendar",
      color: "#0891B2"
    },
    {
      title: t('home.feature7Title', '🤲 Invocations (Duas)'),
      description: t('home.feature7Desc', 'Collection d\'invocations authentiques'),
      path: "/duas",
      color: "#BE185D"
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: (document.documentElement.dir as any) || 'ltr'
    }}>
      {/* En-tête avec horloge */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          🕌 {t('home.title', 'Al-Nour - Application Islamique Moderne')}
        </h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '1.2rem', opacity: 0.9 }}>
          {t('home.subtitle', 'Votre compagnon spirituel quotidien')}
        </p>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '10px 20px',
          borderRadius: '25px',
          display: 'inline-block'
        }}>
          🕐 {formatTime(currentTime)}
        </div>
      </div>

      {/* Grille des fonctionnalités */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        marginBottom: '40px'
      }}>
        {features.map((feature, index) => (
          <Link 
            key={index}
            to={feature.path}
            style={{ 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '2px solid #e5e7eb',
              padding: '25px',
              borderRadius: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = feature.color;
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            >
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '1.3rem',
                color: feature.color,
                textAlign: 'center'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                margin: '0', 
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Section authentification */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#374151' }}>
          👤 {t('home.personalSpace', 'Espace Personnel')}
        </h2>
        <p style={{ margin: '0 0 20px 0', color: '#6b7280' }}>
          {t('home.personalSpaceDesc', 'Connectez-vous pour accéder à vos paramètres personnalisés')}
        </p>
        <Link 
          to="/auth"
          style={{
            display: 'inline-block',
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3730A3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          {t('auth.loginRegister', 'Se connecter / S\'inscrire')}
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#9ca3af',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{ margin: '0' }}>
          {t('home.footer', 'Créé par MiniMax Agent • Application Islamique Moderne')}
        </p>
      </div>
    </div>
  );
}