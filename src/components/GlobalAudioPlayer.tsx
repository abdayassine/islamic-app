import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, Volume2, VolumeX, X, Radio, BookOpen, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { formatTime } from '../lib/utils';
import { RadioStation, radioService } from '../services/radioStreaming';

// Composant Waveform mémoïsé
const Waveform = memo(() => (
  <div className="waveform" role="presentation" aria-hidden="true">
    <div className="waveform-bar"></div>
    <div className="waveform-bar"></div>
    <div className="waveform-bar"></div>
    <div className="waveform-bar"></div>
    <div className="waveform-bar"></div>
  </div>
));

Waveform.displayName = 'Waveform';

// Composant LiveIndicator mémoïsé
const LiveIndicator = memo(() => (
  <div className="flex items-center justify-center gap-2 py-2">
    <div className="flex gap-1" role="status" aria-label="En direct">
      <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} aria-hidden="true" />
      <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} aria-hidden="true" />
      <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} aria-hidden="true" />
    </div>
    <span className="text-xs text-primary-200 font-medium">En direct</span>
  </div>
));

LiveIndicator.displayName = 'LiveIndicator';

// Composant ProgressBar mémoïsé
interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  mobile?: boolean;
}

const ProgressBar = memo(({ progress, duration, onSeek, mobile = false }: ProgressBarProps) => {
  const progressPercent = useMemo(
    () => (duration > 0 ? (progress / duration) * 100 : 0),
    [progress, duration]
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  }, [duration, onSeek]);

  return (
    <div>
      <div 
        className={`w-full bg-primary-700/50 rounded-full cursor-pointer transition-all ${
          mobile ? 'h-2 hover:h-3' : 'h-1 hover:h-1.5'
        }`}
        onClick={handleClick}
        role="slider"
        aria-label="Barre de progression"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={progress}
      >
        <div 
          className="h-full bg-gold-500 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {mobile && (
        <div className="flex items-center justify-between text-xs text-primary-200 mt-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// Composant TrackInfo amélioré avec métadonnées de station
interface TrackInfoProps {
  isRadio: boolean;
  station?: RadioStation;
  surahName?: string;
  ayah?: number;
  reciterName?: string;
  mobile?: boolean;
  isPausedByOther?: boolean;
}

const TrackInfo = memo(({ 
  isRadio, 
  station, 
  surahName, 
  ayah, 
  reciterName,
  mobile = false,
  isPausedByOther = false
}: TrackInfoProps) => {
  const title = useMemo(() => {
    if (isRadio) return station?.name || 'Station Radio';
    if (ayah) return `Sourate ${surahName} - Verset ${ayah}`;
    return `Sourate ${surahName}`;
  }, [isRadio, station, surahName, ayah]);

  const subtitle = useMemo(() => {
    if (isRadio) {
      const countryFlag = station ? radioService.getCountryFlag(station.countryCode) : '🌍';
      const quality = station ? radioService.getStationMetadata(station).quality : 'Standard';
      return `${station?.country} ${countryFlag} • ${quality}`;
    }
    return reciterName || 'Mishary Rashid Alafasy';
  }, [isRadio, station, reciterName]);

  // Affichage en cas de pause mutuelle
  if (isPausedByOther) {
    return (
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate text-amber-100 ${mobile ? 'text-sm' : 'text-sm'}`}>
          {title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-amber-200">
          <AlertCircle className="w-3 h-3" />
          <span>En pause - Audio concurrent détecté</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <h3 className={`font-semibold truncate text-white ${mobile ? 'text-sm' : 'text-sm'}`}>
        {title}
      </h3>
      <p className="text-xs text-primary-200 truncate">
        {subtitle}
      </p>
    </div>
  );
});

TrackInfo.displayName = 'TrackInfo';

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    stop,
    setVolume,
    seek,
    getCurrentTrackType
  } = useAudio();

  const isMobile = useIsMobile();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // useMemo pour les valeurs dérivées
  const isRadio = useMemo(() => currentTrack?.type === 'radio', [currentTrack?.type]);
  const isPausedByOther = useMemo(() => currentTrack?.isPausedByOther || false, [currentTrack?.isPausedByOther]);
  
  // useCallback pour tous les handlers
  const handleTogglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlay();
  }, [togglePlay]);

  const handleStop = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stop();
  }, [stop]);

  const handleToggleExpand = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  const handleVolumeToggle = useCallback(() => {
    setVolume(volume > 0 ? 0 : 0.7);
  }, [volume, setVolume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  const handleMouseEnter = useCallback(() => {
    setShowVolumeSlider(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowVolumeSlider(false);
  }, []);

  // Pas de currentTrack, ne rien afficher
  if (!currentTrack) return null;

  // Version mobile compacte avec expansion
  if (isMobile) {
    return (
      <div 
        className={`
          fixed bottom-16 left-4 right-4 z-40
          bg-gradient-to-r from-primary-800 to-primary-900 
          rounded-2xl shadow-2xl transition-all duration-300
          ${isExpanded ? 'pb-4' : ''}
          ${isPlaying ? 'audio-player-pulse' : ''}
        `}
        role="region"
        aria-label="Lecteur audio global"
      >
        {/* Header du mini-player */}
        <div 
          className="p-4 cursor-pointer"
          onClick={handleToggleExpand}
          role="button"
          aria-expanded={isExpanded}
          aria-label="Développer le lecteur audio"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {isRadio ? (
                <Radio className="w-6 h-6 text-white" aria-hidden="true" />
              ) : (
                <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
              )}
            </div>
            
            <TrackInfo
              isRadio={isRadio}
              station={currentTrack.station}
              surahName={currentTrack.surahName}
              ayah={currentTrack.ayah}
              reciterName={currentTrack.reciterName}
              mobile={true}
              isPausedByOther={isPausedByOther}
            />

            <button
              onClick={handleTogglePlay}
              disabled={isPausedByOther}
              className={`touch-target w-12 h-12 rounded-full flex items-center justify-center transition-colors focus-visible-ring ${
                isPausedByOther
                  ? 'bg-amber-500/20 text-amber-200 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lecture'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" aria-hidden="true" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={handleToggleExpand}
              className="touch-target-small text-white"
              aria-label={isExpanded ? 'Réduire' : 'Développer'}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ChevronUp className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Contenu étendu */}
        {isExpanded && (
          <div className="px-4 space-y-3 animate-fadeIn">
            {/* Barre de progression */}
            {!isRadio && duration > 0 && (
              <ProgressBar
                progress={progress}
                duration={duration}
                onSeek={seek}
                mobile={true}
              />
            )}

            {/* Contrôles supplémentaires */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleVolumeToggle}
                className="touch-target-small text-white"
                aria-label={volume > 0 ? 'Couper le son' : 'Activer le son'}
              >
                {volume > 0 ? (
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              <button
                onClick={handleStop}
                className="touch-target px-6 py-2 bg-white/10 hover:bg-red-500/20 rounded-full flex items-center gap-2 transition-colors focus-visible-ring"
                aria-label="Arrêter la lecture"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Arrêter</span>
              </button>
            </div>

            {/* Indicateur de streaming en direct pour radio */}
            {isRadio && <LiveIndicator />}

            {/* Animation waveform pour lecture active */}
            {isPlaying && !isRadio && (
              <div className="flex justify-center">
                <Waveform />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Version desktop complète
  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 
        bg-gradient-to-r from-primary-800 to-primary-900 
        text-white shadow-2xl z-50 border-t border-primary-700
        ${isPlaying ? 'audio-player-pulse' : ''}
      `}
      role="region"
      aria-label="Lecteur audio global"
    >
      <div className="container mx-auto px-4 py-3">
        {/* Barre de progression (uniquement pour Qur'an, pas pour radio) */}
        {!isRadio && duration > 0 && (
          <div className="mb-3">
            <ProgressBar
              progress={progress}
              duration={duration}
              onSeek={seek}
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* Informations de lecture */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {isRadio ? (
                <Radio className="w-5 h-5 text-white" aria-hidden="true" />
              ) : (
                <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
              )}
            </div>
            
            <TrackInfo
              isRadio={isRadio}
              station={currentTrack.station}
              surahName={currentTrack.surahName}
              ayah={currentTrack.ayah}
              reciterName={currentTrack.reciterName}
              isPausedByOther={isPausedByOther}
            />

            {/* Animation waveform pour lecture active */}
            {isPlaying && !isRadio && (
              <div className="hidden lg:flex">
                <Waveform />
              </div>
            )}
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-4">
            {/* Temps (uniquement pour Qur'an) */}
            {!isRadio && duration > 0 && (
              <div className="text-xs text-primary-200 hidden sm:block">
                {formatTime(progress)} / {formatTime(duration)}
              </div>
            )}

            {/* Play/Pause avec état pause mutuelle */}
            <button
              onClick={togglePlay}
              disabled={isPausedByOther}
              className={`touch-target w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible-ring ${
                isPausedByOther
                  ? 'bg-amber-500/20 text-amber-200 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lecture'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" aria-hidden="true" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" aria-hidden="true" />
              )}
            </button>

            {/* Volume */}
            <div 
              className="relative hidden md:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleVolumeToggle}
                className="touch-target-small w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors focus-visible-ring"
                aria-label={volume > 0 ? 'Couper le son' : 'Activer le son'}
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 text-white" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white" aria-hidden="true" />
                )}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary-900 rounded-lg p-2 shadow-xl animate-scaleIn">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="accent-gold-500 cursor-pointer focus-visible-ring"
                    style={{
                      width: '4px',
                      height: '80px',
                      WebkitAppearance: 'slider-vertical' as any,
                    }}
                    aria-label="Contrôle du volume"
                  />
                </div>
              )}
            </div>

            {/* Stop */}
            <button
              onClick={stop}
              className="touch-target-small w-9 h-9 bg-white/10 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors focus-visible-ring"
              aria-label="Arrêter la lecture"
            >
              <X className="w-4 h-4 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Indicateur de streaming en direct pour radio */}
        {isRadio && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <LiveIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
