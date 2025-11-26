import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronDown } from 'lucide-react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { TripCard } from '../components/TripCard';
import { RootStackParamList, SavedTrip } from '../types';
import { useSavedTrips } from '../hooks/useSavedTrips';

type SavedTripsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SavedTrips'>;

const FILTERS = ['Recent', 'Distance', 'Rating', 'Budget'] as const;
type FilterType = typeof FILTERS[number];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'budget_low', label: 'Budget: Low to High' },
  { id: 'budget_high', label: 'Budget: High to Low' },
] as const;

type SortOption = typeof SORT_OPTIONS[number]['id'];

export const SavedTripsScreen = () => {
  const navigation = useNavigation<SavedTripsScreenNavigationProp>();
  const { savedTrips, removeTrip } = useSavedTrips();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Recent');
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Parse cost range to get average budget
  const parseBudget = (costRange: string): number => {
    const matches = costRange.match(/£(\d+)/g);
    if (matches && matches.length > 0) {
      const numbers = matches.map(m => parseInt(m.replace('£', '')));
      return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
    return 0;
  };

  // Sort and filter trips
  const filteredTrips = useMemo(() => {
    let trips = [...savedTrips];

    // Apply filter-based sorting
    switch (activeFilter) {
      case 'Recent':
        trips.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
        break;
      case 'Rating':
        trips.sort((a, b) => b.rating - a.rating);
        break;
      case 'Budget':
        trips.sort((a, b) => parseBudget(a.costRange) - parseBudget(b.costRange));
        break;
      case 'Distance':
        // For now, sort by duration as a proxy for distance
        trips.sort((a, b) => {
          const durationA = parseInt(a.duration) || 0;
          const durationB = parseInt(b.duration) || 0;
          return durationA - durationB;
        });
        break;
    }

    // Apply additional sort if different from filter
    if (sortOption === 'oldest') {
      trips.sort((a, b) => new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime());
    } else if (sortOption === 'budget_high') {
      trips.sort((a, b) => parseBudget(b.costRange) - parseBudget(a.costRange));
    }

    return trips;
  }, [savedTrips, activeFilter, sortOption]);

  const handleTripPress = (trip: SavedTrip) => {
    const mockPreferences = trip.preferences || {
      location: trip.destination,
      maxTravelTime: 2,
      budgetPerPerson: parseBudget(trip.costRange),
      budgetCategory: 'comfort' as const,
      groupSize: 'couple' as const,
      interests: trip.interests || []
    };
    navigation.navigate('TripResult', { trip, preferences: mockPreferences, isSavedView: true });
  };

  return (
    <ScreenLayout 
      activeTab="saved"
      headerTitle={`Saved trips (${savedTrips.length})`}
      headerRight={
        <TouchableOpacity 
          onPress={() => setShowSortModal(true)}
          className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-white text-sm mr-1">sort</Text>
          <ChevronDown size={16} color="white" />
        </TouchableOpacity>
      }
      scrollable
    >
      {/* Filter Pills */}
      <View className="flex-row mb-6 gap-2">
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full border ${
              activeFilter === filter 
                ? 'bg-secondary border-secondary' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Text className={`font-body text-xs ${
              activeFilter === filter ? 'text-white font-bold' : 'text-gray-600'
            }`}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View className="bg-white rounded-t-3xl p-4">
            <Text className="font-header text-lg text-secondary mb-4 text-center">Sort by</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  setSortOption(option.id);
                  setShowSortModal(false);
                }}
                className={`py-3 px-4 rounded-xl mb-2 ${
                  sortOption === option.id ? 'bg-orange-50' : ''
                }`}
              >
                <Text className={`font-body text-base ${
                  sortOption === option.id ? 'text-primary font-bold' : 'text-gray-700'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowSortModal(false)}
              className="py-3 mt-2"
            >
              <Text className="font-bodyBold text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Trip Cards */}
      {filteredTrips.length === 0 ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="font-header text-lg text-secondary mb-2">No saved trips yet</Text>
          <Text className="font-body text-gray-500 text-center">
            Generate a trip and tap "Save" to add it here
          </Text>
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
