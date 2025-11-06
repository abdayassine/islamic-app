import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function PrayerTimesPage() {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const updateDirection = () => {
      setIsRTL(i18n.language === 'ar');
    };
    
    updateDirection();
    
    const handleLanguageChange = () => {
      updateDirection();
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const prayers = [
    { 
      name: `${t('prayertimes.fajr')} (${t('prayertimes.fajr_desc')})`, 
      time: '06:30', 
      icon: '🌅' 
    },
    { 
      name: `${t('prayertimes.dhuhr')} (${t('prayertimes.dhuhr_desc')})`, 
      time: '13:15', 
      icon: '☀️' 
    },
    { 
      name: `${t('prayertimes.asr')} (${t('prayertimes.asr_desc')})`, 
      time: '15:45', 
      icon: '🌤️' 
    },
    { 
      name: `${t('prayertimes.maghrib')} (${t('prayertimes.maghrib_desc')})`, 
      time: '18:20', 
      icon: '🌆' 
    },
    { 
      name: `${t('prayertimes.isha')} (${t('prayertimes.isha_desc')})`, 
      time: '19:50', 
      icon: '🌙' 
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: isRTL ? '"Noto Naskh Arabic", "Noto Sans Arabic", system-ui, -apple-system, sans-serif' : 'system-ui, -apple-system, sans-serif',
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '25px',
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          🕐 {t('prayertimes.titre')}
        </h1>
        <p style={{ 
          margin: '0', 
          opacity: 0.9,
          textAlign: 'center'
        }}>
          {t('prayertimes.sous_titre')}
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '20px' }}>{t('prayertimes.localisation')}</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {prayers.map((prayer, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{prayer.icon}</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: '#374151',
                  textAlign: isRTL ? 'right' : 'left'
                }}>{prayer.name}</span>
              </div>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: '#4F46E5',
                backgroundColor: 'white',
                padding: '5px 15px',
                borderRadius: '20px'
              }}>
                {prayer.time}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '25px',
          padding: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '10px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{ 
            margin: '0', 
            color: '#92400e', 
            textAlign: 'center',
            direction: 'ltr' // Garder la direction LTR pour l'emoji d'avertissement
          }}>
            ⚠️ {t('prayertimes.avertissement')}
          </p>
        </div>
      </div>
    </div>
  );
}