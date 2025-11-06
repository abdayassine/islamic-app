export interface PrayerTime {
  name: string;
  time: string;
  isPast: boolean;
  isCurrent: boolean;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DhikrSession {
  id: string;
  user_id: string;
  dhikr_type: string;
  count: number;
  goal: number;
  session_date: string;
  created_at: string;
}

export interface QuranProgress {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number;
  last_read_at: string;
  notes?: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  bookmark_type: 'quran' | 'dua';
  content_id: string;
  content_title: string;
  content_text: string;
  notes?: string;
  created_at: string;
}

export interface PrayerPreferences {
  id?: string;
  user_id: string;
  calculation_method: string;
  madhab: string;
  latitude?: number;
  longitude?: number;
  city_name?: string;
  manual_adjustments?: Record<string, number>;
  notifications_enabled: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  source?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}
