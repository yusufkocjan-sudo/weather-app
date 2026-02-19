const API_KEY = 'a16e38d85ac47d67090fc0604783a32d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock data for demo (used when API key is not yet active)
const MOCK_CITIES = {
  london: {
    current: { name: 'London', sys: { country: 'GB', sunrise: 1708069200, sunset: 1708102800 }, main: { temp: 8, feels_like: 5, humidity: 78, pressure: 1012, temp_min: 5, temp_max: 10 }, wind: { speed: 5.2, deg: 220 }, visibility: 8000, weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 9, temp_max: 11, temp_min: 6 }, weather: [{ icon: '03d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 7, temp_max: 9, temp_min: 4 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 10, temp_max: 12, temp_min: 7 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 6, temp_max: 8, temp_min: 3 }, weather: [{ icon: '13d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 8, temp_max: 10, temp_min: 5 }, weather: [{ icon: '01d' }] },
    ],
  },
  istanbul: {
    current: { name: 'Istanbul', sys: { country: 'TR', sunrise: 1708065600, sunset: 1708103400 }, main: { temp: 12, feels_like: 9, humidity: 65, pressure: 1018, temp_min: 8, temp_max: 15 }, wind: { speed: 4.1, deg: 180 }, visibility: 10000, weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 14, temp_max: 16, temp_min: 9 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 11, temp_max: 13, temp_min: 8 }, weather: [{ icon: '04d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 13, temp_max: 15, temp_min: 10 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 10, temp_max: 12, temp_min: 7 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 15, temp_max: 17, temp_min: 11 }, weather: [{ icon: '01d' }] },
    ],
  },
  tokyo: {
    current: { name: 'Tokyo', sys: { country: 'JP', sunrise: 1708038000, sunset: 1708076400 }, main: { temp: 18, feels_like: 16, humidity: 55, pressure: 1015, temp_min: 14, temp_max: 21 }, wind: { speed: 3.6, deg: 90 }, visibility: 16000, weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 19, temp_max: 21, temp_min: 14 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 17, temp_max: 19, temp_min: 13 }, weather: [{ icon: '03d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 20, temp_max: 22, temp_min: 15 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 16, temp_max: 18, temp_min: 12 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 21, temp_max: 23, temp_min: 16 }, weather: [{ icon: '01d' }] },
    ],
  },
  'new york': {
    current: { name: 'New York', sys: { country: 'US', sunrise: 1708087200, sunset: 1708124400 }, main: { temp: 5, feels_like: 1, humidity: 60, pressure: 1020, temp_min: -1, temp_max: 7 }, wind: { speed: 6.7, deg: 300 }, visibility: 5000, weather: [{ main: 'Snow', description: 'light snow', icon: '13d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 3, temp_max: 5, temp_min: -1 }, weather: [{ icon: '13d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 6, temp_max: 8, temp_min: 2 }, weather: [{ icon: '04d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 8, temp_max: 10, temp_min: 4 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 4, temp_max: 6, temp_min: 0 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 7, temp_max: 9, temp_min: 3 }, weather: [{ icon: '02d' }] },
    ],
  },
  paris: {
    current: { name: 'Paris', sys: { country: 'FR', sunrise: 1708069800, sunset: 1708105200 }, main: { temp: 10, feels_like: 7, humidity: 72, pressure: 1014, temp_min: 6, temp_max: 13 }, wind: { speed: 4.5, deg: 250 }, visibility: 7000, weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 11, temp_max: 13, temp_min: 7 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 9, temp_max: 11, temp_min: 6 }, weather: [{ icon: '04d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 12, temp_max: 14, temp_min: 8 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 8, temp_max: 10, temp_min: 5 }, weather: [{ icon: '09d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 13, temp_max: 15, temp_min: 9 }, weather: [{ icon: '01d' }] },
    ],
  },
  dubai: {
    current: { name: 'Dubai', sys: { country: 'AE', sunrise: 1708048800, sunset: 1708090000 }, main: { temp: 32, feels_like: 34, humidity: 45, pressure: 1010, temp_min: 28, temp_max: 36 }, wind: { speed: 4.2, deg: 140 }, visibility: 12000, weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 33, temp_max: 37, temp_min: 29 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 34, temp_max: 38, temp_min: 30 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 31, temp_max: 35, temp_min: 27 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 30, temp_max: 34, temp_min: 26 }, weather: [{ icon: '03d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 35, temp_max: 39, temp_min: 31 }, weather: [{ icon: '01d' }] },
    ],
  },
  sydney: {
    current: { name: 'Sydney', sys: { country: 'AU', sunrise: 1708030800, sunset: 1708078200 }, main: { temp: 24, feels_like: 25, humidity: 55, pressure: 1016, temp_min: 20, temp_max: 28 }, wind: { speed: 5.5, deg: 200 }, visibility: 14000, weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 25, temp_max: 29, temp_min: 21 }, weather: [{ icon: '02d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 22, temp_max: 26, temp_min: 18 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 26, temp_max: 30, temp_min: 22 }, weather: [{ icon: '01d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 23, temp_max: 27, temp_min: 19 }, weather: [{ icon: '03d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 27, temp_max: 31, temp_min: 23 }, weather: [{ icon: '01d' }] },
    ],
  },
  berlin: {
    current: { name: 'Berlin', sys: { country: 'DE', sunrise: 1708068600, sunset: 1708102200 }, main: { temp: 7, feels_like: 3, humidity: 80, pressure: 1008, temp_min: 3, temp_max: 9 }, wind: { speed: 6.8, deg: 270 }, visibility: 6000, weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }] },
    forecast: [
      { dt: Date.now() / 1000 + 86400, dt_txt: getFutureDate(1), main: { temp: 5, temp_max: 7, temp_min: 2 }, weather: [{ icon: '04d' }] },
      { dt: Date.now() / 1000 + 172800, dt_txt: getFutureDate(2), main: { temp: 8, temp_max: 10, temp_min: 4 }, weather: [{ icon: '03d' }] },
      { dt: Date.now() / 1000 + 259200, dt_txt: getFutureDate(3), main: { temp: 4, temp_max: 6, temp_min: 1 }, weather: [{ icon: '13d' }] },
      { dt: Date.now() / 1000 + 345600, dt_txt: getFutureDate(4), main: { temp: 6, temp_max: 8, temp_min: 3 }, weather: [{ icon: '10d' }] },
      { dt: Date.now() / 1000 + 432000, dt_txt: getFutureDate(5), main: { temp: 9, temp_max: 11, temp_min: 5 }, weather: [{ icon: '02d' }] },
    ],
  },
};

function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 12:00:00`;
}

function getMockWeather(city) {
  const key = city.toLowerCase().trim();
  if (MOCK_CITIES[key]) return MOCK_CITIES[key];
  // Generate random weather for unknown cities
  const weathers = [
    { main: 'Clear', description: 'clear sky', icon: '01d' },
    { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
    { main: 'Rain', description: 'light rain', icon: '10d' },
  ];
  const w = weathers[Math.floor(Math.random() * weathers.length)];
  const temp = Math.floor(Math.random() * 30) + 2;
  return {
    current: {
      name: city.charAt(0).toUpperCase() + city.slice(1),
      sys: { country: '--', sunrise: Math.floor(Date.now() / 1000) - 21600, sunset: Math.floor(Date.now() / 1000) + 21600 },
      main: { temp, feels_like: temp - 3, temp_min: temp - 3, temp_max: temp + 3, humidity: 50 + Math.floor(Math.random() * 40), pressure: 1010 + Math.floor(Math.random() * 15) },
      wind: { speed: (Math.random() * 8 + 1).toFixed(1), deg: Math.floor(Math.random() * 360) },
      visibility: 8000 + Math.floor(Math.random() * 8000),
      weather: [w],
    },
    forecast: Array.from({ length: 5 }, (_, i) => ({
      dt: Date.now() / 1000 + 86400 * (i + 1),
      dt_txt: getFutureDate(i + 1),
      main: { temp: temp + Math.floor(Math.random() * 6 - 3), temp_max: temp + 2 + Math.floor(Math.random() * 3), temp_min: temp - 2 - Math.floor(Math.random() * 3) },
      weather: [weathers[Math.floor(Math.random() * weathers.length)]],
    })),
  };
}

export async function getCurrentWeather(city, units = 'metric') {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
    const res = await fetch(url);
    if (res.ok) return res.json();
  } catch (e) {
    // API failed, fall through to mock
  }
  // Fallback to mock data
  return getMockWeather(city).current;
}

export async function getForecast(city, units = 'metric') {
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const daily = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0], 10);
        if (!daily[date] || Math.abs(hour - 12) < Math.abs(parseInt(daily[date].dt_txt.split(' ')[1], 10) - 12)) {
          daily[date] = item;
        }
      });
      return Object.values(daily).slice(0, 5);
    }
  } catch (e) {
    // API failed, fall through to mock
  }
  // Fallback to mock data
  return getMockWeather(city).forecast;
}
