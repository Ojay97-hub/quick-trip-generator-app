import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { SavedTrip, Trip, TripPreferences } from '../types';

const STORAGE_KEY = 'quick_trip_saved_trips';

export const useSavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSavedTrips(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load saved trips", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrip = useCallback(async (trip: Trip, preferences?: TripPreferences) => {
    // Prevent duplicates
    if (isSaved(trip)) return;

    const newTrip: SavedTrip = {
      ...trip,
      id: Date.now().toString(),
      savedDate: new Date().toISOString(),
      status: 'bucket',
      preferences: preferences
    };
    
    const updatedTrips = [newTrip, ...savedTrips];
    setSavedTrips(updatedTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error("Failed to save trip", e);
    }
  }, [savedTrips]);

  const removeTrip = useCallback(async (id: string) => {
    const updatedTrips = savedTrips.filter(t => t.id !== id);
    setSavedTrips(updatedTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error("Failed to remove trip", e);
    }
  }, [savedTrips]);

  const updateTripStatus = useCallback(async (id: string, status: 'explored' | 'bucket') => {
    const updatedTrips = savedTrips.map(t => 
      t.id === id ? { ...t, status } : t
    );
    setSavedTrips(updatedTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error("Failed to update trip status", e);
    }
  }, [savedTrips]);

  const isSaved = useCallback((trip: Trip) => {
    return savedTrips.some(t => 
      t.destination === trip.destination && t.subtitle === trip.subtitle
    );
  }, [savedTrips]);

  const getTripById = useCallback((id: string) => {
    return savedTrips.find(t => t.id === id);
  }, [savedTrips]);

  return { 
    savedTrips, 
    saveTrip, 
    removeTrip, 
    updateTripStatus,
    isSaved, 
    getTripById,
    isLoading,
    refreshTrips: loadTrips
  };
};
