import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { getPrayerTimes, getCurrentLocation } from '../lib/api';
import { PrayerTimes } from '../types';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function PrayerTimesPage() {
  const { t } = useTranslation();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      const pos = await getCurrentLocation();
      const times = await getPrayerTimes(pos.latitude, pos.longitude);
      setPrayerTimes(times);
      setLocation(`${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const prayers = [
    { name: t('prayerTimes.fajr'), nameAr: 'الفجر', key: 'Fajr' },
    { name: t('prayerTimes.dhuhr'), nameAr: 'الظهر', key: 'Dhuhr' },
    { name: t('prayerTimes.asr'), nameAr: 'العصر', key: 'Asr' },
    { name: t('prayerTimes.maghrib'), nameAr: 'المغرب', key: 'Maghrib' },
    { name: t('prayerTimes.isha'), nameAr: 'العشاء', key: 'Isha' }
  ];

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    const now = new Date();
    
    for (let i = 0; i < prayers.length; i++) {
      const prayer = prayers[i];
      const [hours, minutes] = prayerTimes[prayer.key as keyof PrayerTimes].split(':');
      const prayerTime = new Date();
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      if (prayerTime > now) {
        return i === 0 ? null : prayers[i - 1].key;
      }
    }
    return prayers[prayers.length - 1].key;
  };

  const currentPrayer = getCurrentPrayer();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-page pt-24 pb-16">
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
            <p className="text-neutral-700 dark:text-neutral-dark-700">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            {t('prayerTimes.title')}
          </h1>
          <div className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-dark-700">
            <MapPinIcon className="w-5 h-5" />
            <span>{location}</span>
          </div>
        </div>

        <Card elevated>
          <div className="space-y-6">
            {prayers.map((prayer) => {
              const isPast = currentPrayer && prayers.findIndex(p => p.key === prayer.key) < prayers.findIndex(p => p.key === currentPrayer);
              const isCurrent = currentPrayer === prayer.key;
              
              return (
                <div
                  key={prayer.key}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-gold-100 shadow-gold'
                      : isPast
                      ? 'bg-primary-50 opacity-60'
                      : 'bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-3 ${
                      isPast
                        ? 'bg-primary-700 border-primary-700'
                        : isCurrent
                        ? 'bg-gold-500 border-gold-500 shadow-gold animate-pulse'
                        : 'bg-transparent border-neutral-300'
                    }`} />
                    <div>
                      <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-dark-900">
                        {prayer.name}
                      </p>
                      <p className="text-sm text-neutral-700 font-arabic" dir="rtl">
                        {prayer.nameAr}
                      </p>
                    </div>
                  </div>
                  <p className={`text-2xl font-mono font-bold ${
                    isCurrent ? 'text-gold-700' : 'text-neutral-900'
                  }`}>
                    {prayerTimes?.[prayer.key as keyof PrayerTimes]}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="text-center space-y-2">
            <p className="text-sm text-neutral-700 dark:text-neutral-dark-700">
              {t('prayerTimes.method')}: Muslim World League
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-dark-700">
              {t('prayerTimes.juristic')}: Shafi
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
