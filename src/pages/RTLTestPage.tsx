import React from 'react';
import { useTranslation } from 'react-i18next';
import RTLTest from '../components/RTLTest';

/**
 * Page de test dédiée au support RTL
 * Accessible via /rtl-test pour valider les optimisations
 */
export default function RTLTestPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background-page dark:bg-background-dark-page pt-20 pb-16">
      <div className="container mx-auto px-4">
        <RTLTest />
      </div>
    </div>
  );
}