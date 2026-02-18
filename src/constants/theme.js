export const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: 'rgba(255,255,255,0.55)',
  textWhite: '#FFFFFF',
  card: 'rgba(255,255,255,0.08)',
  cardLight: 'rgba(255,255,255,0.12)',
  border: 'rgba(255,255,255,0.1)',
  borderLight: 'rgba(255,255,255,0.06)',
  inputBg: 'rgba(255,255,255,0.12)',
  shadow: 'rgba(0,0,0,0.1)',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
};

export const GRADIENTS = {
  clear: ['#2563eb', '#7c3aed'],
  clouds: ['#475569', '#64748b'],
  rain: ['#1e293b', '#334155', '#475569'],
  drizzle: ['#1e3a5f', '#2d4a6f'],
  thunderstorm: ['#0f172a', '#1e1b4b', '#312e81'],
  snow: ['#94a3b8', '#cbd5e1'],
  mist: ['#6b7280', '#9ca3af'],
  default: ['#1e40af', '#3b82f6'],
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

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
  xxxl: 48,
  huge: 76,
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
