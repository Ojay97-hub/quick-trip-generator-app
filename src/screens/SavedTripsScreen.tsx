import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { TripCard } from '../components/TripCard';
import { RootStackParamList, SavedTrip } from '../types';
import { useSavedTrips } from '../hooks/useSavedTrips';

type SavedTripsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SavedTrips'>;

const FILTERS = ['All', 'Explored', 'Bucket', 'Budget'];

export const SavedTripsScreen = () => {
  const navigation = useNavigation<SavedTripsScreenNavigationProp>();
  const { savedTrips, removeTrip } = useSavedTrips();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTrips = savedTrips.filter(trip => {
    if (activeFilter === 'All') return true;
    // Simple mock filtering logic for now
    if (activeFilter === 'Budget') return trip.costRange.toLowerCase().includes('free') || trip.costRange.includes('£0');
    if (activeFilter === 'Explored') return trip.status === 'explored';
    if (activeFilter === 'Bucket') return trip.status === 'bucket';
    return true;
  });

  const handleTripPress = (trip: SavedTrip) => {
    // Navigate to TripResult. We need mock preferences since they aren't stored in SavedTrip interface currently.
    // Ideally we should store preferences in SavedTrip.
    // For now, we pass empty/default preferences just to satisfy the route param type.
    const mockPreferences: any = {
       location: trip.destination,
       maxTravelTime: 0,
       budgetPerPerson: 0,
       budgetCategory: 'comfort',
       groupSize: 'couple',
       interests: []
    };
    navigation.navigate('TripResult', { trip, preferences: mockPreferences });
  };

  return (
    <ScreenLayout 
      activeTab="saved"
      headerTitle={`Saved trips (${savedTrips.length})`}
      scrollable
    >
      <View className="flex-row mb-6 gap-2">
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full border ${
              activeFilter === filter ? 'bg-secondary border-secondary' : 'bg-white border-gray-200'
            }`}
          >
            <Text className={`font-body text-xs ${activeFilter === filter ? 'text-white font-bold' : 'text-gray-600'}`}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTrips.length === 0 ? (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="font-body text-gray-500">No trips found.</Text>
        </View>
      ) : (
        <View>
          {filteredTrips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onPress={() => handleTripPress(trip)}
              onRemove={() => removeTrip(trip.id)}
            />
          ))}
        </View>
      )}
    </ScreenLayout>
  );
};
