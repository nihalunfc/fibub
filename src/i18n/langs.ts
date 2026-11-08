// The languages fibub's pages come in. English is the source: its pages live at the plain address
// (/science/sky-tonight/); every other language has the same pages under its code
// (/ml/science/sky-tonight/). To add a language: add it here, then add src/i18n/<code>.json
// (copy an existing one and translate the values). Anything a language file leaves out shows in English.
export type Lang = { code: string; name: string; english: string; dir?: 'rtl'; html?: string };

export const LANGS: Lang[] = [
  { code: 'en', name: 'English', english: 'English' },
  { code: 'ml', name: 'മലയാളം', english: 'Malayalam' },
  { code: 'ta', name: 'தமிழ்', english: 'Tamil' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi' },
  { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'te', name: 'తెలుగు', english: 'Telugu' },
  { code: 'bn', name: 'বাংলা', english: 'Bengali' },
  { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'mr', name: 'मराठी', english: 'Marathi' },
  { code: 'ur', name: 'اردو', english: 'Urdu', dir: 'rtl' },
  { code: 'ar', name: 'العربية', english: 'Arabic', dir: 'rtl' },
  { code: 'fa', name: 'فارسی', english: 'Persian', dir: 'rtl' },
  { code: 'fr', name: 'Français', english: 'French' },
  { code: 'de', name: 'Deutsch', english: 'German' },
  { code: 'es', name: 'Español', english: 'Spanish' },
  { code: 'pt', name: 'Português', english: 'Portuguese' },
  { code: 'it', name: 'Italiano', english: 'Italian' },
  { code: 'nl', name: 'Nederlands', english: 'Dutch' },
  { code: 'pl', name: 'Polski', english: 'Polish' },
  { code: 'ru', name: 'Русский', english: 'Russian' },
  { code: 'uk', name: 'Українська', english: 'Ukrainian' },
  { code: 'tr', name: 'Türkçe', english: 'Turkish' },
  { code: 'zh', name: '中文（简体）', english: 'Chinese (Simplified)', html: 'zh-Hans' },
  { code: 'ja', name: '日本語', english: 'Japanese' },
  { code: 'ko', name: '한국어', english: 'Korean' },
  { code: 'tl', name: 'Tagalog', english: 'Tagalog' },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian' },
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese' },
];

export const DEFAULT_LANG = 'en';
export const OTHER_LANGS = LANGS.filter((l) => l.code !== DEFAULT_LANG);
export const langByCode = (code: string) => LANGS.find((l) => l.code === code) ?? LANGS[0];
