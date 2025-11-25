import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, RotateCcw, Star, Clock, Wallet } from 'lucide-react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { ActivityCard } from '../components/ActivityCard';
import { RootStackParamList } from '../types';
import { getLocationImage } from '../utils/api';
import { useSavedTrips } from '../hooks/useSavedTrips';

type TripResultScreenRouteProp = RouteProp<RootStackParamList, 'TripResult'>;
type TripResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TripResult'>;

export const TripResultScreen = () => {
  const navigation = useNavigation<TripResultScreenNavigationProp>();
  const route = useRoute<TripResultScreenRouteProp>();
  const { trip, preferences } = route.params;
  const { saveTrip, isSaved } = useSavedTrips();
  
  const [imageUrl, setImageUrl] = useState<string>(trip.imageUrl || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (!trip.imageUrl) {
        const url = await getLocationImage(trip.destination);
        setImageUrl(url);
      }
    };
    fetchImage();
    setSaved(isSaved(trip));
  }, [trip]);

  const handleSave = async () => {
    await saveTrip({ ...trip, imageUrl }); // Save with image URL
    setSaved(true);
  };

  const handleRegenerate = () => {
    navigation.replace('Loading', { preferences });
  };

  return (
    <ScreenLayout
      activeTab="home"
      showHeader={false}
      showBottomNav={true}
      scrollable
      contentContainerStyle="p-0" // Remove default padding for full width image
    >
      {/* Header Image Area */}
      <ImageBackground 
        source={{ uri: imageUrl }} 
        className="h-64 w-full justify-end"
        resizeMode="cover"
      >
        <View className="bg-black/40 p-4 flex-row justify-between items-end">
          <View className="flex-1">
             <Text className="text-white font-header text-2xl font-bold">{trip.destination}</Text>
             <Text className="text-white font-body text-sm">{trip.subtitle}</Text>
             <View className="flex-row items-center mt-1">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star 
                   key={star} 
                   size={14} 
                   color={star <= Math.round(trip.rating) ? "#FFB703" : "#D1D5DB"} 
                   fill={star <= Math.round(trip.rating) ? "#FFB703" : "transparent"}
                 />
               ))}
               <Text className="text-white text-xs ml-1">{trip.rating}</Text>
             </View>
          </View>
          <TouchableOpacity>
             <Text className="text-highlight underline text-xs font-bold">View on maps</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View className="p-4 -mt-4 bg-light rounded-t-3xl">
        {/* Stats Row */}
        <View className="flex-row justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <View className="items-center flex-1 border-r border-gray-100">
            <Clock size={20} color="#FF6B35" />
            <Text className="text-xs text-gray-500 mt-1">Travel</Text>
            <Text className="font-bodyBold text-secondary">{preferences.maxTravelTime}h</Text>
          </View>
          <View className="items-center flex-1 border-r border-gray-100">
             <Wallet size={20} color="#FF6B35" />
             <Text className="text-xs text-gray-500 mt-1">Budget pp</Text>
             <Text className="font-bodyBold text-secondary">{trip.costRange}</Text>
          </View>
          <View className="items-center flex-1">
             <Clock size={20} color="#FF6B35" />
             <Text className="text-xs text-gray-500 mt-1">Duration</Text>
             <Text className="font-bodyBold text-secondary">{trip.duration}</Text>
          </View>
        </View>

        {/* Suggested Itinerary */}
        <Text className="font-header text-lg text-secondary mb-4 flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          Suggested Itinerary
        </Text>

        <View className="relative border-l-2 border-gray-200 ml-2 pl-6 pb-4">
          {trip.activities.map((activity, index) => (
            <View key={index} className="relative mb-6">
               {/* Timeline Dot */}
               <View className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-secondary border-2 border-white" />
               
               <ActivityCard 
                 activity={activity} 
                 time={index === 0 ? "09:00" : index === 1 ? "10:45" : "11:45"} // Mock times for now
               />
            </View>
          ))}
        </View>

        {/* Trip Tips */}
        <View className="mt-2 mb-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <Text className="font-header text-base text-primary mb-2">Trip tips</Text>
          {trip.tripTips.map((tip, index) => (
            <View key={index} className="flex-row items-center mb-1">
               <View className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />
               <Text className="font-body text-gray-600 text-sm">{tip}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <Button 
            title={saved ? "Saved" : "Save trip"} 
            icon={<Heart size={20} color="white" fill={saved ? "white" : "transparent"} />}
            className={`flex-1 ${saved ? 'bg-success border-success' : 'bg-secondary border-secondary'}`}
            onPress={handleSave}
            disabled={saved}
          />
          <Button 
            title="Regenerate" 
            variant="outline" 
            icon={<RotateCcw size={20} color="#FF6B35" />}
            className="flex-1"
            onPress={handleRegenerate}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
