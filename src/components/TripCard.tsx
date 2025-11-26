import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Clock, Wallet, Star, Trash2, Calendar } from 'lucide-react-native';
import { SavedTrip } from '../types';

interface TripCardProps {
  trip: SavedTrip;
  onPress: () => void;
  onRemove: () => void;
}

// Tag colors for different interests
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Outdoors': { bg: 'bg-green-50', text: 'text-green-700' },
  'Food': { bg: 'bg-orange-50', text: 'text-primary' },
  'Culture': { bg: 'bg-blue-50', text: 'text-deepBlue' },
  'Nightlife': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'History': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Shopping': { bg: 'bg-pink-50', text: 'text-pink-700' },
  'Wellness': { bg: 'bg-teal-50', text: 'text-teal-700' },
  'Family': { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Music': { bg: 'bg-rose-50', text: 'text-rose-700' },
  'Wildlife': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Gaming': { bg: 'bg-violet-50', text: 'text-violet-700' },
  'Sport': { bg: 'bg-sky-50', text: 'text-sky-700' },
};

const getTagColors = (interest: string) => {
  return TAG_COLORS[interest] || { bg: 'bg-gray-50', text: 'text-gray-700' };
};

export const TripCard = ({ trip, onPress, onRemove }: TripCardProps) => {
  // Get interests from trip or derive from activities
  const interests = trip.interests || 
    [...new Set(trip.activities?.map(a => a.category.split(' ')[0]) || [])].slice(0, 3);

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Image Header with Gradient */}
      <View className="relative">
        <ImageBackground 
          source={{ uri: trip.imageUrl || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963' }} 
          className="h-36 w-full"
          resizeMode="cover"
        >
          {/* Gradient overlay from bottom */}
          <View 
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to top, rgba(4, 45, 76, 0.7), transparent)',
            }}
          />
        </ImageBackground>
        
        {/* Rating Badge */}
        <View className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-lg flex-row items-center shadow-sm">
          <Star size={12} color="#FFB703" fill="#FFB703" />
          <Star size={12} color="#FFB703" fill="#FFB703" />
          <Star size={12} color="#FFB703" fill="#FFB703" />
          <Star size={12} color="#FFB703" fill="#FFB703" />
          <Star size={12} color={trip.rating >= 4.5 ? "#FFB703" : "#E5E7EB"} fill={trip.rating >= 4.5 ? "#FFB703" : "transparent"} />
          <Text className="text-xs font-bold ml-1.5 text-secondary">{trip.rating}</Text>
        </View>
        
        {/* Travel time badge */}
        <View className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-lg flex-row items-center shadow-sm">
          <Clock size={12} color="#8E9AAF" />
          <Text className="text-xs text-gray-600 ml-1">{trip.duration.replace(' duration', '')}</Text>
        </View>
        
        {/* Remove Button */}
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }} 
          className="absolute bottom-3 right-3 bg-white/95 p-2 rounded-lg shadow-sm"
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View className="p-4">
        <Text className="font-header text-lg text-secondary">{trip.destination}</Text>
        
        {/* Tags Row */}
        <View className="flex-row flex-wrap gap-1.5 mt-2 mb-3">
          {interests.slice(0, 3).map((interest, idx) => {
            const colors = getTagColors(interest);
            return (
              <View key={idx} className={`${colors.bg} px-2.5 py-1 rounded-lg`}>
                <Text className={`${colors.text} text-[10px] font-bold`}>{interest}</Text>
              </View>
            );
          })}
        </View>

        {/* Info Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Calendar size={14} color="#8E9AAF" />
              <Text className="text-xs text-gray-500 ml-1">{trip.duration}</Text>
            </View>
            <View className="flex-row items-center">
              <Wallet size={14} color="#8E9AAF" />
              <Text className="text-xs text-gray-500 ml-1">{trip.costRange}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity 
            onPress={onPress}
            className="flex-1 bg-secondary py-2.5 rounded-lg items-center"
          >
            <Text className="text-white font-bodyBold text-sm">View details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex-1 bg-white border border-gray-200 py-2.5 rounded-lg items-center flex-row justify-center"
          >
            <Trash2 size={14} color="#8E9AAF" />
            <Text className="text-gray-600 font-body text-sm ml-1.5">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
