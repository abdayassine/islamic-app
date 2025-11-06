import { useState } from 'react';
import Card from '../components/Card';
import { duasData } from '../lib/api';

export default function DuasPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [expandedDua, setExpandedDua] = useState<string | null>(null);

  const categories = ['Tous', 'Matin', 'Soir', 'Repas', 'Voyage', 'Épreuves', 'Gratitude'];

  const filteredDuas = selectedCategory === 'Tous'
    ? duasData
    : duasData.filter(dua => dua.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background-page pt-24 pb-16">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Invocations (Duas)
          </h1>
          <p className="text-neutral-700 dark:text-neutral-dark-700">
            Invocations quotidiennes et occasions spéciales
          </p>
        </div>

        <Card>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-700 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-primary-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {filteredDuas.map((dua) => (
            <Card
              key={dua.id}
              hover
              onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                      {dua.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 text-xs rounded-full">
                      {dua.category}
                    </span>
                  </div>
                  <button className="text-primary-700 dark:text-primary-dark-700">
                    {expandedDua === dua.id ? '−' : '+'}
                  </button>
                </div>

                {expandedDua === dua.id && (
                  <div className="space-y-4 pt-4 border-t border-neutral-300 dark:border-neutral-dark-300">
                    <div>
                      <p className="text-sm text-neutral-700 mb-2">Arabe</p>
                      <p className="text-2xl font-arabic leading-loose" dir="rtl">
                        {dua.arabic}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-700 mb-2">Translittération</p>
                      <p className="text-base text-neutral-900 italic">
                        {dua.transliteration}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-700 mb-2">Traduction</p>
                      <p className="text-base text-neutral-900 dark:text-neutral-dark-900">
                        {dua.translation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
