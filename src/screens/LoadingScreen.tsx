import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { RootStackParamList, Trip } from '../types';
import { Button } from '../components/Button';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import {
  Car,
  TrainFront,
  Plane,
  Ship
} from 'lucide-react-native';

type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'Loading'>;
type LoadingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

const FALLBACK_FACTS = [
  "Bath was a major spa resort for the Roman Empire and remains one of the best-preserved Roman sites in Britain.",
  "Edinburgh Castle sits atop an extinct volcano and has been a royal residence since the 12th century.",
  "York's city walls are the longest medieval town walls in England, stretching nearly 3 miles.",
  "The Bodleian Library in Oxford is one of the oldest libraries in Europe, with over 13 million printed items.",
  "Cambridge University was founded in 1209, making it the fourth-oldest surviving university in the world.",
  "Liverpool has more museums and galleries than any other UK city outside of London.",
  "The Clifton Suspension Bridge in Bristol took 33 years to complete and spans 214 meters across the Avon Gorge.",
  "Manchester was the world's first industrialised city and birthplace of the modern computer.",
  "Glasgow has over 90 parks and gardens, more green space per capita than any other city in Europe.",
  "Cardiff Castle has been a Roman fort, a Norman stronghold, and a Victorian Gothic fantasy."
];

export const LoadingScreen = () => {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const route = useRoute<LoadingScreenRouteProp>();
  const { preferences } = route.params;
  const { generateTrip } = useClaudeAPI();
  
  const [currentFact, setCurrentFact] = useState(FALLBACK_FACTS[0]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripLoading, setTripLoading] = useState(true);
  const [tripError, setTripError] = useState<string | null>(null);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  
  // Animation value for smooth transitions between facts
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Icon animations
  const bounceAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Bouncing animation for icons (synchronized wave)
  useEffect(() => {
    const createBounce = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10, // Bounce height
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
            delay, // Staggered start
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.delay(600) // Sync pause before next wave
        ])
      );
    };

    // Stagger animations by 150ms each to create a "wave" effect
    const bounceAnimations = bounceAnims.map((anim, index) =>
      createBounce(anim, index * 150)
    );

    bounceAnimations.forEach((anim) => anim.start());

    // Cycle active icon state (optional visual highlight)
    const iconTimer = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 4);
    }, 800);

    return () => {
      bounceAnimations.forEach((anim) => anim.stop());
      clearInterval(iconTimer);
    };
  }, []);

  // Load initial fact
  useEffect(() => {
    const randomFact = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
    setCurrentFact(randomFact);
  }, []);

  // Cycle facts handler
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
    
    setTimeout(() => {
      const randomFact = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
      setCurrentFact(randomFact);
    }, 150);
  };

  // Generate trip logic
  useEffect(() => {
    let isMounted = true;

    const generate = async () => {
      try {
        const generatedTrip = await generateTrip(preferences);
        if (!isMounted) return;
        setTrip(generatedTrip);
        setTripLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setTripLoading(false);
        setTripError((err as Error).message);
      }
    };

    generate();

    return () => {
      isMounted = false;
    };
  }, []);

  const canViewTrip = !!trip && !tripLoading && !tripError;

  const handleViewTrip = () => {
    if (trip) {
      navigation.replace('TripResult', { trip, preferences });
    }
  };

  const icons = [
    { Icon: Car },
    { Icon: TrainFront },
    { Icon: Plane },
    { Icon: Ship },
  ];

  return (
    <ScreenLayout 
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showBottomNav={true}
      scrollable={true}
    >
      <View className="flex-1 justify-start items-center px-4 py-8">
        {/* Header Text */}
        <Text className="font-body text-2xl text-[#042D4C] mb-2 text-center">
          Finding hidden <Text className="font-bodyBold text-2xl text-[#042D4C]">gems</Text>....
        </Text>
        <Text className="font-body text-sm text-gray-500 mb-12">
          Generating your perfect trip
        </Text>

        {/* Icons Row */}
        <View className="flex-row justify-center items-center gap-8 mb-12 h-20">
          {icons.map(({ Icon }, index) => {
             const isActive = activeIconIndex === index;
             return (
              <Animated.View 
                key={index}
                style={{
                  transform: [
                    { translateY: bounceAnims[index] }, // Bouncing movement
                    { rotate: isActive ? '12deg' : '0deg' },
                    { scale: isActive ? 1.1 : 1 }
                  ],
                }}
              >
                <View 
                  className={`w-14 h-14 items-center justify-center rounded-xl ${
                    isActive ? 'bg-[#FF6B35] shadow-sm' : 'bg-transparent'
                  }`}
                >
                  <Icon 
                    size={28} 
                    color={isActive ? 'white' : '#042D4C'} 
                    strokeWidth={isActive ? 2 : 1.5} 
                  />
                </View>
              </Animated.View>
             );
          })}
        </View>

        {/* Fact Card */}
        <Animated.View style={{ width: '100%', opacity: fadeAnim }}>
          <View className="w-full bg-white rounded-[32px] border-2 border-[#042D4C] px-6 py-8 items-center shadow-sm">
            <Text className="font-bodyBold text-xl text-[#042D4C] mb-4 text-center">
              Did you know?
            </Text>

            <Text className="font-body text-[#042D4C] text-base leading-7 text-center mb-6 px-2 w-full flex-shrink">
              {currentFact}
            </Text>

            <TouchableOpacity 
              onPress={handleNextTip} 
              activeOpacity={0.7}
              className="mt-2"
            >
              <Text className="text-[#00D4FF] text-base font-bodyBold underline">
                next tip
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* View Trip Button */}
        <View className="w-full max-w-[280px] mt-12 mb-8">
          <Button 
            title={canViewTrip ? "View trip" : "Generating trip..."}
            variant="primary"
            onPress={handleViewTrip}
            disabled={!canViewTrip}
          />
        </View>
        
        {tripError && (
          <Text className="font-body text-xs text-red-500 text-center mt-2">
            Problem generating trip. Please try again.
          </Text>
        )}
      </View>
    </ScreenLayout>
  );
};
