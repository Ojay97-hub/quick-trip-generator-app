import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { RootStackParamList } from '../types';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import { Landmark, Utensils, TreePine, Mountain, Map } from 'lucide-react-native';

type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'Loading'>;
type LoadingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

const FUN_FACTS = [
  {
    location: "Bath",
    fact: "Bath was a major spa resort for the Roman Empire and remains one of the best-preserved Roman sites in Britain."
  },
  {
    location: "Edinburgh",
    fact: "Edinburgh Castle sits atop an extinct volcano and has been a royal residence since the 12th century."
  },
  {
    location: "York",
    fact: "York's city walls are the longest medieval town walls in England, stretching nearly 3 miles."
  },
  {
    location: "Oxford",
    fact: "The Bodleian Library in Oxford is one of the oldest libraries in Europe, with over 13 million printed items."
  },
  {
    location: "Cambridge",
    fact: "Cambridge University was founded in 1209, making it the fourth-oldest surviving university in the world."
  },
  {
    location: "Liverpool",
    fact: "Liverpool has more museums and galleries than any other UK city outside of London."
  },
  {
    location: "Bristol",
    fact: "The Clifton Suspension Bridge in Bristol took 33 years to complete and spans 214 meters across the Avon Gorge."
  },
  {
    location: "Manchester",
    fact: "Manchester was the world's first industrialised city and birthplace of the modern computer."
  },
  {
    location: "Glasgow",
    fact: "Glasgow has over 90 parks and gardens, more green space per capita than any other city in Europe."
  },
  {
    location: "Cardiff",
    fact: "Cardiff Castle has been a Roman fort, a Norman stronghold, and a Victorian Gothic fantasy."
  }
];

const LOADING_MESSAGES = [
  "Finding hidden gems....",
  "Discovering local favourites...",
  "Planning your perfect day...",
  "Checking the best routes...",
  "Generating your perfect trip"
];

export const LoadingScreen = () => {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const route = useRoute<LoadingScreenRouteProp>();
  const { preferences } = route.params;
  const { generateTrip } = useClaudeAPI();
  
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);
  const [currentFact, setCurrentFact] = useState(FUN_FACTS[0]);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Rotate animation for icons
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  // Cycle through loading messages
  useEffect(() => {
    let messageIndex = 0;
    const messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingText(LOADING_MESSAGES[messageIndex]);
    }, 2500);

    return () => clearInterval(messageTimer);
  }, []);

  // Cycle through icons
  useEffect(() => {
    const iconTimer = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(iconTimer);
  }, []);

  // Pick a random fun fact
  useEffect(() => {
    const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    setCurrentFact(randomFact);
  }, []);

  // Handle next tip
  const handleNextTip = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    const currentIndex = FUN_FACTS.findIndex(f => f.location === currentFact.location);
    const nextIndex = (currentIndex + 1) % FUN_FACTS.length;
    setTimeout(() => setCurrentFact(FUN_FACTS[nextIndex]), 150);
  };

  // Generate trip
  useEffect(() => {
    const generate = async () => {
      try {
        const trip = await generateTrip(preferences);
        navigation.replace('TripResult', { trip, preferences });
      } catch (err) {
        navigation.replace('Adjustment', { preferences, error: (err as Error).message });
      }
    };

    generate();
  }, []);

  const icons = [
    { Icon: Landmark, color: '#FF6B35' },
    { Icon: Utensils, color: '#042D4C' },
    { Icon: TreePine, color: '#00C896' },
    { Icon: Mountain, color: '#FFB703' },
  ];

  return (
    <ScreenLayout 
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showBottomNav={true}
    >
      <View className="flex-1 justify-start items-center px-4 pt-20">
        {/* Loading Text */}
        <Text className="font-body text-base text-gray-600 mb-2">
          {loadingText.replace('gems', '')}
          <Text className="font-bodyBold">gems</Text>
          ....
        </Text>
        <Text className="font-body text-sm text-gray-500 mb-8">
          Generating your perfect trip
        </Text>

        {/* Animated Icons Row */}
        <View className="flex-row justify-center items-center gap-4 mb-12">
          {icons.map(({ Icon, color }, index) => (
            <View 
              key={index}
              className={`w-12 h-12 rounded-xl items-center justify-center ${
                activeIconIndex === index ? 'bg-orange-100' : 'bg-gray-100'
              }`}
            >
              <Icon 
                size={24} 
                color={activeIconIndex === index ? color : '#D1D5DB'} 
              />
            </View>
          ))}
        </View>

        {/* Did You Know Card */}
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="bg-warning/10 p-5 rounded-2xl w-full border border-warning/20"
        >
          <View className="flex-row items-center mb-2">
            <Text className="font-header text-base text-secondary">Did you know?</Text>
          </View>
          <Text className="font-body text-gray-700 text-sm leading-6">
            {currentFact.fact}
          </Text>
          <View className="items-center mt-3">
            <Text 
              onPress={handleNextTip}
              className="text-highlight text-sm font-bodyBold underline"
            >
              next tip
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
};
