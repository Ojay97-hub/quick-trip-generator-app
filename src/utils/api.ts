import { TripPreferences, Trip, Activity, TravelOption, Accommodation } from '../types';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

// Log API key status (safe logging)
console.log('API Config:', {
  anthropicKeyPresent: !!ANTHROPIC_API_KEY,
  pexelsKeyPresent: !!PEXELS_API_KEY
});

// Generate booking URL based on activity and destination
const generateBookingUrl = (activityName: string, destination: string, category: string): { url: string; platform: string } => {
  const encodedActivity = encodeURIComponent(`${activityName} ${destination}`);
  const encodedDestination = encodeURIComponent(destination);
  
  // Different platforms based on category
  if (category.toLowerCase().includes('food') || category.toLowerCase().includes('restaurant') || category.toLowerCase().includes('cafe')) {
    return {
      url: `https://resy.com/cities/${encodedDestination.toLowerCase()}?query=${encodedActivity}`,
      platform: 'Resy'
    };
  }
  
  if (category.toLowerCase().includes('tour') || category.toLowerCase().includes('experience')) {
    return {
      url: `https://www.getyourguide.com/s/?q=${encodedActivity}`,
      platform: 'GetYourGuide'
    };
  }
  
  // Default to TripAdvisor
  return {
    url: `https://www.tripadvisor.com/Search?q=${encodedActivity}`,
    platform: 'TripAdvisor'
  };
};

// Generate Google Maps URL for destination
const generateMapsUrl = (destination: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
};

// Generate travel options based on preferences
const generateTravelOptions = (preferences: TripPreferences, destination: string): TravelOption[] => {
  const { location, maxTravelTime } = preferences;
  
  // Estimate times based on max travel time
  const trainTime = Math.max(30, Math.floor(maxTravelTime * 60 * 0.6)); // Trains are usually faster
  const carTime = Math.floor(maxTravelTime * 60 * 0.8);
  const busTime = maxTravelTime * 60; // Buses take full time
  
  const formatDuration = (mins: number): string => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };
  
  // Estimate costs based on distance (rough approximation)
  const baseCost = maxTravelTime * 15;
  
  return [
    {
      type: 'train',
      duration: formatDuration(trainTime),
      cost: `£${Math.round(baseCost * 1.2)}`,
      fromLocation: location,
      tags: ['Fast', 'Scenic', 'Direct']
    },
    {
      type: 'car',
      duration: formatDuration(carTime),
      cost: `£${Math.round(baseCost * 0.5)} - £${Math.round(baseCost * 0.7)} (fuel)`,
      fromLocation: location,
      tags: ['Flexible', 'Stop anywhere']
    },
    {
      type: 'bus',
      duration: formatDuration(busTime),
      cost: `£${Math.round(baseCost * 0.4)}`,
      fromLocation: location,
      tags: ['Cheapest', 'Direct routes']
    }
  ];
};

// Generate accommodation suggestions
const generateAccommodation = (destination: string, budgetCategory: string): Accommodation[] => {
  const baseAccommodation: Accommodation[] = [];
  
  // Add luxury option
  baseAccommodation.push({
    name: `The ${destination} Grand Hotel`,
    type: 'Luxury Hotel',
    rating: 4.8,
    distance: '0.3 miles from centre',
    priceRange: '£180 - £320/night',
    amenities: ['Spa', 'Pool', 'Restaurant']
  });
  
  // Add mid-range option
  baseAccommodation.push({
    name: `${destination} City Apartments`,
    type: 'Apartment',
    rating: 4.3,
    distance: '0.2 miles from centre',
    priceRange: '£95 - £150/night',
    amenities: ['Kitchen', 'Parking', 'WiFi']
  });
  
  // Add budget option
  baseAccommodation.push({
    name: `YHA ${destination}`,
    type: 'Budget Hostel',
    rating: 4.1,
    distance: '0.5 miles from centre',
    priceRange: '£35 - £55/night',
    amenities: ['WiFi', 'Lounge', 'Shared Kitchen']
  });
  
  return baseAccommodation;
};

export const generateTripItinerary = async (preferences: TripPreferences): Promise<Trip> => {
  if (!ANTHROPIC_API_KEY) {
    console.warn('Anthropic API Key is missing! Using mock generator.');
    return mockTripGenerator(preferences);
  }

  try {
    const prompt = `Generate a day trip itinerary from ${preferences.location} with these preferences:
- Max travel time to destination: ${preferences.maxTravelTime} hours
- Budget: £${preferences.budgetPerPerson} per person (${preferences.budgetCategory} tier)
- Group size: ${preferences.groupSize}
- Interests: ${preferences.interests.join(', ')}

Find a real UK destination within ${preferences.maxTravelTime} hours of ${preferences.location} that matches these interests.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "destination": "City Name, UK",
  "subtitle": "Short catchy 2-3 word phrase describing the trip vibe",
  "duration": "Xh duration",
  "costRange": "£X - £Y pp",
  "rating": 4.5,
  "interests": ["tag1", "tag2", "tag3"],
  "activities": [
    {
      "name": "Specific real place name",
      "category": "Category type",
      "description": "Brief 1-sentence description",
      "duration": "Xh Xm",
      "cost": "£X or Free",
      "rating": 4.5,
      "mustDo": true,
      "startTime": "09:00"
    }
  ],
  "tripTips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}

Include 3-5 activities with realistic times starting from 09:00. Use real place names.`;

    console.log('Sending request to Claude...');

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      } catch (e) {
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    const contentText = data.content[0].text;
    
    console.log('Claude response received');

    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid JSON format in response:', contentText);
      throw new Error('Invalid response format from Claude');
    }
    
    const trip: Trip = JSON.parse(jsonMatch[0]);
    
    // Enhance activities with booking URLs
    trip.activities = trip.activities.map(activity => {
      const booking = generateBookingUrl(activity.name, trip.destination, activity.category);
      return {
        ...activity,
        bookingUrl: booking.url,
        bookingPlatform: booking.platform
      };
    });
    
    // Add travel options
    trip.travelOptions = generateTravelOptions(preferences, trip.destination);
    
    // Add accommodation
    trip.accommodation = generateAccommodation(trip.destination.split(',')[0], preferences.budgetCategory);
    
    // Add maps URL
    trip.mapsUrl = generateMapsUrl(trip.destination);
    
    return trip;

  } catch (error) {
    console.error('Trip Generation Error:', error);
    // Fallback to mock generator on error so user sees something
    console.log('Falling back to mock generator due to error');
    return mockTripGenerator(preferences);
  }
};

