// Service API pour Al-Quran Cloud et Islamic.Network
// Conforme aux spécifications techniques

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AyahText {
  number: number;
  numberInSurah: number;
  text: string;
  textUthmani?: string;
  page: number;
  manzil: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio?: string;
}

export interface AyahTranslation {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  textUthmani?: string;
  page: number;
}

export interface TafsirData {
  text: string;
  source: string;
  author: string;
  language: string;
}

export interface TafsirSearchResult {
  surah: number;
  ayah: number;
  text: TafsirData;
}

export interface Reciter {
  identifier: string;
  name: string;
  englishName?: string;
  style?: string;
  language?: string;
}

// Al-Quran Cloud API Base URL
const AL_QURAN_CLOUD_BASE = 'https://api.alquran.cloud/v1';

// Islamic.Network API Base URL  
const ISLAMIC_NETWORK_BASE = 'https://api.islamic.network/v1';

class QuranAPIService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCached<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async fetchWithCache<T>(url: string, key: string): Promise<T> {
    const cached = this.getCached<T>(key);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      this.setCached(key, data);
      return data;
    } catch (error) {
      console.error('Erreur API Quran:', error);
      throw error;
    }
  }

  // ============================================================================
  // Al-Quran Cloud API
  // ============================================================================

  /**
   * Obtenir la liste des sourates
   */
  async getSurahList(): Promise<SurahInfo[]> {
    const url = `${AL_QURAN_CLOUD_BASE}/surah`;
    const key = 'surah_list';
    
    const data = await this.fetchWithCache<{ data: SurahInfo[] }>(url, key);
    return data.data;
  }

  /**
   * Obtenir une sourate avec texte et audio
   */
  async getSurahWithAudio(surahNumber: number, edition: string = 'quran-uthmani'): Promise<{
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs: AyahText[];
  }> {
    const url = `${AL_QURAN_CLOUD_BASE}/surah/${surahNumber}/${edition}`;
    const key = `surah_${surahNumber}_${edition}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    return data.data;
  }

  /**
   * Obtenir une sourate avec traduction française
   */
  async getSurahWithTranslation(surahNumber: number, translationEdition: string = 'fr.muhammadhamidul'): Promise<{
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs: AyahTranslation[];
  }> {
    const url = `${AL_QURAN_CLOUD_BASE}/surah/${surahNumber}/${translationEdition}`;
    const key = `surah_${surahNumber}_trans_${translationEdition}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    return data.data;
  }

  /**
   * Obtenir une ayah spécifique avec audio
   */
  async getAyahWithAudio(ayahNumber: number, edition: string = 'quran-uthmani'): Promise<AyahText> {
    const url = `${AL_QURAN_CLOUD_BASE}/ayah/${ayahNumber}/${edition}`;
    const key = `ayah_${ayahNumber}_${edition}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    return data.data;
  }

  /**
   * Rechercher dans le Coran
   */
  async searchQuran(query: string, edition: string = 'quran-uthmani'): Promise<{
    data: {
      number: number;
      text: string;
      textUthmani: string;
      numberInSurah: number;
      surah: {
        number: number;
        name: string;
        englishName: string;
        revelationType: string;
      };
    }[];
  }> {
    const url = `${AL_QURAN_CLOUD_BASE}/search/${encodeURIComponent(query)}/${edition}/all/ar`;
    const key = `search_${query}_${edition}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    return data;
  }

  /**
   * Obtenir la liste des traducteurs disponibles
   */
  async getAvailableTranslations(): Promise<{ identifier: string; name: string; language: string; type: string }[]> {
    const url = `${AL_QURAN_CLOUD_BASE}/edition/language/ara`;
    const key = 'available_translations';
    
    const data = await this.fetchWithCache<any>(url, key);
    return data.data.filter((edition: any) => 
      edition.type === 'quran' && 
      edition.language === 'ara' && 
      edition.name !== 'القرآن الكريم'
    );
  }

  /**
   * Obtenir l'audio d'une ayah avec bitrate spécifié
   */
  getAyahAudioUrl(ayahNumber: number, reciter: string, bitrate: number = 64): string {
    return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter}/${ayahNumber}.mp3`;
  }

  /**
   * Obtenir l'audio d'une sourate complète avec bitrate spécifié
   */
  getSurahAudioUrl(surahNumber: number, reciter: string, bitrate: number = 64): string {
    return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${reciter}/${surahNumber}.mp3`;
  }

  // ============================================================================
  // Islamic.Network API pour Tafsir
  // ============================================================================

  /**
   * Obtenir le Tafsir d'une ayah
   */
  async getTafsir(surah: number, ayah: number, language: string = 'fr'): Promise<TafsirData> {
    const url = `${ISLAMIC_NETWORK_BASE}/tafsir/${surah}/${ayah}?language=${language}`;
    const key = `tafsir_${surah}_${ayah}_${language}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    
    return {
      text: data.data?.text || 'Tafsir non disponible',
      source: data.data?.source || 'Tafsir Ibn Kathir',
      author: data.data?.author || 'Ibn Kathir',
      language: language
    };
  }

  /**
   * Rechercher dans le Tafsir
   */
  async searchTafsir(query: string, language: string = 'fr'): Promise<TafsirSearchResult[]> {
    const url = `${ISLAMIC_NETWORK_BASE}/tafsir/search?query=${encodeURIComponent(query)}&language=${language}`;
    const key = `tafsir_search_${query}_${language}`;
    
    const data = await this.fetchWithCache<any>(url, key);
    
    return data.results || [];
  }

  // ============================================================================
  // Récitateurs disponibles
  // ============================================================================

  /**
   * Liste des récitatateurs populaires
   */
  getReciters(): Reciter[] {
    return [
      { identifier: 'ar.alafasy', name: 'Mishary Rashid Alafasy', englishName: 'Mishary Rashid Alafasy' },
      { identifier: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', englishName: 'Abdul Basit Murattal' },
      { identifier: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', englishName: 'Mahmoud Khalil Al-Husary' },
      { identifier: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', englishName: 'Mohamed Siddiq El-Minshawi' },
      { identifier: 'ar.shatri', name: 'Abu Bakr Al-Shatri', englishName: 'Abu Bakr Al-Shatri' },
      { identifier: 'ar.ganim', name: 'Nasser Al-Ghamdi', englishName: 'Nasser Al-Ghamdi' },
      { identifier: 'ar.saadi', name: 'Abdurrahmaan As-Sudais', englishName: 'Abdurrahmaan As-Sudais' },
      { identifier: 'ar.ganim02', name: 'Saad Al-Ghamidi', englishName: 'Saad Al-Ghamidi' },
    ];
  }

  /**
   * Obtenir un récitatateur par son identifiant
   */
  getReciterById(identifier: string): Reciter | undefined {
    return this.getReciters().find(r => r.identifier === identifier);
  }

  // ============================================================================
  // Utilitaires
  // ============================================================================

  /**
   * Calculer le numéro absolu d'une ayah
   */
  static calculateAbsoluteAyahNumber(surah: number, ayah: number): number {
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

  /**
   * Formater le temps de lecture
   */
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }
}

// Export singleton instance
export const quranAPI = new QuranAPIService();

// Export utility functions
export const { calculateAbsoluteAyahNumber, formatTime } = QuranAPIService;
