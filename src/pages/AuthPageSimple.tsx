import { useTranslation } from 'react-i18next';

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  
  // Vérifier si la langue est arabe (RTL)
  const isRTL = i18n.language === 'ar';

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '25px',
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>
          {t('auth.title')}
        </h1>
        <p style={{ margin: '0', opacity: 0.9 }}>
          {t('auth.subtitle')}
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              {t('auth.email')}
            </label>
            <input 
              type="email" 
              placeholder={t('auth.emailPlaceholder')}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                direction: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              {t('auth.password')}
            </label>
            <input 
              type="password" 
              placeholder={t('auth.passwordPlaceholder')}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                direction: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3730A3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            {t('auth.loginButton')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '10px'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>
            {t('auth.noAccount')}
          </p>
          <button style={{
            backgroundColor: '#10B981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            {t('auth.createAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}