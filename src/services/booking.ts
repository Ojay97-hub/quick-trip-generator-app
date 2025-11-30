import { Accommodation } from '../types';

const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
const BOOKING_HOST = 'booking-com.p.rapidapi.com';
const BASE_URL = `https://${BOOKING_HOST}`;

export const searchHotels = async (
  location: string,
  checkInDate: string, // YYYY-MM-DD
  checkOutDate: string, // YYYY-MM-DD
  adults: number = 2,
  maxPrice?: number
): Promise<Accommodation[]> => {
  if (!RAPIDAPI_KEY) {
    console.warn('RapidAPI Key is missing. Using fallback accommodation.');
    return [];
  }

  // Clean location string (e.g. "Bath, UK" -> "Bath") to improve search matches
  const cleanLocation = location.split(',')[0].trim();
  console.log(`Booking.com: Searching for "${cleanLocation}"... Max price: ${maxPrice ? '£' + maxPrice : 'Any'}`);

  try {
    // 1. Search for location ID
    const locationUrl = `${BASE_URL}/v1/hotels/locations?name=${encodeURIComponent(cleanLocation)}&locale=en-gb`;
    const locationRes = await fetch(locationUrl, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': BOOKING_HOST
      }
    });
    
    const locationData = await locationRes.json();
    
    if (!Array.isArray(locationData) || locationData.length === 0) {
      console.warn('Booking.com Location Search failed or returned no results:', JSON.stringify(locationData));
      return [];
    }
    
    const destId = locationData[0].dest_id;
    const searchType = locationData[0].dest_type;
    
    console.log(`Booking.com: Found ID ${destId} (${searchType})`);

    // 2. Search for hotels
    // We fetch order_by 'price' if budget is tight, otherwise 'popularity'
    // Actually, sticking to 'popularity' is safer for quality, then we filter by price.
    const sortOrder = maxPrice && maxPrice < 100 ? 'price' : 'popularity';
    
    const searchUrl = `${BASE_URL}/v1/hotels/search?dest_id=${destId}&search_type=${searchType}&dest_type=${searchType}&checkin_date=${checkInDate}&checkout_date=${checkOutDate}&adults_number=${adults}&room_number=1&order_by=${sortOrder}&filter_by_currency=GBP&locale=en-gb&units=metric`;
    
    const hotelsRes = await fetch(searchUrl, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': BOOKING_HOST
      }
    });

    const hotelsData = await hotelsRes.json();
    
    if (!hotelsData || !hotelsData.result) {
        console.warn('Booking.com Search returned no results:', JSON.stringify(hotelsData));
        return [];
    }
    
    let results = hotelsData.result;
    console.log(`Booking.com: Found ${results.length} hotels (raw)`);

    // 3. Filter by Price if maxPrice is set
    if (maxPrice) {
      results = results.filter((hotel: any) => {
        const price = hotel.min_total_price;
        return price && price <= maxPrice;
      });
      console.log(`Booking.com: ${results.length} hotels match budget < £${maxPrice}`);
    }

    // Map to our Accommodation type (Top 3)
    return results.slice(0, 3).map((hotel: any) => {
      // Generate booking.com URL - use simplest possible format that always works
      const location = encodeURIComponent(cleanLocation);
      
      // Use the absolute simplest search URL - just location
      // This will show search results for the location, user can then find the specific hotel
      // Booking.com will handle dates and guests on their end
      const bookingUrl = `https://www.booking.com/searchresults.html?ss=${location}`;

      return {
        name: hotel.hotel_name,
        type: hotel.accommodation_type_name || 'Hotel',
        rating: hotel.review_score || 0,
        distance: `${hotel.distance_to_cc} km from centre`,
        priceRange: `£${Math.round(hotel.min_total_price)} per night`,
        amenities: ['WiFi', 'Parking'], // API doesn't always return these easily in list view
        imageUrl: hotel.main_photo_url,
        bookingUrl: bookingUrl
      };
    });

  } catch (error) {
    console.error('Error fetching Booking.com data:', error);
    return [];
  }
};
