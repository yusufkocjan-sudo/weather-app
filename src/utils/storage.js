import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = 'weather_recent_cities';
const UNITS_KEY = 'weather_units';
const DEFAULT_CITY_KEY = 'weather_default_city';
const NOTIF_DAILY_KEY = 'weather_notif_daily';
const NOTIF_ALERTS_KEY = 'weather_notif_alerts';

export async function getRecentCities() {
  try {
    const data = await AsyncStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addRecentCity(city) {
  try {
    const cities = await getRecentCities();
    const filtered = cities.filter((c) => c.toLowerCase() !== city.toLowerCase());
    const updated = [city, ...filtered].slice(0, 5);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [city];
  }
}

export async function getUnits() {
  try {
    const units = await AsyncStorage.getItem(UNITS_KEY);
    return units || 'metric';
  } catch {
    return 'metric';
  }
}

export async function setUnits(units) {
  try {
    await AsyncStorage.setItem(UNITS_KEY, units);
  } catch {
    // silent
  }
}

export async function getDefaultCity() {
  try {
    const city = await AsyncStorage.getItem(DEFAULT_CITY_KEY);
    return city || 'Istanbul';
  } catch {
    return 'Istanbul';
  }
}

export async function setDefaultCity(city) {
  try {
    await AsyncStorage.setItem(DEFAULT_CITY_KEY, city);
  } catch {
    // silent
  }
}

export async function getNotificationSettings() {
  try {
    const daily = await AsyncStorage.getItem(NOTIF_DAILY_KEY);
    const alerts = await AsyncStorage.getItem(NOTIF_ALERTS_KEY);
    return {
      dailyForecast: daily !== null ? JSON.parse(daily) : true,
      severeAlerts: alerts !== null ? JSON.parse(alerts) : true,
    };
  } catch {
    return { dailyForecast: true, severeAlerts: true };
  }
}

export async function setNotificationSetting(key, value) {
  try {
    const storageKey = key === 'dailyForecast' ? NOTIF_DAILY_KEY : NOTIF_ALERTS_KEY;
    await AsyncStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // silent
  }
}
