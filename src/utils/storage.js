import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = 'weather_recent_cities';
const UNITS_KEY = 'weather_units';

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
