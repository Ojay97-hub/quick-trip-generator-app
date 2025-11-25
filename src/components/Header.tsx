import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  subtitle?: string;
}

export const Header = ({ 
  title, 
  showBack = false, 
  rightElement, 
  onBack,
  subtitle
}: HeaderProps) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-secondary pt-12">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        )}
        <View>
          {title && (
            <Text className="text-white font-header text-xl" numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-gray-300 font-body text-xs">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement && (
        <View>
          {rightElement}
        </View>
      )}
    </View>
  );
};

