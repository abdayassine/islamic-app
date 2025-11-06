import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import TafsirViewer from '../components/TafsirViewer';
import { getSurahList, getSurahWithTranslation } from '../lib/api';
import { Surah } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { Play, BookOpen, Volume2 } from 'lucide-react';
import { useCachedAPI } from '../hooks/useCachedAPI';
import { useRTL, useRTLClasses, ArabicText } from '../hooks/useRTL';

// Composant AyahCard extrait et mémoïsé
interface AyahCardProps {
  ayah: any;
  index: number;
  surahNumber: number;
  surahName: string;
  frenchText: string;
  isPlaying: boolean;
  onPlayAyah: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  onOpenTafsir: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

const AyahCard = memo(({ 
  ayah, 
  index, 
  surahNumber,
  surahName,
  frenchText, 
  isPlaying, 
  onPlayAyah, 
  onOpenTafsir 
}: AyahCardProps) => {
  const { isRTL } = useRTL();
  const { getTextAlign } = useRTL();
  
  return (
    <Card className="relative">
      <div className="space-y-4">
        <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
          <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {ayah.numberInSurah}
          </div>
          <ArabicText
            variant="quran"
            className="text-2xl leading-loose flex-1 block"
          >
            {ayah.text}
          </ArabicText>
        </div>
        <div className="border-t border-neutral-300 dark:border-neutral-dark-300 pt-4">
          <p className={`text-base text-neutral-700 leading-relaxed ${getTextAlign()}`}>
            {frenchText}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-2 pt-2`}>
          {/* Bouton lecture */}
          <button
            onClick={() => onPlayAyah(surahNumber, surahName, ayah.numberInSurah)}
            className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isPlaying
                ? 'bg-primary-700 text-white shadow-md dark:shadow-dark-md dark:shadow-dark-md'
                : 'bg-primary-100 dark:bg-primary-dark-100 text-primary-800 dark:text-primary-dark-900 hover:bg-primary-200 dark:hover:bg-primary-dark-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>En lecture</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Écouter</span>
              </>
            )}
          </button>

          {/* Bouton Tafsir */}
          <button
            onClick={() => onOpenTafsir(surahNumber, surahName, ayah.numberInSurah)}
            className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gold-100 text-gold-800 hover:bg-gold-200 transition-colors`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tafsîr</span>
          </button>
        </div>
      </div>
    </Card>
  );
});

AyahCard.displayName = 'AyahCard';

// Composant SurahCard extrait et mémoïsé
interface SurahCardProps {
  surah: Surah;
  isPlaying: boolean;
  onSelectSurah: (number: number) => void;
  onPlaySurah: (surah: Surah) => void;
}

const SurahCard = memo(({ surah, isPlaying, onSelectSurah, onPlaySurah }: SurahCardProps) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  
  return (
    <Card
      hover
      className="relative"
    >
      <div 
        className="cursor-pointer"
        onClick={() => onSelectSurah(surah.number)}
      >
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-3 mb-2`}>
              <div className="w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {surah.number}
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-dark-900">
                {surah.englishName}
              </h3>
            </div>
            <p className="text-sm text-neutral-700 mb-1">
              {surah.englishNameTranslation}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-dark-500">
              {surah.numberOfAyahs} {t('quran.ayah')} • {surah.revelationType}
            </p>
          </div>
          <ArabicText variant="title" className="text-2xl">
            {surah.name}
          </ArabicText>
        </div>
      </div>

      {/* Bouton lecture sourate */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlaySurah(surah);
        }}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-primary-700 text-white shadow-lg dark:shadow-dark-lg dark:shadow-dark-lg scale-110'
            : 'bg-primary-100 dark:bg-primary-dark-100 text-primary-700 dark:text-primary-dark-700 hover:bg-primary-200 dark:hover:bg-primary-dark-200'
        }`}
        title="Écouter la sourate complète"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <Play className={`w-5 h-5 ${isRTL ? 'mr-0.5' : 'ml-0.5'}`} />
        )}
      </button>
    </Card>
  );
});

SurahCard.displayName = 'SurahCard';

