// Service Radio Qur'an Streaming - 4 stations principales
// Conforme aux spécifications techniques

export interface RadioStation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  description: string;
  streamUrl: string;
  format: 'mp3' | 'hls' | 'aac';
  bitrate?: string;
  website?: string;
  logo?: string;
  isPrimary: boolean; // true pour les 4 stations principales
  language: string[];
}

class RadioStreamingService {
  private readonly STATIONS: RadioStation[] = [
    // 4 stations principales selon spécifications
    {
      id: 'radio-saudi',
      name: 'Radio Saoudienne Holy Quran',
      country: 'Arabie Saoudite',
      countryCode: 'SA',
      description: 'Radio officielle du Royaume d\'Arabie Saoudite. Diffusion sur 100.0 FM Riyadh. Récitations continues du Saint Coran 24h/24.',
      streamUrl: 'https://stream.rcast.net/260397',
      format: 'mp3',
      website: 'https://quran.sr.sa/',
      isPrimary: true,
      language: ['ar']
    },
    {
      id: 'alafasy-live',
      name: 'Al-Afasy Live',
      country: 'Koweït',
      countryCode: 'KW',
      description: 'Diffusion continue des récitations exceptionnelles de Sheikh Mishary Rashid Alafasy. Service de Dawah basé à Koweït City.',
      streamUrl: 'https://stream.rcast.net/270276',
      format: 'mp3',
      website: 'https://liveonlineradio.net/alafasy-radio',
      isPrimary: true,
      language: ['ar', 'en']
    },
    {
      id: 'radio-maroc',
      name: 'Radio Maroc Quran',
      country: 'Maroc',
      countryCode: 'MA',
      description: 'Station marocaine officielle de récitation coranique en direct depuis Rabat. Diffusion 24/7 avec haute qualité audio.',
      streamUrl: 'https://stream.rcast.net/265132',
      format: 'mp3',
      isPrimary: true,
      language: ['ar', 'fr']
    },
    {
      id: 'radio-egypte',
      name: 'Radio Égypte Quran',
      country: 'Égypte',
      countryCode: 'EG',
      description: 'Radio égyptienne officielle Al-Qur\'an Al-Kareem. Diffusion FM 93.1 MHz au Caire. Partie d\'ERTU (Egyptian Radio & TV Union).',
      streamUrl: 'https://stream.rcast.net/267531',
      format: 'mp3',
      website: 'https://www.maspero.eg/',
      isPrimary: true,
      language: ['ar', 'en', 'fr']
    },
    
    // Stations de sauvegarde
    {
      id: 'telewebion-quran',
      name: 'Quran TV - Telewebion',
      country: 'Iran',
      countryCode: 'IR',
      description: 'Chaîne TV Qur\'an en streaming iranienne. Récitations continues 24/7 avec différents Qaris.',
      streamUrl: 'https://ncdn.telewebion.com/quran/live/playlist.m3u8',
      format: 'hls',
      isPrimary: false,
      language: ['fa', 'ar', 'en']
    },
    {
      id: 'alquran-alkareem',
      name: 'AlQuran AlKareem International',
      country: 'International',
      countryCode: 'INT',
      description: 'Chaîne internationale de récitation coranique continue avec radiodiffusion mondiale.',
      streamUrl: 'http://cnlive.org/channel/1e75531f/index.m3u8',
      format: 'hls',
      isPrimary: false,
      language: ['ar', 'en', 'fr', 'id', 'ur']
    },
    {
      id: 'quran-cairo',
      name: 'Holy Quran Radio - Cairo',
      country: 'Égypte',
      countryCode: 'EG',
      description: 'Radio Égyptienne du Caire - FM 93.1 MHz. Diffusion quotidienne 24/7.',
      streamUrl: 'https://surahquran.com/Radio-Quran-Cairo.html',
      format: 'mp3',
      isPrimary: false,
      language: ['ar', 'en']
    },
    {
      id: 'quran-verse24',
      name: 'Verse 24/7 Holy Quran',
      country: 'Arabie Saoudite',
      countryCode: 'SA',
      description: 'Récitations continues du Saint Coran depuis Abha, Arabie Saoudite.',
      streamUrl: 'https://stream.radiojar.com/8s5u5tpdtwzuv',
      format: 'mp3',
      isPrimary: false,
      language: ['ar', 'en']
    }
  ];

  /**
   * Obtenir toutes les stations
   */
  getStations(): RadioStation[] {
    return [...this.STATIONS];
  }

  /**
   * Obtenir uniquement les 4 stations principales
   */
  getPrimaryStations(): RadioStation[] {
    return this.STATIONS.filter(station => station.isPrimary);
  }

  /**
   * Obtenir une station par son ID
   */
  getStationById(id: string): RadioStation | undefined {
    return this.STATIONS.find(station => station.id === id);
  }

  /**
   * Filtrer les stations par pays
   */
  getStationsByCountry(countryCode: string): RadioStation[] {
    return this.STATIONS.filter(station => 
      station.countryCode === countryCode || station.country === countryCode
    );
  }

  /**
   * Filtrer les stations par format
   */
  getStationsByFormat(format: 'mp3' | 'hls' | 'aac'): RadioStation[] {
    return this.STATIONS.filter(station => station.format === format);
  }

