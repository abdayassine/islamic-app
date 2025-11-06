import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../contexts/AudioContext';
import { radioService, RadioStation } from '../services/radioStreaming';
import { Radio, Play, Pause, Globe, MapPin, Search, Filter, Star, Clock } from 'lucide-react';
import Card from '../components/Card';



export default function RadioQuranPage() {
  const { t } = useTranslation();
  const { currentTrack, isPlaying, playRadio, stop } = useAudio();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showPrimaryOnly, setShowPrimaryOnly] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  // Charger les stations via le service
  const stations = radioService.getStations();
  const primaryStations = radioService.getPrimaryStations();
  const availableCountries = radioService.getAvailableCountries();

  // Charger les préférences utilisateur
  useEffect(() => {
    const preferences = radioService.loadUserPreferences();
    setUserFavorites(preferences.favoriteStations);
  }, []);

  // Filtrage des stations
  const filteredStations = useMemo(() => {
    let filtered = showPrimaryOnly ? primaryStations : stations;
    
    return filtered.filter(station => {
      const matchesSearch = 
        searchQuery === '' ||
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.language.some(lang => lang.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCountry = 
        selectedCountry === 'all' || 
        station.country === selectedCountry;
      
      return matchesSearch && matchesCountry;
    });
  }, [stations, primaryStations, showPrimaryOnly, searchQuery, selectedCountry]);

  const handlePlayStation = (station: RadioStation) => {
    if (currentTrack?.type === 'radio' && currentTrack.station?.id === station.id) {
      stop();
      setSelectedStation(null);
    } else {
      playRadio(station);
      setSelectedStation(station.id);
    }
  };

  const handleToggleFavorite = (stationId: string) => {
    const newFavorites = radioService.toggleFavoriteStation(stationId);
    setUserFavorites(newFavorites);
  };

  const isStationPlaying = (stationId: string) => {
    return currentTrack?.type === 'radio' && 
           currentTrack.station?.id === stationId && 
           isPlaying;
  };

  const isStationFavorite = (stationId: string) => {
    return userFavorites.includes(stationId);
  };

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-32">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-800 rounded-2xl mb-4 animate-fadeIn">
            <Radio className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-3 animate-fadeIn">
            {t('radio.title', 'Radio Qur\'an')}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto animate-fadeIn">
            {t('radio.description', 'Écoutez les récitations du Saint Qur\'an en direct depuis les meilleures stations radio du monde musulman')}
          </p>
          
          {/* Badge des 4 stations principales */}
          <div className="mt-4 inline-flex items-center gap-2 bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4" />
            <span>4 Stations Principales • Qualité Premium</span>
          </div>
        </header>

        {/* Filtres et recherche */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4 animate-fadeInUp">
          {/* Toggle stations principales */}
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => setShowPrimaryOnly(!showPrimaryOnly)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all focus-visible-ring ${
                showPrimaryOnly
                  ? 'bg-gold-500 text-white shadow-lg'
                  : 'bg-white text-primary-700 border border-primary-300 hover:bg-primary-50'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              {showPrimaryOnly ? '4 Stations Principales' : 'Toutes les Stations'}
            </button>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <label htmlFor="search-stations" className="sr-only">
              Rechercher une station
            </label>
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" 
              aria-hidden="true"
            />
            <input
              id="search-stations"
              type="text"
              placeholder="Rechercher une station, pays ou langue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible-ring"
              aria-label="Rechercher une station radio"
            />
          </div>

          {/* Filtre par pays */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filtrer par pays:</span>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par pays">
              <button
                onClick={() => setSelectedCountry('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible-ring ${
                  selectedCountry === 'all'
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
                aria-pressed={selectedCountry === 'all'}
              >
                Tous
              </button>
              {availableCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible-ring ${
                    selectedCountry === country
                      ? 'bg-primary-700 text-white shadow-md'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                  aria-pressed={selectedCountry === country}
                >
                  {radioService.getCountryFlag(country)} {country}
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu des 4 stations principales */}
          {showPrimaryOnly && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {primaryStations.map((station) => {
                const playing = isStationPlaying(station.id);
                const metadata = radioService.getStationMetadata(station);
                
                return (
                  <div 
                    key={station.id}
                    className={`bg-gradient-to-br ${
                      playing ? 'from-primary-600 to-primary-700' : 'from-gold-100 to-gold-50'
                    } rounded-xl p-4 border-2 transition-all hover:scale-105 cursor-pointer`}
                    onClick={() => handlePlayStation(station)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {radioService.getCountryFlag(station.countryCode)}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{station.name}</h3>
                      <p className="text-xs opacity-75 mb-3">{station.country}</p>
                      <div className="flex items-center justify-center gap-2">
                        {playing ? (
                          <div className="flex items-center gap-1 text-white text-xs">
                            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                            <span>EN DIRECT</span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-gold-600">
                            {metadata.quality} • {metadata.reliability}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nombre de résultats */}
          <div className="text-sm text-neutral-600 text-center">
            <span aria-live="polite" aria-atomic="true">
              {filteredStations.length} station{filteredStations.length > 1 ? 's' : ''} 
              {showPrimaryOnly ? 'principale' : 'disponible'}{filteredStations.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Avertissement technique */}
        <div className="max-w-4xl mx-auto mb-8 animate-fadeInUp">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4" role="alert">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Note technique
                </h3>
                <p className="text-sm text-amber-800">
                  Certaines stations peuvent ne pas fonctionner en raison de restrictions CORS ou de changements d'URLs de streaming. 
                  Nous travaillons continuellement à maintenir les liens à jour.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des stations */}
        {filteredStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredStations.map((station) => {
              const playing = isStationPlaying(station.id);
              
              return (
                <Card
                  key={station.id}
                  hover
                  className={`relative overflow-hidden transition-all animate-fadeInUp ${
                    playing ? 'ring-2 ring-primary-500 shadow-xl audio-player-pulse' : ''
                  }`}
                >
                  {/* Indicateur de lecture */}
                  {playing && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-gold-500" aria-hidden="true">
                      <div className="h-full bg-white/30 animate-pulse" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Icône et informations */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            station.isPrimary 
                              ? 'bg-gradient-to-br from-gold-500 to-gold-600'
                              : 'bg-gradient-to-br from-primary-700 to-primary-800'
                          }`}
                          aria-hidden="true"
                        >
                          <Radio className={`w-7 h-7 text-white ${playing ? 'animate-pulse' : ''}`} />
                        </div>
                        {station.isPrimary && (
                          <div className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs font-semibold">
                            PRINCIPALE
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(station.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            isStationFavorite(station.id)
                              ? 'text-gold-600 hover:text-gold-700'
                              : 'text-neutral-400 hover:text-gold-600'
                          }`}
                          aria-label={isStationFavorite(station.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Star className={`w-4 h-4 ${isStationFavorite(station.id) ? 'fill-current' : ''}`} />
                        </button>
                        <div className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{station.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Nom de la station */}
                    <h2 className="text-lg font-bold text-neutral-900 mb-2">
                      {station.name}
                    </h2>

                    {/* Description et métadonnées */}
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {station.description}
                    </p>
                    
                    {/* Métadonnées techniques */}
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="uppercase font-mono">{station.format}</span>
                      </div>
                      {station.bitrate && (
                        <div>{station.bitrate}</div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>24/7</span>
                      </div>
                    </div>

                    {/* Bouton de lecture */}
                    <button
                      onClick={() => handlePlayStation(station)}
                      className={`touch-target w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all button-interactive focus-visible-ring ${
                        playing
                          ? 'bg-primary-700 text-white hover:bg-primary-800'
                          : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                      }`}
                      aria-label={playing ? `Arrêter ${station.name}` : `Écouter ${station.name}`}
                      aria-pressed={playing}
                    >
                      {playing ? (
                        <>
                          <Pause className="w-4 h-4" aria-hidden="true" />
                          <span>En lecture...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                          <span>Écouter</span>
                        </>
                      )}
                    </button>

                    {/* Indicateur en direct */}
                    {playing && (
                      <div className="flex items-center justify-center gap-2 mt-3" role="status" aria-live="polite">
                        <div className="flex gap-1" aria-hidden="true">
                          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-white font-semibold">EN DIRECT</span>
                        {station.isPrimary && (
                          <div className="bg-gold-300 text-gold-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                            STATION PRINCIPALE
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg" role="status">
              Aucune station trouvée pour votre recherche
            </p>
          </div>
        )}

        {/* Section informative */}
        <div className="max-w-4xl mx-auto mt-12 space-y-6 animate-fadeInUp">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-700 dark:text-primary-dark-700" aria-hidden="true" />
                À propos des stations Radio Qur'an
              </h2>
              <div className="prose max-w-none text-neutral-700 space-y-3">
                <p>
                  Les stations Radio Qur'an diffusent des récitations du Saint Coran 24 heures sur 24, 7 jours sur 7. 
                  Elles proviennent de différents pays du monde musulman et proposent diverses récitations par des Qaris renommés.
                </p>
                <p>
                  Ces radios sont parfaites pour l'écoute en arrière-plan pendant le travail, l'étude ou les moments de détente spirituelle.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
