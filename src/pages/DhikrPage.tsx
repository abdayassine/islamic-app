import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

export default function DhikrPage() {
  const { t } = useTranslation();
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  const dhikrTypes = [
    { id: 'tasbih', name: t('dhikr.dhikrTypes.tasbih'), arabic: 'سُبْحَانَ ٱللَّٰهِ', goal: 33 },
    { id: 'tahmid', name: t('dhikr.dhikrTypes.tahmid'), arabic: 'ٱلْحَمْدُ لِلَّٰهِ', goal: 33 },
    { id: 'takbir', name: t('dhikr.dhikrTypes.takbir'), arabic: 'ٱللَّٰهُ أَكْبَرُ', goal: 33 },
    { id: 'istighfar', name: t('dhikr.dhikrTypes.istighfar'), arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', goal: 100 }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (user && newCount % 10 === 0) {
      await supabase.from('dhikr_history').insert({
        user_id: user.id,
        dhikr_type: dhikrTypes[selectedDhikr].id,
        count: newCount,
        goal: dhikrTypes[selectedDhikr].goal
      });
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const progress = (count / dhikrTypes[selectedDhikr].goal) * 100;

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            {t('dhikr.title')}
          </h1>
          <p className="text-neutral-700 dark:text-neutral-dark-700">
            {t('dhikr.count')}
          </p>
        </div>

        <Card>
          <div className="flex gap-2 flex-wrap justify-center">
            {dhikrTypes.map((dhikr, index) => (
              <button
                key={dhikr.id}
                onClick={() => {
                  setSelectedDhikr(index);
                  setCount(0);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDhikr === index
                    ? 'bg-primary-700 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-primary-50'
                }`}
              >
                {dhikr.name}
              </button>
            ))}
          </div>
        </Card>

        <Card elevated className="text-center">
          <p className="text-3xl font-arabic mb-4" dir="rtl">
            {dhikrTypes[selectedDhikr].arabic}
          </p>
          <p className="text-lg text-neutral-700 mb-8">{dhikrTypes[selectedDhikr].name}</p>

          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="112"
                stroke="#E8F3ED"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="112"
                stroke="#D4AF37"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 112}`}
                strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-slow"
              />
            </svg>
            
            <button
              onClick={handleIncrement}
              className="absolute inset-0 m-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-white shadow-lg dark:shadow-dark-lg dark:shadow-dark-lg hover:shadow-gold active:scale-95 transition-all duration-fast"
            >
              <div className="text-6xl font-bold">{count}</div>
              <div className="text-sm">/ {dhikrTypes[selectedDhikr].goal}</div>
            </button>
          </div>

          <Button onClick={handleReset} variant="secondary" fullWidth>
            {t('dhikr.reset')}
          </Button>
        </Card>

        {!user && (
          <Card>
            <div className="text-center text-sm text-neutral-700 dark:text-neutral-dark-700">
              <p>{t('auth.title')}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
