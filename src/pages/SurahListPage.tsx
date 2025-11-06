import { useEffect, useState } from 'react';
import { quranAPI, SurahInfo } from '../services/quranAPI';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SurahListPage() {
  const { t } = useTranslation();
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const surahList = await quranAPI.getSurahList();
      setSurahs(surahList);
    } catch (err) {
      setError(t('surahs.error'));
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSurahIcon = (surahNumber: number): string => {
    const icons = [
      '🌟', '🐄', '👨‍👩‍👧', '👩', '🍽️', '🐑', '🏠', '👁️', '🦅', '🦁',
      '💎', '🗡️', '👑', '📜', '🏠', '🐺', '🐍', '💡', '🐑', '🐟',
      '💍', '🛡️', '🏛️', '💎', '🔍', '🌙', '🎨', '📖', '🏛️', '🔗',
      '⚖️', '📚', '🌱', '🌙', '⚔️', '🕊️', '🏠', '🐍', '🛡️', '🦅',
      '🌟', '💰', '⚔️', '🌊', '🔍', '🏹', '🌙', '🪟', '🏭', '⛵',
      '🏛️', '💎', '⚖️', '📿', '📜', '🏛️', '⛈️', '🐺', '👑', '📜',
      '🏛️', '⚔️', '🦅', '🌙', '🐴', '⚡', '🏛️', '🌧️', '🏜️', '🌊',
      '🏛️', '🔍', '⚔️', '🏹', '🦅', '⚡', '🏛️', '💎', '🌙', '🏛️',
      '⚖️', '📿', '📜', '🏛️', '⛈️', '🐺', '👑', '📜', '🏛️', '⚔️',
      '🦅', '🌙', '🐴', '⚡', '🏛️', '🌧️', '🏜️', '🌊', '🏛️', '🔍',
      '⚔️', '🏹', '🦅', '⚡', '🏛️'
    ];
    return icons[surahNumber - 1] || '📖';
  };

  const getRevelationTypeText = (type: string): string => {
    return type === 'Meccan' ? t('surahs.meccan') : t('surahs.medinan');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #e5e7eb',
            borderTop: '5px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#374151', margin: 0 }}>{t('surahs.loading')}</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>😔</div>
          <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>{t('common.error')}</h3>
          <p style={{ color: '#374151', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={loadSurahs}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '2.5rem',
            color: '#059669',
            fontWeight: 'bold'
          }}>
            {t('surahs.title')}
          </h1>
          <p style={{
            margin: '0',
            color: '#6b7280',
            fontSize: '1.1rem'
          }}>
            {t('surahs.subtitle', { count: surahs.length })}
          </p>
        </div>

        {/* Surahs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {surahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = '#10B981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getSurahIcon(surah.number)}</span>
                    <span style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {surah.number}
                    </span>
                  </div>
                  <div style={{
                    backgroundColor: surah.revelationType === 'Meccan' ? '#fef3c7' : '#ddd6fe',
                    color: surah.revelationType === 'Meccan' ? '#92400e' : '#5b21b6',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {getRevelationTypeText(surah.revelationType)}
                  </div>
                </div>

                {/* Names */}
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{
                    margin: '0 0 5px 0',
                    color: '#1f2937',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {surah.name}
                  </h3>
                  <p style={{
                    margin: '0',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {surah.englishName}
                  </p>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <span style={{
                    color: '#059669',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {surah.numberOfAyahs} {t('surahs.verses')}
                  </span>
                  <span style={{
                    color: '#9ca3af',
                    fontSize: '0.8rem'
                  }}>
                    {t('surahs.viewVerses')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '40px'
        }}>
          <Link
            to="/"
            style={{
              backgroundColor: 'white',
              color: '#059669',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#059669';
            }}
          >
            🏠 {t('navigation.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}