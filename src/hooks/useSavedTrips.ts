import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { SavedTrip, Trip } from '../types';

const STORAGE_KEY = 'quick_trip_saved_trips';

export const useSavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSavedTrips(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load saved trips", e);
    }
  };

  const saveTrip = async (trip: Trip) => {
    // Prevent duplicates
    if (isSaved(trip)) return;

    const newTrip: SavedTrip = {
      ...trip,
      id: Date.now().toString(),
      savedDate: new Date().toISOString(),
      status: 'bucket' // Default status
    };
    
    const updatedTrips = [newTrip, ...savedTrips];
    setSavedTrips(updatedTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error("Failed to save trip", e);
    }
  };

  const removeTrip = async (id: string) => {
    const updatedTrips = savedTrips.filter(t => t.id !== id);
    setSavedTrips(updatedTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error("Failed to remove trip", e);
    }
  };

  const isSaved = (trip: Trip) => {
    // Check based on destination and subtitle
    return savedTrips.some(t => t.destination === trip.destination && t.subtitle === trip.subtitle);
  };

  return { savedTrips, saveTrip, removeTrip, isSaved };
};

