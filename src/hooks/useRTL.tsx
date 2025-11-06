import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le support RTL (Right-to-Left)
 * Gère automatiquement la direction du document et les polices arabes
 */
export function useRTL() {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const language = i18n.language || 'fr';
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRTLLang = rtlLanguages.includes(language);
    
    setCurrentLang(language);
    setIsRTL(isRTLLang);

    // Appliquer les attributs RTL au document
    document.documentElement.dir = isRTLLang ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Ajouter ou retirer la classe RTL du body
    if (isRTLLang) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    // Optimiser les polices pour l'arabe
    if (isRTLLang) {
      document.body.style.fontFamily = 'var(--font-arabic-primary), sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }
  }, [i18n.language]);

  return {
    isRTL,
    currentLang,
    isArabic: currentLang === 'ar',
    isRTLLanguage: isRTL,
    // Fonction pour changer la direction si nécessaire
    setDirection: (direction: 'rtl' | 'ltr') => {
      document.documentElement.dir = direction;
    },
    // Fonction pour obtenir les classes CSS adaptées à la direction
    getRTLClasses: (baseClass: string, rtlClass?: string, ltrClass?: string) => {
      if (rtlClass && isRTL) return `${baseClass} ${rtlClass}`;
      if (ltrClass && !isRTL) return `${baseClass} ${ltrClass}`;
      return baseClass;
    },
    // Fonction pour obtenir l'alignement du texte
    getTextAlign: () => isRTL ? 'text-right' : 'text-left',
    // Fonction pour obtenir la marge adaptée
    getMargin: (side: 'left' | 'right', value: string) => {
      const marginProp = isRTL ? (side === 'left' ? 'mr' : 'ml') : (side === 'left' ? 'ml' : 'mr');
      return `${marginProp}-${value}`;
    },
    // Fonction pour obtenir le padding adapté
    getPadding: (side: 'left' | 'right', value: string) => {
      const paddingProp = isRTL ? (side === 'left' ? 'pr' : 'pl') : (side === 'left' ? 'pl' : 'pr');
      return `${paddingProp}-${value}`;
    }
  };
}

/**
 * Hook pour obtenir les classes Tailwind adaptées au RTL
 */
export function useRTLClasses() {
  const { isRTL } = useRTL();

  const rtlClasses = {
    // Flexbox
    flex: isRTL ? 'flex-row-reverse' : 'flex-row',
    justifyStart: isRTL ? 'justify-end' : 'justify-start',
    justifyEnd: isRTL ? 'justify-start' : 'justify-end',
    
    // Text alignment
    textLeft: isRTL ? 'text-right' : 'text-left',
    textRight: isRTL ? 'text-left' : 'text-right',
    
    // Margins
    mlAuto: isRTL ? 'mr-auto' : 'ml-auto',
    mrAuto: isRTL ? 'ml-auto' : 'mr-auto',
    ml1: isRTL ? 'mr-1' : 'ml-1',
    ml2: isRTL ? 'mr-2' : 'ml-2',
    ml3: isRTL ? 'mr-3' : 'ml-3',
    ml4: isRTL ? 'mr-4' : 'ml-4',
    ml5: isRTL ? 'mr-5' : 'ml-5',
    ml6: isRTL ? 'mr-6' : 'ml-6',
    
    mr1: isRTL ? 'ml-1' : 'mr-1',
    mr2: isRTL ? 'ml-2' : 'mr-2',
    mr3: isRTL ? 'ml-3' : 'mr-3',
    mr4: isRTL ? 'ml-4' : 'mr-4',
    mr5: isRTL ? 'ml-5' : 'mr-5',
    mr6: isRTL ? 'ml-6' : 'mr-6',
    
    // Padding
    pl1: isRTL ? 'pr-1' : 'pl-1',
    pl2: isRTL ? 'pr-2' : 'pl-2',
    pl3: isRTL ? 'pr-3' : 'pl-3',
    pl4: isRTL ? 'pr-4' : 'pl-4',
    pl5: isRTL ? 'pr-5' : 'pl-5',
    pl6: isRTL ? 'pr-6' : 'pl-6',
    
    pr1: isRTL ? 'pl-1' : 'pr-1',
    pr2: isRTL ? 'pl-2' : 'pr-2',
    pr3: isRTL ? 'pl-3' : 'pr-3',
    pr4: isRTL ? 'pl-4' : 'pr-4',
    pr5: isRTL ? 'pl-5' : 'pr-5',
    pr6: isRTL ? 'pl-6' : 'pr-6',
    
    // Position
    left0: isRTL ? 'right-0' : 'left-0',
    right0: isRTL ? 'left-0' : 'right-0',
    leftAuto: isRTL ? 'right-auto' : 'left-auto',
    rightAuto: isRTL ? 'left-auto' : 'right-auto',
    
    // Border radius
    roundedL: isRTL ? 'rounded-r-md' : 'rounded-l-md',
    roundedR: isRTL ? 'rounded-l-md' : 'rounded-r-md',
  };

  return rtlClasses;
}

/**
 * Composant utilitaire pour forcer la direction RTL/LTR
 */
export function DirectionWrapper({ 
  children, 
  forceDirection 
}: { 
  children: React.ReactNode;
  forceDirection?: 'rtl' | 'ltr';
}) {
  const { isRTL } = useRTL();
  const direction = forceDirection || (isRTL ? 'rtl' : 'ltr');
  
  return (
    <div dir={direction} className="direction-wrapper">
      {children}
    </div>
  );
}

/**
 * Composant pour le texte arabe optimisé
 */
export function ArabicText({ 
  children, 
  className = '', 
  variant = 'normal',
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'normal' | 'large' | 'quran' | 'title';
}) {
  const { isRTL } = useRTL();
  
  const baseClasses = [
    'arabic-text',
    variant === 'large' && 'arabic-text-large',
    variant === 'quran' && 'arabic-text-quran',
    variant === 'title' && 'arabic-text-title',
    isRTL && 'text-right',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
}