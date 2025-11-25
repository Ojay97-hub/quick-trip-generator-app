import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Clock, Wallet, Star, ArrowRight, Trash2 } from 'lucide-react-native';
import { SavedTrip } from '../types';

interface TripCardProps {
  trip: SavedTrip;
  onPress: () => void;
  onRemove: () => void;
}

export const TripCard = ({ trip, onPress, onRemove }: TripCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
    >
      <ImageBackground 
        source={{ uri: trip.imageUrl || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963' }} 
        className="h-32 w-full justify-between p-3"
        imageStyle={{ borderRadius: 12 }}
      >
        <View className="flex-row justify-between items-start">
           <View className="bg-white/90 px-2 py-1 rounded-md flex-row items-center">
             <Star size={12} color="#FFB703" fill="#FFB703" />
             <Text className="text-xs font-bold ml-1">{trip.rating}</Text>
           </View>
           <TouchableOpacity onPress={onRemove} className="bg-white/90 p-1.5 rounded-full">
             <Trash2 size={14} color="#EF4444" />
           </TouchableOpacity>
        </View>
      </ImageBackground>
      
      <View className="p-4">
        <Text className="font-header text-lg text-secondary mb-1">{trip.destination}</Text>
        <Text className="font-body text-xs text-gray-500 mb-3">{trip.subtitle}</Text>

        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row items-center">
            <Clock size={14} color="#8E9AAF" className="mr-1" />
            <Text className="text-xs text-gray-500">{trip.duration}</Text>
          </View>
          <View className="flex-row items-center">
            <Wallet size={14} color="#8E9AAF" className="mr-1" />
            <Text className="text-xs text-gray-500">{trip.costRange}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2">
            <View className="bg-orange-50 px-2 py-1 rounded">
              <Text className="text-primary text-[10px] font-bold">Outdoors</Text>
            </View>
            <View className="bg-blue-50 px-2 py-1 rounded">
              <Text className="text-deepBlue text-[10px] font-bold">Culture</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-secondary text-xs font-bold mr-1">View details</Text>
            <ArrowRight size={14} color="#042D4C" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

