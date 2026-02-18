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
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
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
