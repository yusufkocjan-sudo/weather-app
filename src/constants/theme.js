export const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: 'rgba(255,255,255,0.7)',
  textWhite: '#FFFFFF',
  card: 'rgba(255,255,255,0.2)',
  cardSolid: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.3)',
  inputBg: 'rgba(255,255,255,0.25)',
  shadow: 'rgba(0,0,0,0.1)',
  tabBar: 'rgba(0,0,0,0.3)',
  tabBarBorder: 'rgba(255,255,255,0.1)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

export const GRADIENTS = {
  clear: ['#4DA0B0', '#D39D38'],
  clouds: ['#616161', '#9BC5C3'],
  rain: ['#0F2027', '#203A43', '#2C5364'],
  drizzle: ['#3A7BD5', '#3A6073'],
  thunderstorm: ['#0F0C29', '#302B63', '#24243E'],
  snow: ['#E6DADA', '#274046'],
  mist: ['#757F9A', '#D7DDE8'],
  default: ['#2193b0', '#6dd5ed'],
};

export const WEATHER_ICONS = {
  '01d': '\u2600\uFE0F', '01n': '\uD83C\uDF19',
  '02d': '\u26C5', '02n': '\u2601\uFE0F',
  '03d': '\u2601\uFE0F', '03n': '\u2601\uFE0F',
  '04d': '\u2601\uFE0F', '04n': '\u2601\uFE0F',
  '09d': '\uD83C\uDF27\uFE0F', '09n': '\uD83C\uDF27\uFE0F',
  '10d': '\uD83C\uDF26\uFE0F', '10n': '\uD83C\uDF27\uFE0F',
  '11d': '\u26C8\uFE0F', '11n': '\u26C8\uFE0F',
  '13d': '\u2744\uFE0F', '13n': '\u2744\uFE0F',
  '50d': '\uD83C\uDF2B\uFE0F', '50n': '\uD83C\uDF2B\uFE0F',
};

export const TAB_ICONS = {
  home: '\uD83C\uDFE0',
  forecast: '\uD83D\uDCC5',
  explore: '\uD83E\uDDED',
  settings: '\u2699\uFE0F',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
};

export function getGradient(weatherMain) {
  const key = (weatherMain || '').toLowerCase();
  if (key.includes('clear')) return GRADIENTS.clear;
  if (key.includes('cloud')) return GRADIENTS.clouds;
  if (key.includes('rain')) return GRADIENTS.rain;
  if (key.includes('drizzle')) return GRADIENTS.drizzle;
  if (key.includes('thunder')) return GRADIENTS.thunderstorm;
  if (key.includes('snow')) return GRADIENTS.snow;
  if (key.includes('mist') || key.includes('fog') || key.includes('haze')) return GRADIENTS.mist;
  return GRADIENTS.default;
}
