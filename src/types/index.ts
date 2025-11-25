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
}

export interface Trip {
  destination: string;
  subtitle: string;
  duration: string; // e.g. "1 day" or "2 days"
  costRange: string; // e.g. "£50-£100 pp"
  rating: number;
  activities: Activity[];
  tripTips: string[];
  imageUrl?: string; // Added for Unsplash integration
}

export type TripStatus = 'explored' | 'bucket'; // 'budget' and 'all' are likely filters, not status, but following plan loosely

export interface SavedTrip extends Trip {
  id: string;
  savedDate: string; // ISO string for easier serialization
  status: TripStatus; 
  // We can derive 'budget' filter from costRange or budgetCategory if stored
}

export type RootStackParamList = {
  Welcome: undefined;
  Preferences: undefined;
  Loading: { preferences: TripPreferences };
  TripResult: { trip: Trip; preferences: TripPreferences }; // Pass preferences to regenerate if needed
  Adjustment: { preferences: TripPreferences; error?: string };
  SavedTrips: undefined;
};

