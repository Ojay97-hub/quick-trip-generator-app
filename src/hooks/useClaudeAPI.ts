import { useState } from 'react';
import { generateTripItinerary } from '../utils/api';
import { TripPreferences, Trip } from '../types';

export const useClaudeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Trip | null>(null);

  const generateTrip = async (preferences: TripPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateTripItinerary(preferences);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, generateTrip };
};

