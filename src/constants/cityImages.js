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

// Generic cityscape fallbacks — beautiful Unsplash photos rotated by city name hash
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // city skyline dusk
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', // city night lights
  'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80', // city sunset
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // urban street
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80', // city aerial
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', // city rooftops
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80', // city bridge night
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80', // city fog morning
];

// Words in Wikipedia image URLs that indicate maps/diagrams (not photos)
const MAP_KEYWORDS = [
  'map', 'location', 'locator', 'district', 'province', 'region',
  'admin', 'flag', 'coat_of_arms', 'seal', 'logo', 'emblem',
  'svg', 'diagram', 'chart', 'icon', 'symbol', 'blank',
];

function isLikelyPhoto(url, width, height) {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Skip SVGs
  if (lower.endsWith('.svg') || lower.includes('.svg/')) return false;
  // Skip if URL contains map/diagram keywords
  if (MAP_KEYWORDS.some((kw) => lower.includes(kw))) return false;
  // Skip tiny images (likely icons/logos)
  if (width && width < 400) return false;
  if (height && height < 250) return false;
  return true;
}

function getFallbackImage(cityName) {
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = ((hash << 5) - hash) + cityName.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

// In-memory cache for dynamically fetched images
const imageCache = {};

export function getCityImage(cityName) {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();
  return CITY_IMAGES[key]?.image || imageCache[key] || null;
}

export async function fetchCityImage(cityName) {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();

  // Return hardcoded image if available
  if (CITY_IMAGES[key]?.image) return CITY_IMAGES[key].image;

  // Return cached image if already fetched
  if (imageCache[key]) return imageCache[key];

  // Try Wikipedia REST API
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (res.ok) {
      const data = await res.json();
      const orig = data.originalimage;
      const thumb = data.thumbnail;
      const imageUrl = orig?.source || thumb?.source || null;
      const imgWidth = orig?.width || thumb?.width || 0;
      const imgHeight = orig?.height || thumb?.height || 0;

      if (isLikelyPhoto(imageUrl, imgWidth, imgHeight)) {
        imageCache[key] = imageUrl;
        return imageUrl;
      }
    }
  } catch {
    // Wikipedia failed, fall through
  }

  // Fallback: beautiful generic cityscape based on city name
  const fallback = getFallbackImage(cityName);
  imageCache[key] = fallback;
  return fallback;
}

export const CITY_LIST = Object.values(CITY_IMAGES);

export default CITY_IMAGES;
