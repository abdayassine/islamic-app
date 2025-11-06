import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';
import { Howl } from 'howler';
import { RadioStation, radioService } from '../services/radioStreaming';

export interface AudioTrack {
  type: 'quran' | 'radio';
  surah?: number;
  ayah?: number;
  surahName?: string;
  reciter?: string;
  reciterName?: string;
  station?: RadioStation;
  isPausedByOther?: boolean; // Pour gérer la pause mutuelle
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playQuranAyah: (surah: number, ayah: number, surahName: string, reciter?: string) => void;
  playQuranSurah: (surah: number, surahName: string, reciter?: string) => void;
  playRadio: (station: RadioStation) => void;
  togglePlay: () => void;
  stop: () => void;
  pauseForOther: (reason: string) => void; // Pause mutuelle
  resumeFromOther: () => void; // Reprise après pause mutuelle
  setVolume: (volume: number) => void;
  seek: (position: number) => void;
  getCurrentTrackType: () => 'quran' | 'radio' | null;
}

const AudioContext = createContext<AudioContextType | null>(null);

const RECITERS = {
  alafasy: { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  abdulbasit: { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  husary: { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  minshawi: { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
};

const DEFAULT_RECITER = RECITERS.alafasy.id;
const DEFAULT_RECITER_NAME = RECITERS.alafasy.name;
const BITRATE = 64; // kbps (32, 40, 48, 64, 128, 192 disponibles)

// ============================================================================
// AUDIO POOL - Réutilisation des instances Howl pour économiser la mémoire
// ============================================================================

interface HowlPoolItem {
  howl: Howl;
  lastUsed: number;
  isActive: boolean;
}

class AudioPool {
  private static instance: AudioPool;
  private pool: Map<string, HowlPoolItem> = new Map();
  private readonly maxPoolSize = 5; // Max 5 instances Howl en mémoire
  private readonly poolCleanupInterval = 5 * 60 * 1000; // Cleanup toutes les 5 min

  private constructor() {
    // Cleanup périodique du pool
    setInterval(() => this.cleanupOldEntries(), this.poolCleanupInterval);
  }

  public static getInstance(): AudioPool {
    if (!AudioPool.instance) {
      AudioPool.instance = new AudioPool();
    }
    return AudioPool.instance;
  }

  /**
   * Obtenir une instance Howl (réutilisation ou création)
   */
  public getOrCreateHowl(
    url: string,
    options: {
      volume: number;
      html5?: boolean;
      format?: string[];
      onload?: () => void;
      onplay?: () => void;
      onpause?: () => void;
      onend?: () => void;
      onloaderror?: (id: number, error: any) => void;
      onplayerror?: (id: number, error: any) => void;
    }
  ): Howl {
    // Chercher une instance inactive existante
    const inactiveEntry = Array.from(this.pool.values()).find(
      item => !item.isActive && item.howl.state() !== 'loading'
    );

    let howl: Howl;

    if (inactiveEntry) {
      // Réutiliser une instance existante
      howl = inactiveEntry.howl;
      
      // Arrêter et décharger l'ancien audio
      howl.stop();
      howl.unload();
      
      // Reconfigurer avec nouvelle source
      howl = new Howl({
        src: [url],
        html5: options.html5 ?? true,
        volume: options.volume,
        format: options.format,
        onload: options.onload,
        onplay: options.onplay,
        onpause: options.onpause,
        onend: options.onend,
        onloaderror: options.onloaderror,
        onplayerror: options.onplayerror,
      });

      // Mettre à jour le pool
      this.pool.set(url, {
        howl,
        lastUsed: Date.now(),
        isActive: true,
      });
    } else {
      // Créer nouvelle instance
      howl = new Howl({
        src: [url],
        html5: options.html5 ?? true,
        volume: options.volume,
        format: options.format,
        onload: options.onload,
        onplay: options.onplay,
        onpause: options.onpause,
        onend: options.onend,
        onloaderror: options.onloaderror,
        onplayerror: options.onplayerror,
      });

      // Ajouter au pool
      this.pool.set(url, {
        howl,
        lastUsed: Date.now(),
        isActive: true,
      });

      // Limiter la taille du pool
      if (this.pool.size > this.maxPoolSize) {
        this.evictOldest();
      }
    }

    return howl;
  }

  /**
   * Marquer une instance comme inactive (disponible pour réutilisation)
   */
  public releaseHowl(url: string): void {
    const entry = this.pool.get(url);
    if (entry) {
      entry.isActive = false;
      entry.lastUsed = Date.now();
    }
  }

  /**
   * Cleanup complet d'une instance spécifique
   */
  public destroyHowl(url: string): void {
    const entry = this.pool.get(url);
    if (entry) {
      entry.howl.unload();
      this.pool.delete(url);
    }
  }

  /**
   * Évincer l'instance la moins récemment utilisée
   */
  private evictOldest(): void {
    const entries = Array.from(this.pool.entries());
    const inactive = entries.filter(([, item]) => !item.isActive);

    if (inactive.length === 0) return;

    // Trier par dernière utilisation (plus ancien en premier)
    inactive.sort((a, b) => a[1].lastUsed - b[1].lastUsed);

    const [oldestUrl, oldestItem] = inactive[0];
    oldestItem.howl.unload();
    this.pool.delete(oldestUrl);

    console.log(`[AudioPool] Éviction de l'instance: ${oldestUrl}`);
  }

  /**
   * Nettoyer les entrées anciennes (> 10 min d'inactivité)
   */
  private cleanupOldEntries(): void {
    const now = Date.now();
    const maxInactiveTime = 10 * 60 * 1000; // 10 minutes

    Array.from(this.pool.entries()).forEach(([url, item]) => {
      if (!item.isActive && now - item.lastUsed > maxInactiveTime) {
        item.howl.unload();
        this.pool.delete(url);
        console.log(`[AudioPool] Cleanup: ${url}`);
      }
    });
  }

  /**
   * Obtenir statistiques du pool (pour monitoring)
   */
  public getStats(): { total: number; active: number; inactive: number } {
    const items = Array.from(this.pool.values());
    return {
      total: items.length,
      active: items.filter(i => i.isActive).length,
      inactive: items.filter(i => !i.isActive).length,
    };
  }

  /**
   * Cleanup complet du pool (utilisé au unmount de l'app)
   */
  public destroy(): void {
    this.pool.forEach(item => item.howl.unload());
    this.pool.clear();
  }
}

// ============================================================================
// AUDIO PROVIDER COMPONENT
// ============================================================================

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('quran_volume');
    return saved ? parseFloat(saved) : 0.7;
  });
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPausedByOther, setIsPausedByOther] = useState(false);
  const [pauseReason, setPauseReason] = useState<string>('');

  // Refs pour éviter re-créations et memory leaks
  const soundRef = useRef<Howl | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPool = useMemo(() => AudioPool.getInstance(), []);

  // ============================================================================
  // CLEANUP FUNCTIONS
  // ============================================================================

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback((sound: Howl) => {
    stopProgressTracking(); // Cleanup ancien interval

    progressIntervalRef.current = setInterval(() => {
      if (sound && sound.playing()) {
        const position = sound.seek() as number;
        setProgress(position);
      }
    }, 100);
  }, [stopProgressTracking]);

  const cleanupCurrentSound = useCallback(() => {
    stopProgressTracking();

    if (soundRef.current) {
      soundRef.current.stop();
      
      // Marquer comme disponible dans le pool
      if (currentUrlRef.current) {
        audioPool.releaseHowl(currentUrlRef.current);
      }
      
      soundRef.current = null;
      currentUrlRef.current = null;
    }

    setIsPlaying(false);
    setProgress(0);
  }, [stopProgressTracking, audioPool]);

  // ============================================================================
  // PLAYBACK FUNCTIONS
  // ============================================================================

  const playQuranAyah = useCallback((
    surah: number,
    ayah: number,
    surahName: string,
    reciter?: string
  ) => {
    // Pause automatique de la radio si elle joue
    if (soundRef.current && currentTrack?.type === 'radio' && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }

    cleanupCurrentSound();

    const reciterId = reciter || DEFAULT_RECITER;
    const reciterName = Object.values(RECITERS).find(r => r.id === reciterId)?.name || DEFAULT_RECITER_NAME;
    
    const ayahNumber = calculateAbsoluteAyahNumber(surah, ayah);
    const url = `https://cdn.islamic.network/quran/audio/${BITRATE}/${reciterId}/${ayahNumber}.mp3`;

    const newSound = audioPool.getOrCreateHowl(url, {
      volume,
      html5: true,
      onload: function() {
        setDuration(this.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        setIsPausedByOther(false);
        setPauseReason('');
        startProgressTracking(newSound);
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressTracking();
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        stopProgressTracking();
      },
      onloaderror: (id, error) => {
        console.error('Erreur chargement audio:', error);
        setIsPlaying(false);
      },
      onplayerror: (id, error) => {
        console.error('Erreur lecture audio:', error);
        setIsPlaying(false);
      },
    });

    newSound.play();
    soundRef.current = newSound;
    currentUrlRef.current = url;

    setCurrentTrack({
      type: 'quran',
      surah,
      ayah,
      surahName,
      reciter: reciterId,
      reciterName,
      isPausedByOther: false
    });
  }, [cleanupCurrentSound, volume, audioPool, startProgressTracking, stopProgressTracking, currentTrack, isPlaying]);

  const playQuranSurah = useCallback((
    surah: number,
    surahName: string,
    reciter?: string
  ) => {
    // Pause automatique de la radio si elle joue
    if (soundRef.current && currentTrack?.type === 'radio' && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }

    cleanupCurrentSound();

    const reciterId = reciter || DEFAULT_RECITER;
    const reciterName = Object.values(RECITERS).find(r => r.id === reciterId)?.name || DEFAULT_RECITER_NAME;
    const url = `https://cdn.islamic.network/quran/audio-surah/${BITRATE}/${reciterId}/${surah}.mp3`;

    const newSound = audioPool.getOrCreateHowl(url, {
      volume,
      html5: true,
      onload: function() {
        setDuration(this.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        setIsPausedByOther(false);
        setPauseReason('');
        startProgressTracking(newSound);
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressTracking();
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        stopProgressTracking();
      },
      onloaderror: (id, error) => {
        console.error('Erreur chargement sourate:', error);
        setIsPlaying(false);
      },
      onplayerror: (id, error) => {
        console.error('Erreur lecture sourate:', error);
        setIsPlaying(false);
      },
    });

    newSound.play();
    soundRef.current = newSound;
    currentUrlRef.current = url;

    setCurrentTrack({
      type: 'quran',
      surah,
      surahName,
      reciter: reciterId,
      reciterName,
      isPausedByOther: false
    });
  }, [cleanupCurrentSound, volume, audioPool, startProgressTracking, stopProgressTracking, currentTrack, isPlaying]);

  const playRadio = useCallback((station: RadioStation) => {
    // Pause automatique du Qur'an si il joue
    if (soundRef.current && currentTrack?.type === 'quran' && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }

    cleanupCurrentSound();

    const url = station.streamUrl;

    const newSound = audioPool.getOrCreateHowl(url, {
      volume,
      html5: true,
      format: ['mp3', 'aac', 'hls'],
      onplay: () => {
        setIsPlaying(true);
        setIsPausedByOther(false);
        setPauseReason('');
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        console.error('Erreur chargement radio:', error);
        setIsPlaying(false);
      },
      onplayerror: (id, error) => {
        console.error('Erreur lecture radio:', error);
        setIsPlaying(false);
      },
    });

    newSound.play();
    soundRef.current = newSound;
    currentUrlRef.current = url;

    setCurrentTrack({
      type: 'radio',
      station,
      isPausedByOther: false
    });
    setDuration(0); // Les streams radio n'ont pas de durée fixe
  }, [cleanupCurrentSound, volume, audioPool, currentTrack, isPlaying]);

  // ============================================================================
  // CONTROL FUNCTIONS
  // ============================================================================

  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
      setIsPausedByOther(false);
      setPauseReason('');
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    cleanupCurrentSound();
    setCurrentTrack(null);
    setIsPausedByOther(false);
    setPauseReason('');
  }, [cleanupCurrentSound]);

  // Gestion pause mutuelle
  const pauseForOther = useCallback((reason: string) => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      setIsPausedByOther(true);
      setPauseReason(reason);
      setCurrentTrack(prev => prev ? { ...prev, isPausedByOther: true } : null);
    }
  }, [isPlaying]);

  const resumeFromOther = useCallback(() => {
    if (soundRef.current && isPausedByOther) {
      soundRef.current.play();
      setIsPausedByOther(false);
      setPauseReason('');
      setCurrentTrack(prev => prev ? { ...prev, isPausedByOther: false } : null);
    }
  }, [isPausedByOther]);

  const getCurrentTrackType = useCallback(() => {
    return currentTrack?.type || null;
  }, [currentTrack]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('quran_volume', newVolume.toString());
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const seek = useCallback((position: number) => {
    if (soundRef.current && currentTrack?.type === 'quran') {
      soundRef.current.seek(position);
      setProgress(position);
    }
  }, [currentTrack]);

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================

  // Cleanup global au unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
      // Note: On ne détruit pas le pool car il est singleton partagé
    };
  }, [stopProgressTracking]);

  // Log des stats du pool en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const logStats = setInterval(() => {
        const stats = audioPool.getStats();
        console.log('[AudioPool Stats]', stats);
      }, 30000); // Log toutes les 30 secondes

      return () => clearInterval(logStats);
    }
  }, [audioPool]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        playQuranAyah,
        playQuranSurah,
        playRadio,
        togglePlay,
        stop,
        pauseForOther,
        resumeFromOther,
        setVolume,
        seek,
        getCurrentTrackType,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio doit être utilisé dans AudioProvider');
  }
  return context;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculer le numéro absolu d'ayah (1-6236)
function calculateAbsoluteAyahNumber(surah: number, ayah: number): number {
  // Tableau des nombres d'ayahs par sourate (114 sourates)
  const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
    89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12,
    12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
    30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
  ];

  let absolute = 0;
  for (let i = 0; i < surah - 1; i++) {
    absolute += ayahCounts[i];
  }
  absolute += ayah;
  
  return absolute;
}

export { RECITERS };
