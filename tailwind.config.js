/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1.5rem',
				md: '3rem',
			},
			screens: {
				'2xl': '1200px',
			},
		},
		extend: {
			colors: {
				primary: {
					50: '#F5FAF7',
					100: '#E8F3ED',
					500: '#3D7A52',
					700: '#2D5A3D',
					900: '#1A3D28',
					// Dark mode variants
					dark: {
						50: '#1F2F25',
						100: '#1A3D28',
						500: '#4A9D6F',
						700: '#5DB584',
						900: '#7BC99B',
					}
				},
				gold: {
					100: '#F7EED5',
					300: '#E5C965',
					500: '#D4AF37',
					700: '#B8942D',
					// Dark mode variants (plus subtiles)
					dark: {
						100: '#3D3520',
						300: '#8A7335',
						500: '#A68A3B',
						700: '#C9A854',
					}
				},
				neutral: {
					50: '#FAF9F7',
					100: '#F2EFE9',
					300: '#D4CFC4',
					500: '#8A7F6B',
					700: '#5A4F3D',
					900: '#2C2416',
					// Dark mode variants
					dark: {
						50: '#0F1115',
						100: '#1A1D23',
						200: '#23262D',
						300: '#2D3038',
						500: '#52565E',
						700: '#8B8F96',
						900: '#C4C6CA',
					}
				},
				semantic: {
					success: '#2E7D5F',
					warning: '#C9A237',
					error: '#B43A3A',
					info: '#3D6B9D',
					// Dark mode variants
					dark: {
						success: '#3FA675',
						warning: '#E5C965',
						error: '#D95F5F',
						info: '#5A8BC4',
					}
				},
				background: {
					page: '#FFFFFF',
					card: '#FAF9F7',
					// Dark mode variants
					dark: {
						page: '#0F1115',
						card: '#1A1D23',
						elevated: '#23262D',
					}
				},
			},
			fontFamily: {
				sacred: ['Noto Naskh Arabic', 'serif'],
				arabic: ['Noto Sans Arabic', 'sans-serif'],
				sans: ['Noto Sans', 'sans-serif'],
				mono: ['IBM Plex Mono', 'monospace'],
			},
			fontSize: {
				'xs': ['12px', { lineHeight: '1.4' }],
				'sm': ['14px', { lineHeight: '1.5' }],
				'base': ['16px', { lineHeight: '1.6' }],
				'lg': ['18px', { lineHeight: '1.6' }],
				'xl': ['20px', { lineHeight: '1.5' }],
				'2xl': ['24px', { lineHeight: '1.4' }],
				'3xl': ['28px', { lineHeight: '1.3' }],
				'4xl': ['36px', { lineHeight: '1.25' }],
				'5xl': ['48px', { lineHeight: '1.2' }],
				'6xl': ['56px', { lineHeight: '1.15' }],
			},
			spacing: {
				'2': '8px',
				'3': '12px',
				'4': '16px',
				'6': '24px',
				'8': '32px',
				'12': '48px',
				'16': '64px',
				'24': '96px',
				'32': '128px',
			},
			borderRadius: {
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '24px',
				'full': '9999px',
			},
			boxShadow: {
				'xs': '0 1px 2px rgba(45, 90, 61, 0.06)',
				'sm': '0 2px 8px rgba(45, 90, 61, 0.08)',
				'md': '0 4px 16px rgba(45, 90, 61, 0.1)',
				'lg': '0 8px 32px rgba(45, 90, 61, 0.12)',
				'gold': '0 2px 12px rgba(212, 175, 55, 0.15)',
				// Dark mode shadows
				'dark-xs': '0 1px 2px rgba(0, 0, 0, 0.4)',
				'dark-sm': '0 2px 8px rgba(0, 0, 0, 0.5)',
				'dark-md': '0 4px 16px rgba(0, 0, 0, 0.6)',
				'dark-lg': '0 8px 32px rgba(0, 0, 0, 0.7)',
				'dark-gold': '0 2px 12px rgba(166, 138, 59, 0.25)',
			},
			transitionDuration: {
				'fast': '150ms',
				'base': '250ms',
				'slow': '400ms',
				'prayer': '800ms',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				pulse: {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' },
				},
			},
			animation: {
				fadeIn: 'fadeIn 400ms ease-out',
				pulse: 'pulse 800ms ease-in-out infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