  /**
   * Rechercher des stations
   */
  searchStations(query: string): RadioStation[] {
    const lowerQuery = query.toLowerCase();
    return this.STATIONS.filter(station => 
      station.name.toLowerCase().includes(lowerQuery) ||
      station.country.toLowerCase().includes(lowerQuery) ||
      station.description.toLowerCase().includes(lowerQuery) ||
      station.language.some(lang => lang.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Obtenir les pays disponibles
   */
  getAvailableCountries(): string[] {
    const countries = new Set(this.STATIONS.map(station => station.country));
    return Array.from(countries).sort();
  }

  /**
   * Obtenir les drapeaux des pays
   */
  getCountryFlag(countryCode: string): string {
    const flags: { [key: string]: string } = {
      'SA': '🇸🇦', // Arabie Saoudite
      'KW': '🇰🇼', // Koweït
      'MA': '🇲🇦', // Maroc
      'EG': '🇪🇬', // Égypte
      'IR': '🇮🇷', // Iran
      'INT': '🌍'  // International
    };
    return flags[countryCode] || '🌍';
  }

  /**
   * Valider une URL de stream
   */
  async validateStreamUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Éviter CORS pour les streams
      });

      clearTimeout(timeoutId);
      return true; // Si on arrive ici sans erreur, c'est probablement valide
    } catch (error) {
      console.warn('Validation stream URL échouée:', url, error);
      return false;
    }
  }

  /**
   * Tester toutes les stations et marquer les invalides
   */
  async testAllStations(): Promise<{ station: RadioStation; isValid: boolean }[]> {
    const results = await Promise.allSettled(
      this.STATIONS.map(async (station) => ({
        station,
        isValid: await this.validateStreamUrl(station.streamUrl)
      }))
    );

    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // En cas d'erreur, retourner station non validée
        return {
          station: result.reason.station || { id: 'unknown', name: 'Unknown', streamUrl: '', country: '' },
          isValid: false
        };
      }
    });
  }

  /**
   * Obtenir les métadonnées d'une station (enrichissement futur)
   */
  getStationMetadata(station: RadioStation): {
    quality: 'HD' | 'Standard' | 'Low';
    latency: 'Low' | 'Medium' | 'High';
    reliability: number; // 0-100
    popularity: number; // 0-100
  } {
    // Logique pour déterminer la qualité basée sur le format et le pays
    let quality: 'HD' | 'Standard' | 'Low' = 'Standard';
    let latency: 'Low' | 'Medium' | 'High' = 'Medium';
    let reliability = 85; // Valeur par défaut
    let popularity = 70;

    if (station.format === 'hls') {
      quality = 'HD';
      latency = 'Low';
      reliability = 90;
    } else if (station.format === 'mp3') {
      quality = 'Standard';
      latency = 'Low';
      reliability = 85;
    }

    // Ajuster selon le pays
    if (['SA', 'EG'].includes(station.countryCode)) {
      reliability = Math.min(reliability + 10, 100);
      popularity += 15;
    }

    // Stations principales ont plus de popularité
    if (station.isPrimary) {
      popularity += 20;
    }

    return {
      quality,
      latency,
      reliability: Math.min(reliability, 100),
      popularity: Math.min(popularity, 100)
    };
  }

  /**
   * Obtenir les statistiques des stations
   */
  getStationsStats(): {
    total: number;
    primary: number;
    byFormat: { [format: string]: number };
    byCountry: { [country: string]: number };
  } {
    const stats = {
      total: this.STATIONS.length,
      primary: this.STATIONS.filter(s => s.isPrimary).length,
      byFormat: {} as { [format: string]: number },
      byCountry: {} as { [country: string]: number }
    };

    this.STATIONS.forEach(station => {
      stats.byFormat[station.format] = (stats.byFormat[station.format] || 0) + 1;
      stats.byCountry[station.country] = (stats.byCountry[station.country] || 0) + 1;
    });

    return stats;
  }

  /**
   * Sauvegarder les préférences utilisateur
   */
  saveUserPreferences(preferences: {
    favoriteStations: string[];
    lastStation?: string;
    volume: number;
    autoplay: boolean;
  }): void {
    localStorage.setItem('radio_quran_preferences', JSON.stringify(preferences));
  }

  /**
   * Charger les préférences utilisateur
   */
  loadUserPreferences(): {
    favoriteStations: string[];
    lastStation?: string;
    volume: number;
    autoplay: boolean;
  } {
    const saved = localStorage.getItem('radio_quran_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn('Erreur lecture préférences radio:', error);
      }
    }

    return {
      favoriteStations: [],
      volume: 0.7,
      autoplay: false
    };
  }

  /**
   * Ajouter/retirer des stations favorites
   */
  toggleFavoriteStation(stationId: string): string[] {
    const preferences = this.loadUserPreferences();
    const index = preferences.favoriteStations.indexOf(stationId);
    
    if (index > -1) {
      preferences.favoriteStations.splice(index, 1);
    } else {
      preferences.favoriteStations.push(stationId);
    }
    
    this.saveUserPreferences(preferences);
    return preferences.favoriteStations;
  }
}

// Export singleton instance
export const radioService = new RadioStreamingService();
