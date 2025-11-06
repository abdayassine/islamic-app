import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { convertToHijri } from '../lib/api';

export default function CalendarPage() {
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHijriDate();
  }, []);

  const loadHijriDate = async () => {
    try {
      const date = await convertToHijri();
      setHijriDate(date);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const islamicEvents = [
    { name: 'Ramadan', date: '1 Ramadan 1446', description: 'Début du mois de jeûne' },
    { name: 'Laylat al-Qadr', date: '27 Ramadan 1446', description: 'Nuit du Destin' },
    { name: 'Eid al-Fitr', date: '1 Shawwal 1446', description: 'Fête de fin du Ramadan' },
    { name: 'Eid al-Adha', date: '10 Dhul Hijjah 1446', description: 'Fête du Sacrifice' },
    { name: 'Muharram', date: '1 Muharram 1447', description: 'Nouvel an islamique' },
    { name: 'Ashura', date: '10 Muharram 1447', description: 'Jour de Ashura' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-page pt-24 pb-16">
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
            <p className="text-neutral-700 dark:text-neutral-dark-700">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const gregorianDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Calendrier Islamique
          </h1>
          <p className="text-neutral-700 dark:text-neutral-dark-700">
            Dates hijri et événements religieux
          </p>
        </div>

        <Card elevated className="text-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-700 mb-2">Date Grégorienne</p>
              <p className="text-xl font-semibold text-neutral-900 capitalize">
                {gregorianDate}
              </p>
            </div>
            
            <div className="border-t border-neutral-300 pt-6">
              <p className="text-sm text-neutral-700 mb-2">Date Hijri</p>
              <p className="text-3xl font-bold text-primary-900 dark:text-primary-dark-900">
                {hijriDate?.date} {hijriDate?.month} {hijriDate?.year}
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            Événements Islamiques Importants
          </h2>
          <div className="space-y-4">
            {islamicEvents.map((event, index) => (
              <Card key={index} hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌙</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gold-700 mb-1">{event.date}</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-dark-700">{event.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