export const getLocationImage = async (location: string): Promise<string> => {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API Key is missing!');
    return getDefaultImage(location);
  }

  try {
    const response = await fetch(
      `${PEXELS_API_URL}?query=${encodeURIComponent(location + ' travel landmark')}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Pexels API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const data = await response.json();
    
    // Get a random image from results for variety
    const photos = data.photos || [];
    if (photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(photos.length, 3));
      return photos[randomIndex]?.src?.large || getDefaultImage(location);
    }
    
    return getDefaultImage(location);
  } catch (error) {
    console.error('Pexels Error:', error);
    return getDefaultImage(location);
  }
};

// Default images for common UK destinations
const getDefaultImage = (location: string): string => {
  const locationLower = location.toLowerCase();
  
  const defaultImages: Record<string, string> = {
    'bath': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1',
    'edinburgh': 'https://images.unsplash.com/photo-1506377585622-bedcbb5f7c0e',
    'york': 'https://images.unsplash.com/photo-1570698473651-b2de99bae12f',
    'oxford': 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343',
    'cambridge': 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd',
    'brighton': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b',
    'liverpool': 'https://images.unsplash.com/photo-1580752300992-559f8e3f98b5',
    'bristol': 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260',
    'manchester': 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853',
    'glasgow': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482',
    'cardiff': 'https://images.unsplash.com/photo-1571689936114-b16146c9570a',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
  };
  
  for (const [city, url] of Object.entries(defaultImages)) {
    if (locationLower.includes(city)) {
      return url;
    }
  }
  
  // Generic UK travel image
  return 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963';
};

const mockTripGenerator = (preferences: TripPreferences): Promise<Trip> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dynamic mock based on location if possible, otherwise generic
      const isLondon = preferences.location.toLowerCase() === 'london';
      const destination = isLondon ? "Brighton, UK" : "Bath, UK";
      const subtitle = isLondon ? "Seaside Escape" : "Riverside Escape";
      
      const activities: Activity[] = isLondon ? [
        {
          name: "Royal Pavilion",
          category: "Historic & Cultural",
          description: "Exotic palace with Indian domes and Chinese interiors",
          duration: "1h 30m",
          cost: "£18",
          rating: 4.6,
          mustDo: true,
          startTime: "10:00",
          ...generateBookingUrl("Royal Pavilion", destination, "Historic & Cultural")
        },
        {
          name: "The Lanes",
          category: "Shopping",
          description: "Maze of twisting alleyways with independent shops",
          duration: "2h",
          cost: "Free",
          rating: 4.7,
          mustDo: true,
          startTime: "12:00"
        },
        {
          name: "Brighton Palace Pier",
          category: "Entertainment",
          description: "Iconic Victorian pier with rides and arcades",
          duration: "1h",
          cost: "Free entry",
          rating: 4.4,
          mustDo: false,
          startTime: "14:30",
          ...generateBookingUrl("Brighton Palace Pier", destination, "Entertainment")
        }
      ] : [
        {
          name: "Roman Baths",
          category: "Historic & Cultural",
          description: "UNESCO World Heritage site with intact Roman architecture",
          duration: "1h 30m",
          cost: "£12",
          rating: 4.8,
          mustDo: true,
          startTime: "09:00",
          ...generateBookingUrl("Roman Baths", destination, "Historic & Cultural")
        },
        {
          name: "Riverside Walk",
          category: "Scenic & Relaxing",
          description: "Scenic route along the River Avon",
          duration: "45min",
          cost: "Free",
          rating: 4.5,
          mustDo: false,
          startTime: "10:45"
        },
        {
          name: "Sally Lunn's Cafe",
          category: "Local Food",
          description: "Popular cafe with local cuisine and famous Bath buns",
          duration: "1h",
          cost: "£12",
          rating: 4.6,
          mustDo: true,
          startTime: "11:45",
          ...generateBookingUrl("Sally Lunn's Cafe", destination, "Local Food")
        }
      ];

      resolve({
        destination,
        subtitle,
        duration: "6h duration",
        costRange: "£25 - £50 pp",
        rating: 4.7,
        interests: preferences.interests.length > 0 ? preferences.interests.slice(0, 3) : ['Culture', 'History', 'Food'],
        activities,
        tripTips: [
          "Book online to skip queues",
          "Check train times in advance",
          "Bring a portable charger"
        ],
        travelOptions: generateTravelOptions(preferences, destination),
        accommodation: generateAccommodation(destination.split(',')[0], preferences.budgetCategory),
        mapsUrl: generateMapsUrl(destination)
      });
    }, 1500);
  });
};
