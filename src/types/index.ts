export type BudgetCategory = 'budget' | 'comfort' | 'treat';
export type GroupSize = 'solo' | 'couple' | 'group';

export interface TripPreferences {
  location: string;
  maxTravelTime: number; // hours
  budgetPerPerson: number;
  budgetCategory: BudgetCategory;
  groupSize: GroupSize;
  interests: string[];
}

export interface Activity {
  name: string;
  category: string;
  description: string;
  duration: string; // e.g. "2h"
  cost: string; // e.g. "£15" or "Free"
  rating: number;
  mustDo: boolean;
  bookingUrl?: string; // Dynamic booking URL
  bookingPlatform?: string; // e.g. "TripAdvisor", "Resy", "GetYourGuide"
  startTime?: string; // e.g. "09:00"
}

export interface TravelOption {
  type: 'train' | 'car' | 'bus';
  duration: string; // e.g. "1h 30m"
  cost: string; // e.g. "£40" or "£25 - £30 (fuel)"
  fromLocation: string;
  tags: string[]; // e.g. ["Fast", "Scenic", "Direct"]
}

export interface Accommodation {
  name: string;
  type: string; // e.g. "Luxury Hotel", "Budget Hostel", "Apartment"
  rating: number;
  distance: string; // e.g. "0.3 miles from centre"
  priceRange: string; // e.g. "£180 - £320/night"
  amenities: string[]; // e.g. ["Spa", "Pool", "Restaurant"]
  bookingUrl?: string; // Booking.com URL
  imageUrl?: string; // Hotel image URL
}

export interface Trip {
  destination: string;
  subtitle: string;
  duration: string; // e.g. "6h duration"
  costRange: string; // e.g. "£18 - £40 pp"
  rating: number;
  activities: Activity[];
  tripTips: string[];
  imageUrl?: string; // Unsplash image
  travelOptions?: TravelOption[];
  accommodation?: Accommodation[];
  mapsUrl?: string; // Google Maps link
  interests?: string[]; // Tags for the trip
}

export type TripStatus = 'explored' | 'bucket';

export interface SavedTrip extends Trip {
  id: string;
  savedDate: string; // ISO string
  status: TripStatus;
  preferences?: TripPreferences; // Store original preferences
}

export type RootStackParamList = {
  Welcome: undefined;
  Preferences: undefined;
  Loading: { preferences: TripPreferences };
  TripResult: { trip: Trip; preferences: TripPreferences; isSavedView?: boolean };
  Adjustment: { preferences: TripPreferences; error?: string };
  SavedTrips: undefined;
};
