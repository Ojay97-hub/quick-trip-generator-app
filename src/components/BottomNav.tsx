import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Home, Bookmark } from 'lucide-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

interface BottomNavProps {
  activeTab: 'home' | 'saved';
}

export const BottomNav = ({ activeTab }: BottomNavProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="flex-row justify-around items-center bg-secondary py-4 pb-8 rounded-t-3xl absolute bottom-0 left-0 right-0 h-24">
      <TouchableOpacity 
        onPress={() => navigation.navigate('Welcome')}
        className="items-center justify-center"
      >
        <Home 
          size={28} 
          color={activeTab === 'home' ? '#FFFFFF' : '#8E9AAF'} 
          strokeWidth={activeTab === 'home' ? 3 : 2}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('SavedTrips')}
        className="items-center justify-center"
      >
        <Bookmark 
          size={28} 
          color={activeTab === 'saved' ? '#FFFFFF' : '#8E9AAF'}
          strokeWidth={activeTab === 'saved' ? 3 : 2}
        />
      </TouchableOpacity>
    </View>
  );
};

