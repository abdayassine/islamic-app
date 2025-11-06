import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenue dans IslamApp</h1>
      <p>Test avec useTranslation</p>
      <p>Traduction: {t('welcome', 'Bienvenue!')}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>🕐 Horaires de Prière</h3>
          <p>Consultez les horaires de prière pour votre ville</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>📖 Coran</h3>
          <p>Lisez et écoutez le Saint Coran</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>🧭 Qibla</h3>
          <p>Trouvez la direction de la Mecque</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>📿 Dhikr</h3>
          <p>Compteur de dhikr numérique</p>
        </div>
      </div>
    </div>
  );
}