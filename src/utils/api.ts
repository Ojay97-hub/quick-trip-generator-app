import { TripPreferences, Trip } from '../types';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export const generateTripItinerary = async (preferences: TripPreferences): Promise<Trip> => {
  if (!ANTHROPIC_API_KEY) {
    console.warn('Anthropic API Key is missing!');
    return mockTripGenerator(preferences);
  }

  try {
     const prompt = `Generate a quick trip itinerary for ${preferences.location} with the following preferences:
- Max travel time: ${preferences.maxTravelTime} hours
- Budget: ${preferences.budgetPerPerson} per person (${preferences.budgetCategory})
- Group size: ${preferences.groupSize}
- Interests: ${preferences.interests.join(', ')}

Return ONLY a valid JSON object with this exact structure:
{
  "destination": "City, Country",
  "subtitle": "Short catchy phrase",
  "duration": "Day Trip",
  "costRange": "£X-Y pp",
  "rating": 4.5,
  "activities": [
    {
      "name": "Activity name",
      "category": "Category",
      "description": "Brief description",
      "duration": "Xh",
      "cost": "£X or Free",
      "rating": 4.5,
      "mustDo": true
    }
  ],
  "tripTips": ["tip1", "tip2", "tip3"]
}`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate trip');
    }

    const data = await response.json();
    const contentText = data.content[0].text;
    
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude');
    }
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('Trip Generation Error:', error);
    throw error;
  }
};

export const getLocationImage = async (location: string): Promise<string> => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API Key is missing!');
    return 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963';
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(location + ' travel landmark')}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    return data.results[0]?.urls?.regular || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963';
  } catch (error) {
    console.error('Unsplash Error:', error);
    return 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963';
  }
};

const mockTripGenerator = (preferences: TripPreferences): Promise<Trip> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        destination: "Bath, UK",
        subtitle: "Riverside Escape",
        duration: "6h duration",
        costRange: "£18 - £40 pp",
        rating: 4.7,
        activities: [
          {
            name: "Roman Baths",
            category: "Historic & Cultural",
            description: "UNESCO World Heritage site with intact Roman architecture",
            duration: "1h 30m",
            cost: "£12",
            rating: 4.8,
            mustDo: true
          },
          {
            name: "Riverside Walk",
            category: "Scenic & Relaxing",
            description: "Scenic route along the River Avon",
            duration: "45min",
            cost: "Free",
            rating: 4.5,
            mustDo: false
          },
          {
            name: "Sally Lunn's Cafe",
            category: "Local Food",
            description: "Popular cafe with local cuisine",
            duration: "1h",
            cost: "£15",
            rating: 4.6,
            mustDo: true
          }
        ],
        tripTips: [
          "Book online, arrive early",
          "Wear comfy shoes",
          "Try the local Bath bun"
        ]
      });
    }, 2000);
  });
};
