import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { getCurrentLocation, calculateQiblaDirection, calculateDistanceToKaaba } from '../lib/api';

export default function QiblaPage() {
  const [direction, setDirection] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadQibla();
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setDeviceHeading(360 - event.alpha);
    }
  };

  const loadQibla = async () => {
    try {
      const location = await getCurrentLocation();
      const dir = calculateQiblaDirection(location.latitude, location.longitude);
      const dist = calculateDistanceToKaaba(location.latitude, location.longitude);
      
      setDirection(dir);
      setDistance(dist);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const compassRotation = direction !== null ? direction - deviceHeading : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-page pt-24 pb-16">
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
            <p className="text-neutral-700 dark:text-neutral-dark-700">Détection de votre position...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-page pt-24 pb-16">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-semantic-error">Erreur</h2>
              <p className="text-neutral-700 dark:text-neutral-dark-700">{error}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Direction de la Qibla
          </h1>
          <p className="text-neutral-700 dark:text-neutral-dark-700">
            Pointez votre appareil vers la direction indiquée
          </p>
        </div>

        <Card elevated className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-80 h-80">
              {/* Compass Background */}
              <div className="absolute inset-0 rounded-full border-8 border-primary-700 bg-gradient-to-br from-neutral-50 to-background-card shadow-lg dark:shadow-dark-lg dark:shadow-dark-lg">
                {/* Cardinal Directions */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-primary-900 dark:text-primary-dark-900">N</div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xl font-bold text-primary-900 dark:text-primary-dark-900">S</div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary-900 dark:text-primary-dark-900">O</div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary-900 dark:text-primary-dark-900">E</div>
              </div>
              
              {/* Qibla Arrow */}
              <div
                className="absolute inset-0 transition-transform duration-slow"
                style={{ transform: `rotate(${compassRotation}deg)` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[80px] border-b-gold-500 drop-shadow-lg"></div>
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary-700 rounded-full"></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold text-gold-700 dark:text-gold-dark-700">{direction?.toFixed(1)}°</p>
            <p className="text-neutral-700 dark:text-neutral-dark-700">Direction vers La Mecque</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-neutral-700 mb-2">Distance</p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-dark-900">{distance?.toLocaleString()} km</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-neutral-700 mb-2">Azimut</p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-dark-900">{direction?.toFixed(1)}°</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
