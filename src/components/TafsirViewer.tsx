import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, BookOpen, Languages, AlertCircle, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

interface TafsirViewerProps {
  verseKey: string; // Format: "1:1" (surah:ayah)
  surahName: string;
  ayahNumber: number;
  surahNumber: number;
  totalAyahs: number; // Nombre total de versets dans la sourate
  onClose: () => void;
  onNavigate?: (verseKey: string) => void; // Callback pour naviguer entre versets
}

interface TafsirData {
  text: string;
  resourceName: string;
  languageName: string;
}

type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

// Composant LanguageSelector mémoïsé
interface LanguageSelectorProps {
  selectedLanguage: 'ar' | 'en' | 'fr';
  loading: boolean;
  onLanguageChange: (lang: 'ar' | 'en' | 'fr') => void;
}

const LanguageSelector = memo(({ selectedLanguage, loading, onLanguageChange }: LanguageSelectorProps) => {
  const TAFSIR_EDITIONS = {
    ar: { displayName: 'العربية' },
    en: { displayName: 'English' },
    fr: { displayName: 'Français' },
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <Languages className="w-4 h-4 text-primary-200 flex-shrink-0" aria-hidden="true" />
      <div className="flex gap-2" role="tablist" aria-label="Sélection de la langue">
        {(['fr', 'en', 'ar'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            disabled={loading}
            role="tab"
            aria-selected={selectedLanguage === lang}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors focus-visible-ring ${
              selectedLanguage === lang
                ? 'bg-white text-primary-800'
                : 'bg-white/10 text-white hover:bg-white/20'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {TAFSIR_EDITIONS[lang].displayName}
          </button>
        ))}
      </div>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

// Composant FontSizeControl mémoïsé
interface FontSizeControlProps {
  fontSize: FontSize;
  onIncrease: () => void;
  onDecrease: () => void;
}

const FontSizeControl = memo(({ fontSize, onIncrease, onDecrease }: FontSizeControlProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1">
      <button
        onClick={onDecrease}
        disabled={fontSize === 'small'}
        className="touch-target-small p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible-ring"
        aria-label="Diminuer la taille du texte"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <span className="text-xs font-medium px-2" aria-live="polite">
        Aa
      </span>
      <button
        onClick={onIncrease}
        disabled={fontSize === 'xlarge'}
        className="touch-target-small p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible-ring"
        aria-label="Augmenter la taille du texte"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
});

FontSizeControl.displayName = 'FontSizeControl';

// Composant SkeletonLoader mémoïsé
const SkeletonLoader = memo(() => (
  <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
    <div className="space-y-4 w-full max-w-2xl">
      <div className="skeleton h-4 rounded w-3/4"></div>
      <div className="skeleton h-4 rounded w-1/2"></div>
      <div className="skeleton h-4 rounded w-5/6"></div>
      <div className="skeleton h-4 rounded w-2/3"></div>
    </div>
    <span className="sr-only">Chargement du Tafsir...</span>
  </div>
));

SkeletonLoader.displayName = 'SkeletonLoader';

export default function TafsirViewer({ 
  verseKey, 
  surahName, 
  ayahNumber,
  surahNumber,
  totalAyahs,
  onClose,
  onNavigate
}: TafsirViewerProps) {
  const { t } = useTranslation();
  const [tafsir, setTafsir] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en' | 'fr'>('fr');
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  // Éditions Tafsir disponibles via alquran.cloud API
  const TAFSIR_EDITIONS = useMemo(() => ({
    ar: { 
      edition: 'ar.jalalayn', 
      name: 'Tafsir Al-Jalalayn',
      displayName: 'العربية'
    },
    en: { 
      edition: 'en.jalalayn', 
      name: 'Tafsir Al-Jalalayn (English)',
      displayName: 'English'
    },
    fr: { 
      edition: 'fr.hamidullah',
      name: 'Traduction Hamidullah',
      displayName: 'Français'
    },
  }), []);

  const fontSizeClasses: Record<FontSize, string> = useMemo(() => ({
    small: 'text-sm leading-relaxed',
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose'
  }), []);

  const fontSizeClassesArabic: Record<FontSize, string> = useMemo(() => ({
    small: 'text-lg leading-loose',
    normal: 'text-xl leading-loose',
    large: 'text-2xl leading-loose',
    xlarge: 'text-3xl leading-loose'
  }), []);

  // Fonction de chargement avec cache (dans le useCallback pour éviter re-création)
  const loadTafsir = useCallback(async (lang: 'ar' | 'en' | 'fr') => {
    setLoading(true);
    setError(null);

    try {
      const resource = TAFSIR_EDITIONS[lang];
      const cacheKey = `tafsir_${verseKey}_${lang}`;
      
      // Vérifier le cache local storage
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(`${cacheKey}_time`);
      
      // Cache valide pendant 1 heure
      if (cachedData && cachedTime) {
        const age = Date.now() - parseInt(cachedTime);
        if (age < 60 * 60 * 1000) {
          setTafsir(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      const apiUrl = `https://api.alquran.cloud/v1/ayah/${verseKey}/${resource.edition}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code !== 200 || !data.data) {
        throw new Error('Données invalides reçues de l\'API');
      }

      const ayahData = data.data;
      
      const tafsirData = lang === 'fr' 
        ? {
            text: ayahData.text + '\n\n' + 
                  'Note: Le Tafsir complet en français n\'est pas encore disponible via cette API. ' +
                  'La traduction française de Hamidullah est affichée. Pour un Tafsir complet en français, ' +
                  'consultez les ressources QUL (Quranic Universal Library) qui proposent "Al-Mukhtasar" et d\'autres commentaires en français.',
            resourceName: resource.name,
            languageName: 'Français',
          }
        : {
            text: ayahData.text,
            resourceName: resource.name,
            languageName: lang === 'ar' ? 'Arabe' : 'Anglais',
          };

      // Mettre en cache
      localStorage.setItem(cacheKey, JSON.stringify(tafsirData));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
      setTafsir(tafsirData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Impossible de charger le Tafsir: ${errorMessage}`);
      console.error('Erreur Tafsir:', err);
    } finally {
      setLoading(false);
    }
  }, [verseKey, TAFSIR_EDITIONS]);

  useEffect(() => {
    loadTafsir(selectedLanguage);
  }, [selectedLanguage, loadTafsir]);

  // Callbacks mémoïsés pour la navigation
  const handlePreviousVerse = useCallback(() => {
    if (ayahNumber > 1 && onNavigate) {
      const newVerseKey = `${surahNumber}:${ayahNumber - 1}`;
      onNavigate(newVerseKey);
    }
  }, [ayahNumber, surahNumber, onNavigate]);

  const handleNextVerse = useCallback(() => {
    if (ayahNumber < totalAyahs && onNavigate) {
      const newVerseKey = `${surahNumber}:${ayahNumber + 1}`;
      onNavigate(newVerseKey);
    }
  }, [ayahNumber, totalAyahs, surahNumber, onNavigate]);

  // Callbacks mémoïsés pour les contrôles de taille
  const increaseFontSize = useCallback(() => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  }, [fontSize]);

  const decreaseFontSize = useCallback(() => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  }, [fontSize]);

  const handleLanguageChange = useCallback((lang: 'ar' | 'en' | 'fr') => {
    setSelectedLanguage(lang);
  }, []);

  // useMemo pour les capacités de navigation
  const canGoPrevious = useMemo(() => ayahNumber > 1, [ayahNumber]);
  const canGoNext = useMemo(() => ayahNumber < totalAyahs, [ayahNumber, totalAyahs]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="tafsir-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
        {/* En-tête */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="tafsir-title" className="text-2xl font-bold mb-1">Tafsîr</h2>
                <p className="text-primary-200">
                  {surahName} - Verset {ayahNumber}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="touch-target w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors focus-visible-ring"
              aria-label="Fermer le Tafsir"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Contrôles */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              loading={loading}
              onLanguageChange={handleLanguageChange}
            />
            <FontSizeControl
              fontSize={fontSize}
              onIncrease={increaseFontSize}
              onDecrease={decreaseFontSize}
            />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6" role="main">
          {loading && <SkeletonLoader />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-red-900 mb-1">Erreur de chargement</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {tafsir && !loading && (
            <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-2 text-sm text-neutral-600 pb-3 border-b border-neutral-200 dark:border-neutral-dark-300">
                <span className="font-semibold">{tafsir.resourceName}</span>
                <span aria-hidden="true">•</span>
                <span>{tafsir.languageName}</span>
              </div>

              <div 
                className={`prose max-w-none ${
                  selectedLanguage === 'ar' 
                    ? `text-right font-arabic ${fontSizeClassesArabic[fontSize]}` 
                    : fontSizeClasses[fontSize]
                }`}
                dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
              >
                {tafsir.text.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 text-neutral-800">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation entre versets */}
        {onNavigate && (
          <div className="flex-shrink-0 bg-neutral-50 border-t border-neutral-200 p-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto gap-4">
              <button
                onClick={handlePreviousVerse}
                disabled={!canGoPrevious}
                className="touch-target flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible-ring"
                aria-label={`Verset précédent (${ayahNumber - 1})`}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium hidden sm:inline">Verset précédent</span>
              </button>
              
              <div className="text-sm text-neutral-600 font-medium" aria-live="polite">
                Verset {ayahNumber} / {totalAyahs}
              </div>
              
              <button
                onClick={handleNextVerse}
                disabled={!canGoNext}
                className="touch-target flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible-ring"
                aria-label={`Verset suivant (${ayahNumber + 1})`}
              >
                <span className="text-sm font-medium hidden sm:inline">Verset suivant</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Pied de page */}
        <div className="flex-shrink-0 border-t border-neutral-200 p-4 bg-neutral-50">
          <p className="text-xs text-neutral-600 text-center">
            {selectedLanguage === 'fr' 
              ? 'Traduction basée sur des sources authentiques reconnues - API: alquran.cloud'
              : 'Tafsîr basé sur des sources authentiques reconnues - API: alquran.cloud'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
