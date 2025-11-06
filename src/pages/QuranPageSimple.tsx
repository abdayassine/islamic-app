export default function QuranPage() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '25px',
        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>
          📖 Saint Coran
        </h1>
        <p style={{ margin: '0', opacity: 0.9 }}>
          Lisez et méditez sur les versets du Coran
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '20px' }}>Accès Complet</h2>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #bbf7d0',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: '#059669',
            fontSize: '1.5rem'
          }}>
            🌟 Liste Complète des Souras
          </h3>
          <p style={{ 
            margin: '0 0 20px 0',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            Accédez aux 114 souras du Saint Coran avec tous leurs versets, traductions et récitations audio
          </p>
          <a
            href="/surahs"
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#047857';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📖 Explorer toutes les souras
          </a>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {[
          { name: 'Al-Fatiha', number: 1, verses: 7, icon: '🌟' },
          { name: 'Al-Baqarah', number: 2, verses: 286, icon: '🐄' },
          { name: 'Al-Imran', number: 3, verses: 200, icon: '👨‍👩‍👧' },
          { name: 'An-Nisa', number: 4, verses: 176, icon: '👩' },
          { name: 'Al-Maidah', number: 5, verses: 120, icon: '🍽️' },
          { name: 'Al-An\'am', number: 6, verses: 165, icon: '🐑' }
        ].map((surah, index) => (
          <div key={index} style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{surah.icon}</span>
              <span style={{ 
                backgroundColor: '#059669', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {surah.number}
              </span>
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#374151' }}>{surah.name}</h3>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
              {surah.verses} versets
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}