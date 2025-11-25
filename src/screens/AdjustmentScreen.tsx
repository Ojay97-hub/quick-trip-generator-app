import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';

type AdjustmentScreenRouteProp = RouteProp<RootStackParamList, 'Adjustment'>;
type AdjustmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Adjustment'>;

export const AdjustmentScreen = () => {
  const navigation = useNavigation<AdjustmentScreenNavigationProp>();
  const route = useRoute<AdjustmentScreenRouteProp>();
  const { preferences, error } = route.params;

  return (
    <ScreenLayout 
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showBackButton
      onBack={() => navigation.navigate('Preferences')}
    >
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-orange-50 p-6 rounded-full mb-6">
          <AlertTriangle size={48} color="#FFB703" />
        </View>
        
        <Text className="font-header text-xl text-secondary mb-2 text-center">
          Hmmm computer says no!
        </Text>
        
        <Text className="font-body text-gray-600 text-center mb-8">
          {error || "We couldn't find a trip matching your filters for this location."}
        </Text>
        
        <View className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <Text className="font-header text-base text-secondary mb-4">
            Try adjusting these:
          </Text>
          <View className="space-y-2">
             <View className="flex-row items-center">
               <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
               <Text className="font-body text-gray-600">Increase your travel time</Text>
             </View>
             <View className="flex-row items-center">
               <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
               <Text className="font-body text-gray-600">Adjust your budget</Text>
             </View>
             <View className="flex-row items-center">
               <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
               <Text className="font-body text-gray-600">Explore different interests</Text>
             </View>
             <View className="flex-row items-center">
               <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
               <Text className="font-body text-gray-600">Change your home location</Text>
             </View>
          </View>
        </View>

        <View className="flex-row gap-4 w-full">
          <Button 
             title="Go back" 
             variant="secondary"
             className="flex-1"
             onPress={() => navigation.navigate('Welcome')}
          />
          <Button 
             title="Adjust filters" 
             variant="outline"
             icon={<RotateCcw size={20} color="#FF6B35" />}
             className="flex-1"
             onPress={() => navigation.navigate('Preferences')}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
