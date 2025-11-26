import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { RefreshCw, ChevronDown, Plus, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { RootStackParamList, TripPreferences, BudgetCategory, GroupSize } from '../types';

type PreferencesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preferences'>;

const UK_CITIES = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Glasgow',
  'Liverpool',
  'Bristol',
  'Sheffield',
  'Edinburgh',
  'Cardiff',
  'Newcastle',
  'Nottingham',
  'Southampton',
  'Brighton',
  'Leicester',
  'Portsmouth',
  'Plymouth',
  'Reading',
  'Coventry',
  'Belfast',
  'Aberdeen',
  'Dundee',
  'Oxford',
  'Cambridge',
  'York',
  'Bath',
  'Canterbury',
  'Exeter',
  'Norwich',
  'Swansea'
];

const TRAVEL_TIMES = [1, 2, 3, 4, 5, 6, 7, 8];

const BUDGET_CATEGORIES: { id: BudgetCategory; label: string; maxBudget: number }[] = [
  { id: 'budget', label: '£ Budget', maxBudget: 100 },
  { id: 'comfort', label: '££ Comfort', maxBudget: 500 },
  { id: 'treat', label: '£££ Treat', maxBudget: 2000 }
];

const GROUP_SIZES: GroupSize[] = ['solo', 'couple', 'group'];

const INTERESTS = [
  'Outdoors', 'Food', 'Culture', 
  'Nightlife', 'History', 'Shopping', 
  'Wellness', 'Family', 'Music', 
  'Wildlife', 'Gaming', 'Sport'
];

const ADDITIONAL_INTERESTS = [
  'Photography', 'Yoga', 'Hiking', 'Beaches',
  'Mountains', 'Art', 'Theater', 'Wine Tasting',
  'Adventure Sports', 'Relaxation', 'Meditation', 'Local Markets',
  'Museums', 'Street Art', 'Cooking Classes', 'Cycling'
];

