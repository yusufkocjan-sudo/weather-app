// Curated Unsplash city photos — dark, atmospheric shots
const CITY_IMAGES = {
  london: {
    name: 'London',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    mockTemp: 12,
    mockIcon: '04d',
    mockCondition: 'Clouds',
  },
  'new york': {
    name: 'New York',
    country: 'US',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    mockTemp: 8,
    mockIcon: '13d',
    mockCondition: 'Snow',
  },
  tokyo: {
    name: 'Tokyo',
    country: 'JP',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    mockTemp: 18,
    mockIcon: '01d',
    mockCondition: 'Clear',
  },
  paris: {
    name: 'Paris',
    country: 'FR',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    mockTemp: 10,
    mockIcon: '10d',
    mockCondition: 'Rain',
  },
  istanbul: {
    name: 'Istanbul',
    country: 'TR',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    mockTemp: 14,
    mockIcon: '01d',
    mockCondition: 'Clear',
  },
  dubai: {
    name: 'Dubai',
    country: 'AE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    mockTemp: 32,
    mockIcon: '01d',
    mockCondition: 'Clear',
  },
  sydney: {
    name: 'Sydney',
    country: 'AU',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    mockTemp: 24,
    mockIcon: '01d',
    mockCondition: 'Clear',
  },
  berlin: {
    name: 'Berlin',
    country: 'DE',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
    mockTemp: 7,
    mockIcon: '04d',
    mockCondition: 'Clouds',
  },
};

// In-memory cache for dynamically fetched images
const imageCache = {};

export function getCityImage(cityName) {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();
  // Check hardcoded first, then cache
  return CITY_IMAGES[key]?.image || imageCache[key] || null;
}

export async function fetchCityImage(cityName) {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();

  // Return hardcoded image if available
  if (CITY_IMAGES[key]?.image) return CITY_IMAGES[key].image;

  // Return cached image if already fetched
  if (imageCache[key]) return imageCache[key];

  // Fetch from Wikipedia REST API
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (res.ok) {
      const data = await res.json();
      const imageUrl = data.originalimage?.source || data.thumbnail?.source || null;
      if (imageUrl) {
        imageCache[key] = imageUrl;
        return imageUrl;
      }
    }
  } catch {
    // Wikipedia failed, ignore
  }

  return null;
}

export const CITY_LIST = Object.values(CITY_IMAGES);

export default CITY_IMAGES;
