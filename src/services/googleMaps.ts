const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

export interface TravelDetails {
  duration: string;
  durationValue: number; // in seconds
  distance: string;
  cost?: string; // Rough estimate based on distance/mode if not provided by API
}

export const getTravelTime = async (
  origin: string,
  destination: string,
  mode: 'driving' | 'transit' | 'bicycling' | 'walking' = 'driving'
): Promise<TravelDetails | null> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API Key is missing. Using fallback estimation.');
    return null;
  }

  try {
    // Directions API
    const url = `${BASE_URL}/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      console.warn(`Google Maps API Error: ${data.status}`);
      return null;
    }

    const leg = data.routes[0].legs[0];
    return {
      duration: leg.duration.text,
      durationValue: leg.duration.value,
      distance: leg.distance.text
    };

  } catch (error) {
    console.error('Error fetching Google Maps data:', error);
    return null;
  }
};

export const getPlacePhoto = (photoReference: string, maxWidth: number = 400): string => {
  if (!GOOGLE_MAPS_API_KEY) return '';
  return `${BASE_URL}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
};

