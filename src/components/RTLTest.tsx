import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL, useRTLClasses, ArabicText } from '../hooks/useRTL';
import Card from './Card';

/**
 * Composant de test pour valider le support RTL
 * Teste les polices, alignements, flexbox, marges et paddings
 */
export default function RTLTest() {
  const { t } = useTranslation();
  const { isRTL, currentLang, getTextAlign } = useRTL();
  const rtl = useRTLClasses();
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    pass: boolean;
    message: string;
  }>>([]);

  useEffect(() => {
    runTests();
  }, [isRTL]);

  const runTests = () => {
    const results = [
      {
        name: 'Détection RTL',
        pass: isRTL === (currentLang === 'ar'),
        message: `isRTL: ${isRTL}, Langue: ${currentLang}`
      },
      {
        name: 'Polices arabes',
        pass: document.fonts.check('16px Cairo') && document.fonts.check('16px Amiri'),
        message: 'Cairo et Amiri chargées'
      },
      {
        name: 'Direction document',
        pass: document.documentElement.dir === (currentLang === 'ar' ? 'rtl' : 'ltr'),
        message: `dir="${document.documentElement.dir}"`
      },
      {
        name: 'Classe CSS RTL',
        pass: document.body.classList.contains('rtl') === isRTL,
        message: `Body a classe 'rtl': ${document.body.classList.contains('rtl')}`
      }
    ];

    setTestResults(results);
  };

  const arabicTexts = [
    {
      title: 'Basmala',
      text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      variant: 'quran' as const
    },
    {
      title: 'Texte normal',
      text: 'السلام عليكم ورحمة الله وبركاته',
      variant: 'normal' as const
    },
    {
      title: 'Titre arabe',
      text: 'المصحف الشريف',
      variant: 'title' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête des tests */}
      <Card>
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test Support RTL - Application Islamique
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded">
              <div className="text-sm text-gray-600 dark:text-neutral-dark-500">Langue actuelle</div>
              <div className="font-mono text-lg font-semibold">
                {currentLang.toUpperCase()}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded">
              <div className="text-sm text-gray-600 dark:text-neutral-dark-500">Direction</div>
              <div className="font-mono text-lg font-semibold">
                {isRTL ? 'RTL' : 'LTR'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded">
              <div className="text-sm text-gray-600 dark:text-neutral-dark-500">Statut</div>
              <div className={`font-mono text-lg font-semibold ${isRTL ? 'text-green-600' : 'text-blue-600'}`}>
                {isRTL ? 'Support RTL' : 'Support LTR'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Test des polices arabes */}
      <Card>
        <div className="space-y-6">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test des polices arabes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {arabicTexts.map((item, index) => (
              <div key={index} className="text-center space-y-2">
                <h4 className="font-medium text-gray-700 dark:text-neutral-dark-700">
                  {item.title}
                </h4>
                <ArabicText variant={item.variant} className="block">
                  {item.text}
                </ArabicText>
                <p className="text-xs text-gray-500 dark:text-neutral-dark-500">
                  Variante: {item.variant}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Test des alignements */}
      <Card>
        <div className="space-y-6">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test des alignements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-neutral-dark-200 p-4 rounded">
              <p className={`text-left ${getTextAlign()}`}>
                Aligné à gauche (devrait être à droite en RTL)
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-dark-200 p-4 rounded">
              <p className="text-center">
                Centré (reste centré)
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-dark-200 p-4 rounded">
              <p className={`text-right ${getTextAlign()}`}>
                Aligné à droite (devrait être à gauche en RTL)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Flexbox */}
      <Card>
        <div className="space-y-6">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test Flexbox RTL
          </h3>
          
          <div className={`flex ${rtl.flex} items-center gap-4 p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded`}>
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm text-gray-600 dark:text-neutral-dark-500">
              Les numéros devraient être inversés en RTL
            </span>
          </div>
        </div>
      </Card>

      {/* Test des marges et paddings */}
      <Card>
        <div className="space-y-6">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test des marges et paddings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-neutral-dark-200 p-4 rounded">
              <div className={`inline-block bg-blue-200 p-2 rounded ${rtl.ml4}`}>
                Marge gauche (ml-4)
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-dark-500 mt-2">
                Devrait être à droite en RTL
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-dark-200 p-4 rounded">
              <div className={`inline-block bg-green-200 p-2 rounded ${rtl.mr4}`}>
                Marge droite (mr-4)
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-dark-500 mt-2">
                Devrait être à gauche en RTL
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Test des composants UI */}
      <Card>
        <div className="space-y-6">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Test des composants UI
          </h3>
          
          {/* Test navigation */}
          <div className={`p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded`}>
            <div className={`flex ${rtl.flex} items-center justify-between`}>
              <div className={`flex ${rtl.flex} items-center gap-3`}>
                <div className="w-8 h-8 bg-primary-700 rounded flex items-center justify-center">
                  <span className="text-white text-sm">🇸🇦</span>
                </div>
                <span className="font-semibold">IslamApp</span>
              </div>
              <div className={`flex ${rtl.flex} items-center gap-4`}>
                <span className="text-sm text-gray-600 dark:text-neutral-dark-500">Menu</span>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  Action
                </button>
              </div>
            </div>
          </div>
          
          {/* Test carte */}
          <div className={`p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded`}>
            <div className={`flex ${rtl.flex} items-start gap-3`}>
              <div className="w-10 h-10 bg-gold-500 rounded flex items-center justify-center">
                <span className="text-white">📖</span>
              </div>
              <div className={`flex-1 ${getTextAlign()}`}>
                <h4 className="font-semibold">Titre de la carte</h4>
                <p className="text-sm text-gray-600 dark:text-neutral-dark-500">
                  Description avec support RTL
                </p>
              </div>
            </div>
          </div>
          
          {/* Test boutons */}
          <div className={`p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded`}>
            <div className={`flex ${rtl.flex} items-center gap-3`}>
              <button className={`flex ${rtl.flex} items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded`}>
                <span>🔊</span>
                <span>Écouter</span>
              </button>
              <button className={`flex ${rtl.flex} items-center gap-2 px-4 py-2 bg-green-500 text-white rounded`}>
                <span>📖</span>
                <span>Tafsir</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Résultats des tests */}
      <Card>
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Résultats des tests
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded border-l-4 ${
                  result.pass 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {result.pass ? '✅' : '❌'}
                  </span>
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm opacity-90">{result.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 dark:bg-neutral-dark-200 rounded">
            <div className="text-sm text-gray-600 dark:text-neutral-dark-500">
              <strong>Tests automatiques:</strong> {testResults.filter(r => r.pass).length}/{testResults.length} réussis
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-primary-900 dark:text-primary-dark-900 ${getTextAlign()}`}>
            Instructions de test
          </h3>
          
          <div className={`space-y-2 ${getTextAlign()}`}>
            <p className="text-sm text-gray-700 dark:text-neutral-dark-700">
              <strong>1. Test manuel:</strong> Utilisez le sélecteur de langue pour passer à l'arabe (العربية) et vérifier l'affichage RTL.
            </p>
            <p className="text-sm text-gray-700 dark:text-neutral-dark-700">
              <strong>2. Vérification visuelle:</strong> En mode RTL, les éléments doivent être inversés (navigation, boutons, texte).
            </p>
            <p className="text-sm text-gray-700 dark:text-neutral-dark-700">
              <strong>3. Polices:</strong> Le texte arabe doit utiliser les polices Cairo (interface) et Amiri (Coran).
            </p>
            <p className="text-sm text-gray-700 dark:text-neutral-dark-700">
              <strong>4. Tests automatiques:</strong> Les résultats ci-dessus doivent tous afficher ✅ en mode RTL.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}