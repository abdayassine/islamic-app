import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quranAPI, SurahInfo, AyahText, AyahTranslation } from '../services/quranAPI';
import { useAudio } from '../contexts/AudioContext';

interface SurahData {
  surahInfo: SurahInfo;
  arabicText: AyahText[];
  frenchTranslation: AyahTranslation[];
}

export default function SurahDetailPage() {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [bitrate, setBitrate] = useState(64);
  const { currentTrack, isPlaying, playQuranAyah } = useAudio();

  const surahNum = parseInt(surahNumber || '1');

  useEffect(() => {
    if (surahNumber) {
      loadSurahData();
    }
  }, [surahNumber]);

  const loadSurahData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les informations de la sourate
      const surahInfo = await quranAPI.getSurahWithAudio(surahNum);
      
      // Charger la traduction française
      const frenchTranslation = await quranAPI.getSurahWithTranslation(surahNum);

      setSurahData({
        surahInfo,
        arabicText: surahInfo.ayahs,
        frenchTranslation: frenchTranslation.ayahs
      });
    } catch (err) {
      setError('Erreur lors du chargement de la sourate');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAyah = (ayahNumber: number, ayahInSurah: number) => {
    playQuranAyah(surahNum, ayahInSurah, surahData?.surahInfo.name || '', selectedReciter);
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
    return type === 'Meccan' ? 'Mecquoise' : 'Médinoise';
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
          <p style={{ color: '#374151', margin: 0 }}>Chargement de la sourate...</p>
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

  if (error || !surahData) {
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
          <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Erreur</h3>
          <p style={{ color: '#374151', marginBottom: '20px' }}>{error || 'Sourate non trouvée'}</p>
          <Link
            to="/surahs"
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Retour aux souras
          </Link>
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
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '2rem' }}>{getSurahIcon(surahNum)}</span>
            <div>
              <h1 style={{
                margin: '0',
                fontSize: '2.5rem',
                color: '#059669',
                fontWeight: 'bold'
              }}>
                {surahData.surahInfo.name}
              </h1>
              <p style={{
                margin: '5px 0 0 0',
                color: '#6b7280',
                fontSize: '1.1rem',
                fontStyle: 'italic'
              }}>
                {surahData.surahInfo.englishName}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              color: '#059669',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              Sourate {surahNum}
            </div>
            <div style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {getRevelationTypeText(surahData.surahInfo.revelationType)}
            </div>
            <div style={{
              backgroundColor: '#ddd6fe',
              color: '#5b21b6',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {surahData.surahInfo.numberOfAyahs} versets
            </div>
          </div>

          {/* Audio Controls */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>🎵 Contrôles Audio</h3>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#6b7280', fontSize: '0.9rem' }}>
                  Récitateur:
                </label>
                <select
                  value={selectedReciter}
                  onChange={(e) => setSelectedReciter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  {quranAPI.getReciters().map((reciter) => (
                    <option key={reciter.identifier} value={reciter.identifier}>
                      {reciter.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#6b7280', fontSize: '0.9rem' }}>
                  Qualité:
                </label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(Number(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value={32}>32 kbps</option>
                  <option value={64}>64 kbps</option>
                  <option value={128}>128 kbps</option>
                  <option value={192}>192 kbps</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Versets */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#059669',
            marginBottom: '30px',
            fontSize: '1.8rem'
          }}>
            Versets de la Sourate
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {surahData.arabicText.map((ayah, index) => {
              const translation = surahData.frenchTranslation.find(t => t.numberInSurah === ayah.numberInSurah);
              const isCurrentAyah = currentTrack?.surah === surahNum && currentTrack?.ayah === ayah.numberInSurah;
              const isCurrentlyPlaying = isCurrentAyah && isPlaying;

              return (
                <div
                  key={ayah.number}
                  style={{
                    backgroundColor: isCurrentAyah ? '#f0fdf4' : '#f9fafb',
                    border: isCurrentAyah ? '2px solid #10B981' : '1px solid #e5e7eb',
                    borderRadius: '15px',
                    padding: '25px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Verset Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {ayah.numberInSurah}
                    </div>
                    <button
                      onClick={() => handlePlayAyah(ayah.number, ayah.numberInSurah)}
                      disabled={isCurrentlyPlaying}
                      style={{
                        backgroundColor: isCurrentlyPlaying ? '#6b7280' : '#059669',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: isCurrentlyPlaying ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrentlyPlaying) {
                          e.currentTarget.style.backgroundColor = '#047857';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrentlyPlaying) {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }
                      }}
                    >
                      {isCurrentlyPlaying ? '🔊 En lecture' : '▶️ Écouter'}
                    </button>
                  </div>

                  {/* Texte Arabe */}
                  <div style={{
                    fontSize: '1.5rem',
                    lineHeight: '2',
                    textAlign: 'right',
                    direction: 'rtl',
                    fontFamily: '"Amiri", "Arial", sans-serif',
                    marginBottom: '15px',
                    color: '#1f2937'
                  }}>
                    {ayah.textUthmani || ayah.text}
                  </div>

                  {/* Traduction Française */}
                  {translation && (
                    <div style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.7',
                      color: '#4b5563',
                      paddingLeft: '20px',
                      borderLeft: '3px solid #10B981'
                    }}>
                      {translation.translation}
                    </div>
                  )}

                  {/* Métadonnées */}
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    flexWrap: 'wrap'
                  }}>
                    <span>📄 Page {ayah.page}</span>
                    <span>📍 Ruku {ayah.ruku}</span>
                    <span>📖 Hizb {ayah.hizbQuarter}</span>
                    {ayah.sajda && <span>🕋 Sajda</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Link
            to="/surahs"
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Liste des souras
          </Link>

          <div style={{
            display: 'flex',
            gap: '15px'
          }}>
            {surahNum > 1 && (
              <Link
                to={`/surah/${surahNum - 1}`}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sourate {surahNum - 1}
              </Link>
            )}
            {surahNum < 114 && (
              <Link
                to={`/surah/${surahNum + 1}`}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sourate {surahNum + 1}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}