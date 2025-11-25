import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { RootStackParamList } from '../types';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import { Compass, Map } from 'lucide-react-native';

type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'Loading'>;
type LoadingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

export const LoadingScreen = () => {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const route = useRoute<LoadingScreenRouteProp>();
  const { preferences } = route.params;
  const { generateTrip, error } = useClaudeAPI();
  const [loadingText, setLoadingText] = useState("Finding hidden gems...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingText("Generating your perfect trip...");
    }, 2000);

    const generate = async () => {
      try {
        const trip = await generateTrip(preferences);
        navigation.replace('TripResult', { trip, preferences });
      } catch (err) {
        navigation.replace('Adjustment', { preferences, error: (err as Error).message });
      }
    };

    generate();

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout 
      activeTab="home"
      showHeader={false}
      showBottomNav={true}
    >
      <View className="flex-1 justify-center items-center">
        <View className="mb-8 relative">
           <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center animate-spin">
             {/* Placeholder for animation */}
           </View>
           <ActivityIndicator size="large" color="#FF6B35" style={{ transform: [{ scale: 2 }] }} />
        </View>

        <Text className="font-header text-xl text-secondary mb-2 text-center">{loadingText}</Text>
        
        <View className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-xs">
          <View className="flex-row items-center mb-2">
            <Map size={20} color="#FF6B35" className="mr-2" />
            <Text className="font-header text-sm text-secondary ml-2">Did you know?</Text>
          </View>
          <Text className="font-body text-gray-600 text-sm leading-5">
            Bath was a major spa resort for the Roman Empire and remains one of the best-preserved Roman sites in Britain.
          </Text>
          <Text className="text-right text-primary text-xs font-bold mt-2">next tip</Text>
        </View>
      </View>
    </ScreenLayout>
  );
};