export default function QuranPage() {
  const { t } = useTranslation();
  const { isRTL, getTextAlign } = useRTL();
  const { playQuranAyah, playQuranSurah, currentTrack, isPlaying } = useAudio();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [tafsirView, setTafsirView] = useState<{ 
    verseKey: string; 
    surahName: string; 
    ayahNumber: number; 
    surahNumber: number;
    totalAyahs: number;
  } | null>(null);

  // Cache API pour la liste des sourates
  const {
    data: surahs,
    loading: loadingSurahs,
  } = useCachedAPI<Surah[]>(
    () => getSurahList(),
    [],
    {
      cacheKey: 'surah_list',
      ttl: 24 * 60 * 60 * 1000, // 24 heures - les sourates ne changent jamais
    }
  );

  // Cache API pour la sourate sélectionnée
  const {
    data: ayahs,
    loading: loadingAyahs,
  } = useCachedAPI<{ arabic: any[]; french: any[] } | null>(
    () => selectedSurah ? getSurahWithTranslation(selectedSurah) : Promise.resolve(null),
    [selectedSurah],
    {
      cacheKey: `surah_${selectedSurah}`,
      ttl: 24 * 60 * 60 * 1000, // 24 heures
      enabled: selectedSurah !== null,
    }
  );

  // useMemo pour les données de la sourate courante
  const currentSurahData = useMemo(() => 
    surahs?.find(s => s.number === selectedSurah),
    [surahs, selectedSurah]
  );

  // useCallback pour les handlers
  const handlePlaySurah = useCallback((surah: Surah) => {
    playQuranSurah(surah.number, surah.englishName);
  }, [playQuranSurah]);

  const handlePlayAyah = useCallback((surahNumber: number, surahName: string, ayahNumber: number) => {
    playQuranAyah(surahNumber, ayahNumber, surahName);
  }, [playQuranAyah]);

  const handleOpenTafsir = useCallback((surahNumber: number, surahName: string, ayahNumber: number) => {
    const surahData = surahs?.find(s => s.number === surahNumber);
    setTafsirView({
      verseKey: `${surahNumber}:${ayahNumber}`,
      surahName,
      ayahNumber,
      surahNumber,
      totalAyahs: surahData?.numberOfAyahs || 0,
    });
  }, [surahs]);

  const handleNavigateTafsir = useCallback((newVerseKey: string) => {
    const [surahNum, ayahNum] = newVerseKey.split(':').map(Number);
    const surahData = surahs?.find(s => s.number === surahNum);
    if (surahData) {
      setTafsirView({
        verseKey: newVerseKey,
        surahName: surahData.englishName,
        ayahNumber: ayahNum,
        surahNumber: surahNum,
        totalAyahs: surahData.numberOfAyahs,
      });
    }
  }, [surahs]);

  const handleSelectSurah = useCallback((number: number) => {
    setSelectedSurah(number);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedSurah(null);
  }, []);

  const handleCloseTafsir = useCallback(() => {
    setTafsirView(null);
  }, []);

  // useMemo pour déterminer si un track est en lecture
  const isCurrentlyPlaying = useCallback((surahNumber: number, ayahNumber?: number) => {
    if (!currentTrack || currentTrack.type !== 'quran') return false;
    if (ayahNumber !== undefined) {
      return currentTrack.surah === surahNumber && currentTrack.ayah === ayahNumber && isPlaying;
    }
    return currentTrack.surah === surahNumber && !currentTrack.ayah && isPlaying;
  }, [currentTrack, isPlaying]);

  if (loadingSurahs) {
    return (
      <div className="min-h-screen bg-background-page dark:bg-background-dark-page pt-24 pb-16">
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 dark:border-primary-dark-700 mx-auto mb-4"></div>
            <p className="text-neutral-700 dark:text-neutral-dark-700">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-page dark:bg-background-dark-page pt-24 pb-32">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-dark-900 mb-8 text-center">
          {t('quran.title')}
        </h1>

        {!selectedSurah ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surahs?.map((surah) => (
              <SurahCard
                key={surah.number}
                surah={surah}
                isPlaying={isCurrentlyPlaying(surah.number)}
                onSelectSurah={handleSelectSurah}
                onPlaySurah={handlePlaySurah}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <Button onClick={handleBackToList}>
              ← {t('common.previous')}
            </Button>

            {loadingAyahs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 dark:border-primary-dark-700 mx-auto mb-4"></div>
                <p className="text-neutral-700 dark:text-neutral-dark-700">{t('common.loading')}</p>
              </div>
            ) : ayahs ? (
              <div className="space-y-6">
                {ayahs.arabic.map((ayah, index) => (
                  <AyahCard
                    key={ayah.number}
                    ayah={ayah}
                    index={index}
                    surahNumber={selectedSurah}
                    surahName={currentSurahData?.englishName || ''}
                    frenchText={ayahs.french[index]?.text || ''}
                    isPlaying={isCurrentlyPlaying(selectedSurah, ayah.numberInSurah)}
                    onPlayAyah={handlePlayAyah}
                    onOpenTafsir={handleOpenTafsir}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Modal Tafsir */}
      {tafsirView && (
        <TafsirViewer
          verseKey={tafsirView.verseKey}
          surahName={tafsirView.surahName}
          ayahNumber={tafsirView.ayahNumber}
          surahNumber={tafsirView.surahNumber}
          totalAyahs={tafsirView.totalAyahs}
          onClose={handleCloseTafsir}
          onNavigate={handleNavigateTafsir}
        />
      )}
    </div>
  );
}
