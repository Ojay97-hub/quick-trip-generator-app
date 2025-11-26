import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Clock, Banknote, Landmark, Utensils, TreePine, ShoppingBag, Music, Dumbbell, Star, MapPin } from 'lucide-react-native';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
}

// Get icon based on category
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('food') || categoryLower.includes('cafe') || categoryLower.includes('restaurant') || categoryLower.includes('dining') || categoryLower.includes('market')) {
    return <Utensils size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('historic') || categoryLower.includes('cultural') || categoryLower.includes('museum') || categoryLower.includes('gallery')) {
    return <Landmark size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('outdoor') || categoryLower.includes('scenic') || categoryLower.includes('nature') || categoryLower.includes('walk') || categoryLower.includes('park')) {
    return <TreePine size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('shopping')) {
    return <ShoppingBag size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('music') || categoryLower.includes('entertainment')) {
    return <Music size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('sport') || categoryLower.includes('wellness') || categoryLower.includes('spa') || categoryLower.includes('pool')) {
    return <Dumbbell size={22} color="#FF6B35" />;
  }
  if (categoryLower.includes('tour')) {
    return <MapPin size={22} color="#FF6B35" />;
  }
  
  return <Landmark size={22} color="#FF6B35" />;
};

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const displayTime = activity.startTime || "09:00";
  
  const handleBookingPress = async () => {
    if (activity.bookingUrl) {
      try {
        const canOpen = await Linking.canOpenURL(activity.bookingUrl);
        if (canOpen) {
          await Linking.openURL(activity.bookingUrl);
        }
      } catch (error) {
        console.error('Error opening booking URL:', error);
      }
    }
  };

  return (
    <View className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Row */}
      <View className="p-4 pb-0">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-start flex-1 pr-3">
            <View className="mt-0.5">
              {getCategoryIcon(activity.category)}
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-header text-base text-secondary leading-5">{activity.name}</Text>
              <Text className="font-body text-xs text-gray-500 mt-0.5">{activity.category}</Text>
            </View>
          </View>
          <View className="bg-secondary px-2.5 py-1 rounded-lg">
            <Text className="text-white text-xs font-bold">{displayTime}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View className="px-4 py-2">
        <Text className="font-body text-sm text-gray-700 leading-5" numberOfLines={3}>
          {activity.description}
        </Text>
      </View>

      {/* Stats Row */}
      <View className="px-4 pb-3">
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-4">
            <Clock size={14} color="#8E9AAF" />
            <Text className="font-body text-xs text-gray-600 ml-1.5">{activity.duration}</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <Banknote size={14} color="#8E9AAF" />
            <Text className="font-body text-xs text-gray-600 ml-1.5">{activity.cost}</Text>
          </View>
          {activity.rating && (
            <View className="flex-row items-center">
              <Star size={14} color="#FFB703" fill="#FFB703" />
              <Text className="font-body text-xs text-gray-600 ml-1">{activity.rating}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer with Booking Link */}
      <View className="px-4 pb-3 flex-row items-center justify-end">
        {activity.bookingUrl && activity.bookingPlatform && (
          <TouchableOpacity onPress={handleBookingPress}>
            <Text className="text-highlight text-xs font-bodyBold">
              Book on {activity.bookingPlatform}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