export const PreferencesScreen = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  
  const [location, setLocation] = useState('London');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [maxTravelTime, setMaxTravelTime] = useState(2);
  const [budgetPerPerson, setBudgetPerPerson] = useState(250);
  const [budgetCategory, setBudgetCategory] = useState<BudgetCategory>('comfort');
  const [groupSize, setGroupSize] = useState<GroupSize>('couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [allInterests, setAllInterests] = useState(INTERESTS);

  // Get current budget category config
  const getCurrentBudgetConfig = () => {
    return BUDGET_CATEGORIES.find(cat => cat.id === budgetCategory) || BUDGET_CATEGORIES[1];
  };

  // Update budget when category changes
  useEffect(() => {
    const config = getCurrentBudgetConfig();
    // Set budget to middle of range when category changes
    if (budgetCategory === 'budget') {
      setBudgetPerPerson(Math.min(budgetPerPerson, config.maxBudget));
    } else if (budgetCategory === 'comfort') {
      setBudgetPerPerson(Math.min(Math.max(budgetPerPerson, 100), config.maxBudget));
    } else {
      setBudgetPerPerson(Math.min(Math.max(budgetPerPerson, 500), config.maxBudget));
    }
  }, [budgetCategory]);

  const getSliderRange = () => {
    switch (budgetCategory) {
      case 'budget':
        return { min: 0, max: 100 };
      case 'comfort':
        return { min: 100, max: 500 };
      case 'treat':
        return { min: 500, max: 2000 };
      default:
        return { min: 0, max: 500 };
    }
  };

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
    setBudgetPerPerson(250);
    setBudgetCategory('comfort');
    setGroupSize('couple');
    setSelectedInterests([]);
    setAllInterests(INTERESTS);
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

  const sliderRange = getSliderRange();

  return (
    <ScreenLayout
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showBackButton
      headerRight={
        <TouchableOpacity onPress={handleReset}>
          <RefreshCw size={20} color="white" />
        </TouchableOpacity>
      }
      scrollable
    >
      <View className="space-y-6">
        {/* Section Title */}
        <Text className="font-header text-xl text-secondary">Set your preferences</Text>

        {/* Location Dropdown */}
        <View>
          <Text className="font-bodyBold text-secondary mb-2">Location</Text>
          <TouchableOpacity 
            onPress={() => setShowLocationPicker(true)}
            className="bg-white rounded-xl border border-gray-200 p-4 flex-row justify-between items-center"
          >
            <Text className="font-body text-base text-secondary">{location}</Text>
            <ChevronDown size={20} color="#8E9AAF" />
          </TouchableOpacity>
        </View>

        {/* Location Picker Modal */}
        <Modal
          visible={showLocationPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLocationPicker(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl max-h-[70%]">
              <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-header text-lg text-secondary">Select Location</Text>
                <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                  <Text className="font-bodyBold text-primary">Done</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={UK_CITIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setLocation(item);
                      setShowLocationPicker(false);
                    }}
                    className={`p-4 border-b border-gray-50 ${location === item ? 'bg-orange-50' : ''}`}
                  >
                    <Text className={`font-body text-base ${location === item ? 'text-primary font-bold' : 'text-secondary'}`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Max Travel Time */}
        <View>
          <Text className="font-bodyBold text-secondary mb-1">Max travel time</Text>
          <Text className="font-body text-xs text-gray-500 mb-3">
            How long are you willing to travel to your destination?
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {TRAVEL_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setMaxTravelTime(time)}
                className={`w-11 h-10 justify-center items-center rounded-lg border ${
                  maxTravelTime === time ? 'bg-white border-secondary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body text-sm ${maxTravelTime === time ? 'text-secondary font-bold' : 'text-gray-600'}`}>
                  {time}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View>
          <Text className="font-bodyBold text-secondary mb-1">Budget per person</Text>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-body text-xs text-gray-500">0</Text>
            <View className="flex-row items-center">
              <View className="bg-gray-100 px-2 py-1 rounded mr-2">
                <Text className="font-bodyBold text-secondary">£{budgetPerPerson}</Text>
              </View>
            </View>
            <Text className="font-body text-xs text-gray-500">£{getCurrentBudgetConfig().maxBudget}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={sliderRange.min}
            maximumValue={sliderRange.max}
            step={budgetCategory === 'treat' ? 50 : 10}
            value={budgetPerPerson}
            onValueChange={(value) => setBudgetPerPerson(Math.round(value))}
            minimumTrackTintColor="#FF6B35"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#FF6B35"
          />
          <View className="flex-row justify-between mt-2 gap-2">
            {BUDGET_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setBudgetCategory(cat.id);
                  // Set default budget for category
                  if (cat.id === 'budget') setBudgetPerPerson(50);
                  else if (cat.id === 'comfort') setBudgetPerPerson(250);
                  else setBudgetPerPerson(1000);
                }}
                className={`flex-1 py-2.5 rounded-lg border items-center justify-center ${
                  budgetCategory === cat.id ? 'bg-white border-secondary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body text-xs ${budgetCategory === cat.id ? 'text-secondary font-bold' : 'text-gray-600'}`}>
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
                className={`flex-1 py-3 rounded-lg border items-center justify-center ${
                  groupSize === size ? 'bg-white border-secondary' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body ${groupSize === size ? 'text-secondary font-bold' : 'text-gray-600'}`}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bodyBold text-secondary">Interests</Text>
            <TouchableOpacity 
              onPress={() => setShowAddInterest(true)}
              className="w-6 h-6 border border-gray-300 rounded items-center justify-center bg-white"
            >
              <Plus size={14} color="#8E9AAF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {allInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                onPress={() => toggleInterest(interest)}
                className={`px-4 py-2.5 rounded-lg border flex-row items-center ${
                  selectedInterests.includes(interest) 
                    ? 'bg-white border-secondary' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-body text-sm ${
                  selectedInterests.includes(interest) ? 'text-secondary font-bold' : 'text-gray-600'
                }`}>
                  {interest}
                </Text>
                {!INTERESTS.includes(interest) && selectedInterests.includes(interest) && (
                  <TouchableOpacity 
                    onPress={() => {
                      toggleInterest(interest);
                      setAllInterests(allInterests.filter(i => i !== interest));
                    }}
                    className="ml-2"
                  >
                    <X size={12} color={selectedInterests.includes(interest) ? '#042D4C' : '#8E9AAF'} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Interest Modal */}
        <Modal
          visible={showAddInterest}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddInterest(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl max-h-[80%]">
              <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-header text-lg text-secondary">Add more interests</Text>
                <TouchableOpacity onPress={() => setShowAddInterest(false)}>
                  <X size={24} color="#042D4C" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={ADDITIONAL_INTERESTS.filter(interest => !allInterests.includes(interest))}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setAllInterests([...allInterests, item]);
                      setSelectedInterests([...selectedInterests, item]);
                    }}
                    className="p-4 border-b border-gray-50 flex-row items-center justify-between"
                  >
                    <Text className="font-body text-base text-secondary">{item}</Text>
                    <View className="w-5 h-5 border-2 border-secondary rounded items-center justify-center">
                      <Plus size={14} color="#042D4C" />
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled
                nestedScrollEnabled
              />
            </View>
          </View>
        </Modal>

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
