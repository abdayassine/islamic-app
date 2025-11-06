import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, MapPin, RotateCw, AlertCircle } from 'lucide-react';

// Coordonnées de la Kaaba (Mecque)
const MECCA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262
};

interface Location {
  latitude: number;
  longitude: number;
}

interface QiblahData {
  direction: number;
  distance: number;
}

const QiblahPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblahData, setQiblahData] = useState<QiblahData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compassRotation, setCompassRotation] = useState(0);

  // Calculer la direction Qiblah
  const calculateQiblah = (userLocation: Location): QiblahData => {
    const φ1 = (userLocation.latitude * Math.PI) / 180;
    const λ1 = (userLocation.longitude * Math.PI) / 180;
    const φ2 = (MECCA_COORDINATES.latitude * Math.PI) / 180;
    const λ2 = (MECCA_COORDINATES.longitude * Math.PI) / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    const direction = (Math.atan2(y, x) * 180) / Math.PI;
    const normalizedDirection = (direction + 360) % 360;

    // Calculer la distance (formule haversine)
    const R = 6371; // Rayon de la Terre en km
    const dφ = ((MECCA_COORDINATES.latitude - userLocation.latitude) * Math.PI) / 180;
    const dλ = ((MECCA_COORDINATES.longitude - userLocation.longitude) * Math.PI) / 180;
    
    const a = Math.sin(dφ/2) * Math.sin(dφ/2) +
              Math.cos(φ1) * Math.cos(φ2) * 
              Math.sin(dλ/2) * Math.sin(dλ/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return {
      direction: normalizedDirection,
      distance: Math.round(distance)
    };
  };

  // Obtenir la géolocalisation
  const getLocation = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError(t('qiblah.geolocation_not_supported'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(userLocation);
        const data = calculateQiblah(userLocation);
        setQiblahData(data);
        setCompassRotation(data.direction);
        setLoading(false);
      },
      (error) => {
        let errorMessage = t('qiblah.location_error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('qiblah.permission_denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('qiblah.position_unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('qiblah.location_timeout');
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Direction de la boussole en degrés
  const getCompassDirection = (degrees: number): string => {
    const directions = [
      { value: 0, label: t('qiblah.north') },
      { value: 45, label: t('qiblah.northeast') },
      { value: 90, label: t('qiblah.east') },
      { value: 135, label: t('qiblah.southeast') },
      { value: 180, label: t('qiblah.south') },
      { value: 225, label: t('qiblah.southwest') },
      { value: 270, label: t('qiblah.west') },
      { value: 315, label: t('qiblah.northwest') }
    ];

    let closest = directions[0];
    let minDiff = Math.abs(degrees - directions[0].value);

    for (const dir of directions) {
      const diff = Math.abs(degrees - dir.value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = dir;
      }
    }

    return closest.label;
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Compass className="text-blue-600" size={32} />
            {t('qiblah.title')}
          </h1>
          <p className="text-gray-600">{t('qiblah.subtitle')}</p>
        </div>

        {/* Géolocalisation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="text-blue-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">{t('qiblah.your_location')}</h2>
          </div>

          {location ? (
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>{t('qiblah.latitude')}:</strong> {location.latitude.toFixed(4)}°
              </p>
              <p className="text-gray-600 mb-4">
                <strong>{t('qiblah.longitude')}:</strong> {location.longitude.toFixed(4)}°
              </p>
              <button
                onClick={getLocation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCw size={16} />
                {t('qiblah.refresh_location')}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">{t('qiblah.location_not_found')}</p>
              <button
                onClick={getLocation}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {t('qiblah.getting_location')}
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    {t('qiblah.get_location')}
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Boussole Qiblah */}
        {qiblahData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('qiblah.compass')}</h2>
              <p className="text-gray-600">{t('qiblah.direction_to_mecca')}</p>
            </div>

            {/* Boussole */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div 
                className="absolute inset-0 rounded-full border-4 border-gray-300 bg-gradient-to-br from-blue-100 to-indigo-200"
                style={{
                  transform: `rotate(${360 - qiblahData.direction}deg)`,
                  transition: 'transform 1s ease-in-out'
                }}
              >
                {/* Marqueurs de directions */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-bold text-gray-600">N</div>
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="text-xs font-bold text-gray-600">E</div>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-bold text-gray-600">S</div>
                </div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <div className="text-xs font-bold text-gray-600">O</div>
                </div>

                {/* Flèche Qiblah */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${qiblahData.direction}deg) translate(-50%, -50%)`
                  }}
                >
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-12 border-l-transparent border-r-transparent border-b-red-500"></div>
                </div>

                {/* Point central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Informations Qiblah */}
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-1">{t('qiblah.direction')}</h3>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(qiblahData.direction)}°</p>
                  <p className="text-sm text-gray-600">{getCompassDirection(qiblahData.direction)}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-1">{t('qiblah.distance')}</h3>
                  <p className="text-2xl font-bold text-green-600">{qiblahData.distance} km</p>
                  <p className="text-sm text-gray-600">{t('qiblah.to_mecca')}</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>{t('qiblah.instruction')}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('qibla.instruction_text')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QiblahPage;