import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Slider from '@react-native-community/slider';
import { RefreshCw } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { RootStackParamList, TripPreferences, BudgetCategory, GroupSize } from '../types';

type PreferencesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preferences'>;

const TRAVEL_TIMES = [1, 2, 3, 4, 5, 6, 7, 8];
const BUDGET_CATEGORIES: { id: BudgetCategory; label: string }[] = [
  { id: 'budget', label: '£ Budget' },
  { id: 'comfort', label: '££ Comfort' },
  { id: 'treat', label: '£££ Treat' }
];
const GROUP_SIZES: GroupSize[] = ['solo', 'couple', 'group'];
const INTERESTS = ['Outdoors', 'Food', 'Culture', 'Nightlife', 'History', 'Shopping', 'Wellness', 'Family', 'Music', 'Wildlife', 'Gaming', 'Sport'];

export const PreferencesScreen = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  
  const [location, setLocation] = useState('London');
  const [maxTravelTime, setMaxTravelTime] = useState(2);
  const [budgetPerPerson, setBudgetPerPerson] = useState(100);
  const [budgetCategory, setBudgetCategory] = useState<BudgetCategory>('comfort');
  const [groupSize, setGroupSize] = useState<GroupSize>('couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleReset = () => {
    setLocation('London');
    setMaxTravelTime(2);
    setBudgetPerPerson(100);
    setBudgetCategory('comfort');
    setGroupSize('couple');
    setSelectedInterests([]);
  };

  const handleGenerate = () => {
    const preferences: TripPreferences = {
      location,
      maxTravelTime,
      budgetPerPerson,
      budgetCategory,
      groupSize,
      interests: selectedInterests
    };
    navigation.navigate('Loading', { preferences });
  };

  return (
    <ScreenLayout
      activeTab="home"
      headerTitle="Set your preferences"
      showBackButton
      headerRight={
        <TouchableOpacity onPress={handleReset}>
          <RefreshCw size={20} color="white" />
        </TouchableOpacity>
      }
      scrollable
    >
      <View className="space-y-6">
        {/* Location */}
        <View>
          <Text className="font-bodyBold text-secondary mb-2">Location</Text>
          <View className="bg-white rounded-xl border border-gray-200 p-3">
            <TextInput
              className="font-body text-base text-secondary"
              value={location}
              onChangeText={setLocation}
              placeholder="Where are you starting from?"
            />
          </View>
        </View>

        {/* Max Travel Time */}
        <View>
          <Text className="font-bodyBold text-secondary mb-2">Max travel time</Text>
          <Text className="font-body text-xs text-gray-500 mb-2">How long are you willing to travel to your destination?</Text>
          <View className="flex-row flex-wrap gap-2">
            {TRAVEL_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setMaxTravelTime(time)}
                className={`w-12 h-10 justify-center items-center rounded-lg border ${
                  maxTravelTime === time ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-bodyBold ${maxTravelTime === time ? 'text-white' : 'text-gray-600'}`}>
                  {time}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View>
          <View className="flex-row justify-between items-center mb-2">
             <Text className="font-bodyBold text-secondary">Budget per person</Text>
             <Text className="font-bodyBold text-primary">£{budgetPerPerson}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={50}
            maximumValue={500}
            step={10}
            value={budgetPerPerson}
            onValueChange={setBudgetPerPerson}
            minimumTrackTintColor="#FF6B35"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#FF6B35"
          />
          <View className="flex-row justify-between mt-2 gap-2">
            {BUDGET_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setBudgetCategory(cat.id)}
                className={`flex-1 py-2 rounded-lg border items-center justify-center ${
                  budgetCategory === cat.id ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body text-xs ${budgetCategory === cat.id ? 'text-white font-bold' : 'text-gray-600'}`}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Size */}
        <View>
          <Text className="font-bodyBold text-secondary mb-2">How many people?</Text>
          <View className="flex-row gap-2">
            {GROUP_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setGroupSize(size)}
                className={`flex-1 py-3 rounded-full border items-center justify-center ${
                  groupSize === size ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body ${groupSize === size ? 'text-white font-bold' : 'text-gray-600'}`}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View>
          <Text className="font-bodyBold text-secondary mb-2">Interests</Text>
          <View className="flex-row flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                onPress={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full border ${
                  selectedInterests.includes(interest) 
                    ? 'bg-orange-100 border-primary' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body text-sm ${
                  selectedInterests.includes(interest) ? 'text-primary font-bold' : 'text-gray-600'
                }`}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="pt-4 pb-8">
          <Button 
            title="Generate trip" 
            onPress={handleGenerate}
            disabled={!location || selectedInterests.length === 0}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
