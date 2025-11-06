import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { getPrayerTimes, getRandomAyah, convertToHijri, getCurrentLocation } from '../lib/api';
import { PrayerTimes } from '../types';
import { useRTL, useRTLClasses, ArabicText } from '../hooks/useRTL';
import {
  ClockIcon,
  BookOpenIcon,
  MapIcon,
  CalculatorIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { t } = useTranslation();
  const { isRTL, getTextAlign } = useRTL();
  const rtl = useRTLClasses();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [ayahOfDay, setAyahOfDay] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtenir la position
      const location = await getCurrentLocation();
      
      // Charger les horaires de prière
      const times = await getPrayerTimes(location.latitude, location.longitude);
      setPrayerTimes(times);
      
      // Déterminer la prochaine prière
      const now = new Date();
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      
      for (const prayer of prayers) {
        const prayerTime = new Date();
        const [hours, minutes] = times[prayer as keyof PrayerTimes].split(':');
        prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);
        
        if (prayerTime > now) {
          setNextPrayer(prayer);
          break;
        }
      }
      
      // Charger le verset du jour
      const ayah = await getRandomAyah();
      setAyahOfDay(ayah);
      
      // Charger la date hijri
      const hijri = await convertToHijri();
      setHijriDate(`${hijri.date} ${hijri.month} ${hijri.year}`);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickAccessItems = [
    {
      title: t('prayerTimes.title'),
      description: t('home.prayerTimesToday'),
      icon: ClockIcon,
      path: '/prayer-times',
      color: 'primary'
    },
    {
      title: t('navigation.quran'),
      description: t('quran.title'),
      icon: BookOpenIcon,
      path: '/quran',
      color: 'gold'
    },
    {
      title: t('navigation.qibla'),
      description: t('qibla.title'),
      icon: MapIcon,
      path: '/qibla',
      color: 'primary'
    },
    {
      title: t('navigation.dhikr'),
      description: t('dhikr.title'),
      icon: CalculatorIcon,
      path: '/dhikr',
      color: 'gold'
    },
    {
      title: t('navigation.calendar'),
      description: t('calendar.title'),
      icon: CalendarIcon,
      path: '/calendar',
      color: 'primary'
    },
    {
      title: t('navigation.duas'),
      description: t('duas.title'),
      icon: SparklesIcon,
      path: '/duas',
      color: 'gold'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-page dark:bg-background-dark-page pt-24 pb-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 dark:border-primary-dark-700 mx-auto mb-4"></div>
              <p className="text-neutral-700 dark:text-neutral-dark-700">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-page dark:bg-background-dark-page pt-24 pb-16">
      <div className="container mx-auto space-y-16">
        {/* Hero Section */}
        <Card elevated className="text-center py-12 bg-gradient-to-br from-primary-50 dark:from-neutral-dark-200 to-background-card dark:to-background-dark-card">
          <div className="space-y-4">
            <h1 className={`text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
              {t('home.title')}
            </h1>
            <p className={`text-neutral-700 dark:text-neutral-dark-700 text-lg ${getTextAlign()}`}>
              {t('home.subtitle')}
            </p>
            <p className={`text-neutral-700 dark:text-neutral-dark-700 text-lg ${getTextAlign()}`}>
              {t('calendar.today')}: {hijriDate}
            </p>
            {nextPrayer && prayerTimes && (
              <div className="mt-6">
                <p className={`text-sm text-neutral-700 dark:text-neutral-dark-700 mb-2 ${getTextAlign()}`}>{t('home.nextPrayer')}</p>
                <div className={`inline-flex items-center ${rtl.flex} gap-3 bg-white dark:bg-neutral-dark-100 px-6 py-3 rounded-lg shadow-sm dark:shadow-dark-sm`}>
                  <ClockIcon className="w-6 h-6 text-gold-500 dark:text-gold-dark-500" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="font-semibold text-primary-900 dark:text-primary-dark-900">{nextPrayer}</p>
                    <p className="text-2xl font-bold text-gold-700 dark:text-gold-dark-700">
                      {prayerTimes[nextPrayer as keyof PrayerTimes]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Ayah of the Day */}
        {ayahOfDay && (
          <Card className="text-center">
            <div className="space-y-6">
              <h2 className={`text-2xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>{t('home.verseOfDay')}</h2>
              <div className="space-y-4">
                <ArabicText variant="quran" className="block">
                  {ayahOfDay.arabic}
                </ArabicText>
                <p className={`text-lg text-neutral-700 dark:text-neutral-dark-700 italic ${getTextAlign()}`}>
                  {ayahOfDay.french}
                </p>
                <p className={`text-sm text-neutral-500 dark:text-neutral-dark-500 ${getTextAlign()}`}>{ayahOfDay.reference}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Access Grid */}
        <div>
          <h2 className={`text-3xl font-bold text-primary-900 dark:text-primary-dark-900 mb-8 text-center ${getTextAlign()}`}>
            {t('home.quickAccess')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Card hover className="h-full">
                  <div className={`flex items-start ${rtl.flex} gap-4`}>
                    <div className={`p-3 rounded-lg ${
                      item.color === 'gold' ? 'bg-gold-100 dark:bg-gold-dark-100' : 'bg-primary-100 dark:bg-primary-dark-100'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'gold' ? 'text-gold-700 dark:text-gold-dark-700' : 'text-primary-700 dark:text-primary-dark-700'
                      }`} />
                    </div>
                    <div className={`flex-1 ${getTextAlign()}`}>
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-dark-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-700 dark:text-neutral-dark-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
