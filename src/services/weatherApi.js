const API_KEY = 'DEMO_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(city, units = 'metric') {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('City not found');
    if (res.status === 401) throw new Error('Invalid API key');
    throw new Error('Failed to fetch weather data');
  }
  return res.json();
}

export async function getForecast(city, units = 'metric') {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  const data = await res.json();

  // Group by day — pick midday (12:00) reading per day
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

export function setApiKey(key) {
  // This is a workaround — in production you'd use env variables
  // For demo purposes the key is hardcoded above
}
