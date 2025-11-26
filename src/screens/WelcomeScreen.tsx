import React from 'react';
import { View, Text, Image } from 'react-native';
import { Compass } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { RootStackParamList, TripPreferences, BudgetCategory, GroupSize } from '../types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

// UK cities for random selection
const UK_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
  'Liverpool', 'Bristol', 'Sheffield', 'Edinburgh', 'Cardiff',
  'Newcastle', 'Nottingham', 'Brighton', 'York', 'Bath',
  'Oxford', 'Cambridge', 'Canterbury', 'Exeter', 'Norwich'
];

// Interests for random selection
const ALL_INTERESTS = [
  'Outdoors', 'Food', 'Culture', 'Nightlife', 'History', 
  'Shopping', 'Wellness', 'Family', 'Music', 'Wildlife', 'Sport'
];

// Helper to get random items from array
const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper to get random number in range
const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleSurpriseMe = () => {
    // Generate random preferences
    const randomLocation = UK_CITIES[Math.floor(Math.random() * UK_CITIES.length)];
    const randomTravelTime = getRandomInRange(1, 4);
    const randomInterests = getRandomItems(ALL_INTERESTS, getRandomInRange(2, 4));
    
    // Random budget category and corresponding budget
    const budgetCategories: BudgetCategory[] = ['budget', 'comfort', 'treat'];
    const randomBudgetCategory = budgetCategories[Math.floor(Math.random() * budgetCategories.length)];
    
    let randomBudget: number;
    switch (randomBudgetCategory) {
      case 'budget':
        randomBudget = getRandomInRange(30, 100);
        break;
      case 'comfort':
        randomBudget = getRandomInRange(150, 400);
        break;
      case 'treat':
        randomBudget = getRandomInRange(600, 1500);
        break;
      default:
        randomBudget = 200;
    }

    // Random group size
    const groupSizes: GroupSize[] = ['solo', 'couple', 'group'];
    const randomGroupSize = groupSizes[Math.floor(Math.random() * groupSizes.length)];

    const randomPreferences: TripPreferences = {
      location: randomLocation,
      maxTravelTime: randomTravelTime,
      budgetPerPerson: randomBudget,
      budgetCategory: randomBudgetCategory,
      groupSize: randomGroupSize,
      interests: randomInterests
    };

    // Navigate directly to loading screen with random preferences
    navigation.navigate('Loading', { preferences: randomPreferences });
  };

  return (
    <ScreenLayout 
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showLogo={true}
      scrollable
    >
      <View className="space-y-6 mt-4">
        <View>
          <Text className="text-3xl font-header text-secondary">Welcome!</Text>
          <Text className="text-base font-body text-gray-600 mt-2">
            Discover amazing day trips in...
          </Text>
          <Text className="text-base font-bodyBold text-primary">
            2 minutes!
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-100">
          <Text className="font-header text-base mb-4 text-secondary">How it works:</Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-full bg-primary items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Set your preferences</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-full bg-primary items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Tap to generate</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-full bg-primary items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Save your favourites</Text>
            </View>
          </View>

          <View className="mt-5">
             <Button 
               title="Start my first trip →" 
               onPress={() => navigation.navigate('Preferences')}
             />
          </View>
        </View>

        {/* Logo/Icon Area */}
        <View className="items-center justify-center py-8">
          <Logo size={160} color="#FF6B35" innerColor="#042D4C" />
        </View>

        {/* Surprise Me Button */}
        <View className="pb-4">
          <Button 
            title="Surprise me!" 
            variant="secondary" 
            className="w-full"
            onPress={handleSurpriseMe}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
