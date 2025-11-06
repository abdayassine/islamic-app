import { PrayerTimes, Surah, Ayah, Location } from '../types';

const AL_QURAN_CLOUD_BASE = 'https://api.alquran.cloud/v1';
const ALADHAN_BASE = 'https://api.aladhan.com/v1';

// Prayer Times API
export const getPrayerTimes = async (
  latitude: number,
  longitude: number,
  method: number = 2,
  school: number = 0
): Promise<PrayerTimes> => {
  const date = Math.floor(Date.now() / 1000);
  const response = await fetch(
    `${ALADHAN_BASE}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`
  );
  const data = await response.json();
  
  if (data.code === 200) {
    return data.data.timings;
  }
  throw new Error('Impossible de récupérer les horaires de prière');
};

export const getPrayerTimesByCity = async (
  city: string,
  country: string = 'FR',
  method: number = 2
): Promise<PrayerTimes> => {
  const date = Math.floor(Date.now() / 1000);
  const response = await fetch(
    `${ALADHAN_BASE}/timingsByCity/${date}?city=${city}&country=${country}&method=${method}`
  );
  const data = await response.json();
  
  if (data.code === 200) {
    return data.data.timings;
  }
  throw new Error('Impossible de récupérer les horaires de prière');
};

// Quran API
export const getSurahList = async (): Promise<Surah[]> => {
  const response = await fetch(`${AL_QURAN_CLOUD_BASE}/surah`);
  const data = await response.json();
  
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Impossible de récupérer la liste des sourates');
};

export const getSurah = async (
  number: number,
  edition: string = 'quran-uthmani'
): Promise<{ ayahs: Ayah[] }> => {
  const response = await fetch(`${AL_QURAN_CLOUD_BASE}/surah/${number}/${edition}`);
  const data = await response.json();
  
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Impossible de récupérer la sourate');
};

export const getSurahWithTranslation = async (
  number: number
): Promise<{ arabic: Ayah[]; french: Ayah[] }> => {
  const [arabicRes, frenchRes] = await Promise.all([
    fetch(`${AL_QURAN_CLOUD_BASE}/surah/${number}/quran-uthmani`),
    fetch(`${AL_QURAN_CLOUD_BASE}/surah/${number}/fr.hamidullah`)
  ]);
  
  const arabicData = await arabicRes.json();
  const frenchData = await frenchRes.json();
  
  if (arabicData.code === 200 && frenchData.code === 200) {
    return {
      arabic: arabicData.data.ayahs,
      french: frenchData.data.ayahs
    };
  }
  throw new Error('Impossible de récupérer la sourate avec traduction');
};

export const getRandomAyah = async (): Promise<{ arabic: string; french: string; reference: string }> => {
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  const surahInfo = await getSurah(randomSurah, 'quran-uthmani');
  const randomAyahIndex = Math.floor(Math.random() * surahInfo.ayahs.length);
  
  const [arabicRes, frenchRes] = await Promise.all([
    fetch(`${AL_QURAN_CLOUD_BASE}/surah/${randomSurah}/quran-uthmani`),
    fetch(`${AL_QURAN_CLOUD_BASE}/surah/${randomSurah}/fr.hamidullah`)
  ]);
  
  const arabicData = await arabicRes.json();
  const frenchData = await frenchRes.json();
  
  return {
    arabic: arabicData.data.ayahs[randomAyahIndex].text,
    french: frenchData.data.ayahs[randomAyahIndex].text,
    reference: `Sourate ${randomSurah}:${randomAyahIndex + 1}`
  };
};

// Qibla Direction Calculation
export const calculateQiblaDirection = (userLat: number, userLon: number): number => {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
  
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  
  const dLon = toRad(kaabaLon - userLon);
  const lat1 = toRad(userLat);
  const lat2 = toRad(kaabaLat);
  
  const y = Math.sin(dLon);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);
  
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  return bearing;
};

export const calculateDistanceToKaaba = (userLat: number, userLon: number): number => {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
  
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(kaabaLat - userLat);
  const dLon = toRad(kaabaLon - userLon);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) * Math.cos(toRad(kaabaLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
};

// Hijri Calendar
export const convertToHijri = async (date?: Date): Promise<{ date: string; month: string; year: string }> => {
  const timestamp = date ? Math.floor(date.getTime() / 1000) : Math.floor(Date.now() / 1000);
  const response = await fetch(`${ALADHAN_BASE}/gToH/${timestamp}`);
  const data = await response.json();
  
  if (data.code === 200) {
    return {
      date: data.data.hijri.day,
      month: data.data.hijri.month.fr || data.data.hijri.month.en,
      year: data.data.hijri.year
    };
  }
  throw new Error('Impossible de convertir la date');
};

// Geolocation
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error('Impossible d\'obtenir votre position: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Duas Data (Simple static data for demonstration)
export const duasData = [
  {
    id: '1',
    title: 'Dua du matin',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Aṣbaḥnā wa aṣbaḥa-l-mulku lillāh',
    translation: 'Nous voici au matin et le royaume appartient à Allah',
    category: 'Matin'
  },
  {
    id: '2',
    title: 'Dua du soir',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsaynā wa amsā-l-mulku lillāh',
    translation: 'Nous voici au soir et le royaume appartient à Allah',
    category: 'Soir'
  },
  {
    id: '3',
    title: 'Avant de manger',
    arabic: 'بِسْمِ اللهِ',
    transliteration: 'Bismillāh',
    translation: 'Au nom d\'Allah',
    category: 'Repas'
  },
  {
    id: '4',
    title: 'Après avoir mangé',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
    transliteration: 'Al-ḥamdu lillāhi-lladhī aṭʿamanā wa saqānā',
    translation: 'Louange à Allah qui nous a nourri et abreuvé',
    category: 'Repas'
  },
  {
    id: '5',
    title: 'En entrant à la maison',
    arabic: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا',
    transliteration: 'Bismillāhi walajna wa bismillāhi kharajna',
    translation: 'Au nom d\'Allah nous entrons et au nom d\'Allah nous sortons',
    category: 'Voyage'
  },
  {
    id: '6',
    title: 'Dua pour la patience',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatika',
    translation: 'Ô Allah, aide-moi à T\'invoquer, à Te remercier et à T\'adorer de la meilleure façon',
    category: 'Épreuves'
  },
  {
    id: '7',
    title: 'Dua de gratitude',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Al-ḥamdu lillāhi rabbi-l-ʿālamīn',
    translation: 'Louange à Allah, Seigneur des mondes',
    category: 'Gratitude'
  },
  {
    id: '8',
    title: 'En se couchant',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika-llāhumma amūtu wa aḥyā',
    translation: 'En Ton nom, ô Allah, je meurs et je vis',
    category: 'Soir'
  }
];
