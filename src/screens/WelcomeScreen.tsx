import React from 'react';
import { View, Text } from 'react-native';
import { Compass, MapPin, Clock, Save } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <ScreenLayout 
      activeTab="home"
      headerTitle="Quick Trip Planner"
      headerRight={<Compass size={24} color="white" />}
      scrollable
    >
      <View className="space-y-6 mt-4">
        <View>
          <Text className="text-3xl font-header text-secondary">Welcome!</Text>
          <Text className="text-lg font-body text-gray-600 mt-2">
            Discover amazing day trips in...
          </Text>
          <Text className="text-lg font-bodyBold text-primary">
            2 minutes!
          </Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Text className="font-header text-lg mb-4 text-secondary">How it works:</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Text className="text-primary font-bold">1</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Set your preferences</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Text className="text-primary font-bold">2</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Tap to generate</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Text className="text-primary font-bold">3</Text>
              </View>
              <Text className="font-body text-gray-700 flex-1">Save your favourites</Text>
            </View>
          </View>

          <View className="mt-6">
             <Button 
               title="Start my first trip →" 
               onPress={() => navigation.navigate('Preferences')}
             />
          </View>
        </View>

        <View className="items-center justify-center py-8">
          <View className="bg-orange-50 w-40 h-40 rounded-full items-center justify-center border-4 border-white shadow-md">
             <Compass size={80} color="#FF6B35" />
          </View>
          <Button 
            title="Surprise me!" 
            variant="secondary" 
            className="mt-8 w-full"
            onPress={() => navigation.navigate('Preferences')} // Could be a direct generation in future
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
