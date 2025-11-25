import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, Banknote, ExternalLink } from 'lucide-react-native';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  time: string;
}

export const ActivityCard = ({ activity, time }: ActivityCardProps) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1">
          <View className="flex-row items-center">
             <Text className="font-header text-base text-secondary mr-2">{activity.name}</Text>
             {activity.mustDo && (
               <View className="bg-secondary px-2 py-0.5 rounded">
                 <Text className="text-white text-[10px] font-bold">MUST DO</Text>
               </View>
             )}
          </View>
          <Text className="font-body text-xs text-gray-500">{activity.category}</Text>
        </View>
        <View className="bg-secondary px-2 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">{time}</Text>
        </View>
      </View>

      <Text className="font-body text-sm text-gray-700 my-2" numberOfLines={2}>
        {activity.description}
      </Text>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Clock size={14} color="#8E9AAF" className="mr-1" />
            <Text className="font-body text-xs text-gray-500">{activity.duration}</Text>
          </View>
          <View className="flex-row items-center">
            <Banknote size={14} color="#8E9AAF" className="mr-1" />
            <Text className="font-body text-xs text-gray-500">{activity.cost}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-highlight text-xs font-body underline">Book on TripAdvisor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

