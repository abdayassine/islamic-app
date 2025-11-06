# 🕌 IslamicApp - Complete Islamic Companion

<div align="center">

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/islamic-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)

A comprehensive Islamic web application providing prayer times, Qibla direction, Quran reading, dhikr counter, Islamic calendar, and radio streaming.

[🚀 Live Demo](https://1k2wpdmnjhe1.space.minimax.io) • [📖 Documentation](#-features) • [🛠️ Setup](#-installation) • [🤝 Contributing](#contributing)

</div>

## 📋 Overview

IslamicApp is a modern, full-featured Islamic web application designed to serve Muslims worldwide with essential religious tools and information. Built with React, TypeScript, and Vite, it provides a seamless, responsive experience across all devices.

## ✨ Features

### ⏰ Prayer Times
- **5 Daily Prayers**: Fajr, Dhuhr, Asr, Maghrib, Isha
- **Automatic Geolocation** with manual city/country input fallback
- **Real-time API** integration with Aladhan API (ISNA method)
- **Live Countdown** to next prayer
- **Multiple Calculation Methods** support

### 🧭 Qibla Direction
- **Accurate Qibla Compass** using device sensors
- **Location-based calculations** for precise direction
- **Visual compass interface** with degree indicators

### 📖 Quran & Tafsir
- **Complete Quran Text** with Arabic and translations
- **Chapter Navigation** with Surah list
- **Verse-by-verse Reading** with smooth scrolling
- **Audio Integration** for recitation support

### 🔔 Dhikr Counter
- **Digital Tasbih** with multiple dhikr categories
- **Progress Tracking** with session history
- **Custom Dhikr** addition capability
- **Remembrance Categories**: 99 Names, Morning/Evening, etc.

### 🗓️ Islamic Calendar
- **Hijri Calendar** with Gregorian conversion
- **Islamic Events** and important dates
- **Monthly and yearly views**
- **Event notifications**

### 🎵 Radio Quran
- **Live Radio Streaming** of Quran recitation
- **Multiple Reciter Support** with quality selection
- **Background Playback** functionality
- **Playlist Management**

### 🌍 Multilingual Support
- **Languages**: Arabic (RTL), English, French
- **Automatic Language Detection**
- **Persistent Language Preference**
- **Full RTL Support** for Arabic

### 🎨 Modern UI/UX
- **Responsive Design** for all screen sizes
- **Dark/Light Theme** toggle
- **Smooth Animations** and transitions
- **Accessibility Features** (WCAG compliant)
- **Progressive Web App** capabilities

### 👤 Authentication & Admin
- **User Authentication** with secure login
- **Admin Dashboard** for content management
- **User Profile Management**
- **Progress Tracking** across devices

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Internationalization**: react-i18next
- **Routing**: React Router
- **Icons**: Lucide React
- **Backend**: Supabase (Database, Auth, Storage)
- **APIs**: 
  - Aladhan API (Prayer Times)
  - Quran.com API (Quran Text)
  - OpenStreetMap (Geocoding)

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ 
- **npm** or **pnpm** or **yarn**
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/islamic-app.git
   cd islamic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
islamic-app/
├── public/                 # Static assets
│   ├── index.html
│   ├── vite.svg
│   └── [page].html        # Individual pages
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Navigation.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── PrayerTimesPage.tsx
│   │   ├── QuranPage.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.tsx
│   │   ├── useTheme.tsx
│   │   └── ...
│   ├── contexts/         # React contexts
│   │   └── AudioContext.tsx
│   ├── lib/              # Utility libraries
│   │   ├── api.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── services/         # API services
│   │   ├── quranAPI.ts
│   │   └── radioStreaming.ts
│   ├── i18n/             # Internationalization
│   │   ├── locales/
│   │   │   ├── ar.json
│   │   │   ├── en.json
│   │   │   └── fr.json
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── styles/           # CSS styles
│   │   └── rtl.css
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── docs/                 # Additional documentation
├── supabase/            # Supabase configuration
│   ├── functions/       # Edge functions
│   ├── migrations/      # Database migrations
│   └── tables/          # Table definitions
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── ...
```

## 🔧 Configuration

### Prayer Times Configuration

The app uses the Aladhan API with the following settings:
- **Calculation Method**: ISNA (Islamic Society of North America)
- **Madhab**: Shafi (can be customized)
- **High Latitude Rule**: Angle-based

You can customize these in `src/services/prayerTimes.ts`.

### Theme Configuration

Themes are defined in `tailwind.config.js`:
- **Light Theme**: Default Islamic color scheme
- **Dark Theme**: Optimized for night usage
- **RTL Support**: Complete Arabic language support

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Progressive Web App

The app is configured as a PWA with:
- **Offline functionality** for cached content
- **Add to Home Screen** capability
- **Push notifications** (configurable)
- **Background sync** for data updates

## 🌐 API Documentation

### External APIs Used

1. **Aladhan API**
   - Endpoint: `https://api.aladhan.com/v1/`
   - Used for: Prayer times calculation
   - Documentation: [Aladhan API Docs](https://aladhan.com/api)

2. **Quran.com API**
   - Endpoint: `https://api.quran.com/api/v4/`
   - Used for: Quran text and translations
   - Documentation: [Quran.com API Docs](https://docs.quran.com/)

3. **OpenStreetMap Nominatim**
   - Endpoint: `https://nominatim.openstreetmap.org/`
   - Used for: Geocoding and reverse geocoding
   - Documentation: [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)

## 🚀 Deployment

### GitHub Pages (Simple)
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Code Style

- **TypeScript**: Use strict mode
- **Formatting**: Prettier configuration included
- **Linting**: ESLint rules enforced
- **Commits**: Follow conventional commit format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aladhan API** for prayer times calculation
- **Quran.com** for Quran text and translations
- **OpenStreetMap** for geocoding services
- **Islamic Society of North America** for calculation methods
- **Contributors** who help improve this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/islamic-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/islamic-app/discussions)
- **Email**: support@example.com

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Prayer times with geolocation
- ✅ Qibla direction finder
- ✅ Quran reader
- ✅ Dhikr counter
- ✅ Islamic calendar

### Phase 2 (Planned)
- [ ] Prayer time notifications
- [ ] Audio Athan player
- [ ] Quran audio recitation
- [ ] Prayer journal
- [ ] Mosque finder

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline synchronization
- [ ] Community features
- [ ] AI-powered Quran insights
- [ ] Multi-region customization

---

<div align="center">

**Made with ❤️ for the Muslim Ummah**

[Website](https://yourwebsite.com) • [Twitter](https://twitter.com/yourhandle) • [LinkedIn](https://linkedin.com/in/yourprofile)

</div>