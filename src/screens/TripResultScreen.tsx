import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Linking, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, RotateCcw, Star, Clock, Wallet, Calendar,
  Train, Car, Bus, MapPin, Share2, Navigation,
  Check, Sparkles, ChevronRight, Building2, Image as ImageIcon
} from 'lucide-react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { ActivityCard } from '../components/ActivityCard';
import { RootStackParamList, TravelOption, Accommodation } from '../types';
import { getLocationImage } from '../utils/api';
import { useSavedTrips } from '../hooks/useSavedTrips';

type TripResultScreenRouteProp = RouteProp<RootStackParamList, 'TripResult'>;
type TripResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TripResult'>;

// Helper function to generate Google Maps URL based on travel mode
const getGoogleMapsUrl = (origin: string, destination: string, mode: 'train' | 'car' | 'bus'): string => {
  // Map travel types to Google Maps travel modes
  const travelMode = mode === 'car' ? 'driving' : 'transit';
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
};

// Travel option card component
const TravelOptionCard = ({ option, destination }: { option: TravelOption; destination: string }) => {
  const getIcon = () => {
    switch (option.type) {
      case 'train':
        return <Train size={22} color="#042D4C" />;
      case 'car':
        return <Car size={22} color="#042D4C" />;
      case 'bus':
        return <Bus size={22} color="#042D4C" />;
    }
  };

  const handleOpenDirections = async () => {
    const url = getGoogleMapsUrl(option.fromLocation, destination, option.type);
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening Google Maps:', error);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleOpenDirections}
      className="bg-white rounded-2xl p-4 border border-gray-200 mb-3 active:opacity-80"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          {getIcon()}
          <Text className="font-header text-lg text-secondary ml-2 capitalize">{option.type}</Text>
        </View>
        <View className="flex-row items-center">
          <Navigation size={16} color="#FF6B35" />
          <Text className="text-primary font-bodyBold text-xs ml-1">Get directions</Text>
        </View>
      </View>
      <View className="flex-row items-center mb-2">
        <Clock size={16} color="#8E9AAF" />
        <Text className="font-body text-sm text-gray-700 ml-2">{option.duration} from {option.fromLocation}</Text>
      </View>
      <View className="flex-row items-center mb-3">
        <Wallet size={16} color="#8E9AAF" />
        <Text className="font-body text-sm text-gray-700 ml-2">{option.cost}</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {option.tags.map((tag, idx) => (
          <View key={idx} className="bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
            <Text className="text-primary text-xs font-bodyBold">{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

// Accommodation card component
const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-3">
      <View className="flex-row">
        {accommodation.imageUrl && (
          <ImageBackground 
            source={{ uri: accommodation.imageUrl }}
            className="w-20 h-20 rounded-xl mr-3 overflow-hidden bg-gray-100"
            resizeMode="cover"
          />
        )}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-1 pr-2">
              <Text className="font-header text-base text-secondary" numberOfLines={2}>{accommodation.name}</Text>
              <Text className="font-body text-xs text-gray-500 mt-0.5">{accommodation.type}</Text>
            </View>
            <View className="flex-row items-center bg-warning/20 px-2 py-1 rounded-lg">
              <Star size={12} color="#FFB703" fill="#FFB703" />
              <Text className="text-xs font-bold ml-1 text-secondary">{accommodation.rating}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-1">
            <MapPin size={14} color="#8E9AAF" />
            <Text className="font-body text-xs text-gray-600 ml-1">{accommodation.distance}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Wallet size={14} color="#8E9AAF" />
            <Text className="font-body text-xs text-gray-600 ml-1">{accommodation.priceRange}</Text>
          </View>
        </View>
      </View>
      
      <View className="flex-row flex-wrap gap-2 mt-2">
        {accommodation.amenities.slice(0, 3).map((amenity, idx) => (
          <View key={idx} className="bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-md">
            <Text className="text-secondary text-[10px] font-body">{amenity}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const TripResultScreen = () => {
  const navigation = useNavigation<TripResultScreenNavigationProp>();
  const route = useRoute<TripResultScreenRouteProp>();
  const { trip, preferences } = route.params;
  const { saveTrip, isSaved } = useSavedTrips();
  
  const [imageUrl, setImageUrl] = useState<string>(trip.imageUrl || '');
  const [saved, setSaved] = useState(false);
  const [showTravelOptions, setShowTravelOptions] = useState(true);
  const [showAccommodation, setShowAccommodation] = useState(true);

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
    await saveTrip({ ...trip, imageUrl });
    setSaved(true);
    // Navigate to SavedTrips
    navigation.navigate('SavedTrips');
  };

  const isSavedView = route.params.isSavedView || false;

  const handleRegenerate = () => {
    navigation.replace('Loading', { preferences });
  };

  const handleViewOnMaps = async () => {
    const url = trip.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening maps:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this trip to ${trip.destination}! ${trip.subtitle}\n\nActivities:\n${trip.activities.map(a => `• ${a.name}`).join('\n')}\n\nGenerated with Quick Trip Planner`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNavigate = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trip.destination)}`;
    await Linking.openURL(url);
  };

  const handleViewImages = async () => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(trip.destination + ' images')}&tbm=isch`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening images:', error);
    }
  };

  return (
    <ScreenLayout
      activeTab="home"
      headerTitle="Quick Trip Planner"
      showBottomNav={true}
      scrollable
      contentContainerStyle="p-0"
    >
      {/* Hero Image Section */}
      <View className="relative">
        <ImageBackground 
          source={{ uri: imageUrl || 'https://images.pexels.com/photos/3971197/pexels-photo-3971197.jpeg' }} 
          className="h-60 w-full"
          resizeMode="cover"
        >
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />
          
          
          {/* Destination Info */}
          <View className="absolute bottom-0 left-0 right-0 p-5 pb-8">
            <View className="bg-black/50 rounded-lg px-3 py-2 mb-1 self-start">
              <Text className="text-white font-header text-3xl">
                {trip.destination}
              </Text>
            </View>
            <View className="bg-black/40 rounded-lg px-3 py-1 mb-3 self-start">
              <Text className="text-white font-body text-base">
                {trip.subtitle}
              </Text>
            </View>
            <View className="flex-row items-center bg-black/40 self-start px-2 py-1 rounded-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  color="#FFB703"
                  fill={star <= Math.round(trip.rating) ? "#FFB703" : "transparent"}
                />
              ))}
              <Text className="text-white font-bold text-sm ml-2">{trip.rating}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Main Content */}
      <View className="px-4 -mt-4 bg-light rounded-t-3xl pt-6">
        {/* Stats Card */}
        <View className="bg-white rounded-2xl shadow-md border border-gray-100 mb-6 overflow-hidden">
          <View className="flex-row">
            <View className="flex-1 items-center py-4 border-r border-gray-100">
              <Clock size={20} color="#FF6B35" />
              <Text className="text-xs text-gray-500 mt-1.5 font-body">travel</Text>
              <Text className="font-header text-base text-secondary">{preferences.maxTravelTime}h</Text>
            </View>
            <View className="flex-1 items-center py-4 border-r border-gray-100">
              <Wallet size={20} color="#FF6B35" />
              <Text className="text-xs text-gray-500 mt-1.5 font-body">budget pp</Text>
              <Text className="font-header text-base text-secondary" numberOfLines={1}>
                {trip.costRange.replace(/(\spp|pp)/i, '').trim()}
              </Text>
            </View>
            <View className="flex-1 items-center py-4">
              <Calendar size={20} color="#FF6B35" />
              <Text className="text-xs text-gray-500 mt-1.5 font-body">duration</Text>
              <Text className="font-header text-base text-secondary">
                {trip.duration.replace(/(\sduration|duration)/i, '').trim()}
              </Text>
            </View>
          </View>
        </View>

        {/* Suggested Itinerary Section */}
        <View className="flex-row items-center mb-4">
          <View className="w-3 h-3 rounded-full bg-primary mr-3" />
          <Text className="font-header text-xl text-secondary">Suggested itinerary</Text>
        </View>

        {/* Activity Cards */}
        <View className="mb-6">
          {trip.activities.map((activity, index) => (
            <View key={index} className="mb-3">
              <ActivityCard activity={activity} />
            </View>
          ))}
        </View>

        {/* Trip Tips Section */}
        <View className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <View className="p-5">
            <View className="flex-row items-center mb-4">
              <Sparkles size={20} color="#FF6B35" />
              <Text className="font-header text-lg text-primary ml-2">Trip tips</Text>
            </View>
            {trip.tripTips.map((tip, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <View className="w-5 h-5 rounded-full bg-success/20 items-center justify-center mt-0.5">
                  <Check size={12} color="#00C896" />
                </View>
                <Text className="font-body text-gray-700 text-sm ml-3 flex-1 leading-5">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* View Images and View on Maps Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            onPress={handleViewImages}
            className="flex-1 bg-white border border-gray-200 py-3 rounded-lg items-center flex-row justify-center"
          >
            <ImageIcon size={18} color="#00D4FF" />
            <Text className="text-secondary font-bodyBold text-sm ml-2">View images</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleViewOnMaps}
            className="flex-1 bg-secondary py-3 rounded-lg items-center flex-row justify-center"
          >
            <MapPin size={18} color="white" />
            <Text className="text-white font-bodyBold text-sm ml-2">View on maps</Text>
          </TouchableOpacity>
        </View>

        {/* Best Way to Travel Section */}
        {trip.travelOptions && trip.travelOptions.length > 0 && (
          <View className="mb-6">
            <TouchableOpacity 
              onPress={() => setShowTravelOptions(!showTravelOptions)}
              className="flex-row items-center justify-between mb-4 py-2"
            >
              <View className="flex-row items-center">
                <Train size={22} color="#042D4C" />
                <Text className="font-header text-xl text-secondary ml-3">Best way to travel</Text>
              </View>
              <Text className="text-primary font-bodyBold text-sm">
                {showTravelOptions ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
            
            {showTravelOptions && (
              <View>
                {trip.travelOptions.map((option, index) => (
                  <TravelOptionCard key={index} option={option} destination={trip.destination} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Nearest Accommodation Section */}
        {trip.accommodation && trip.accommodation.length > 0 && (
          <View className="mb-6">
            <TouchableOpacity 
              onPress={() => setShowAccommodation(!showAccommodation)}
              className="flex-row items-center justify-between mb-4 py-2"
            >
              <View className="flex-row items-center">
                <Building2 size={22} color="#042D4C" />
                <Text className="font-header text-xl text-secondary ml-3">Nearest accommodation</Text>
              </View>
              <Text className="text-primary font-bodyBold text-sm">
                {showAccommodation ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
            
            {showAccommodation && (
              <View>
                {trip.accommodation.map((acc, index) => (
                  <AccommodationCard key={index} accommodation={acc} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-8 mt-4">
          {isSavedView ? (
            <View className="flex-row gap-3">
              <Button 
                title="Share" 
                variant="primary"
                icon={<Share2 size={18} color="white" />}
                className="flex-1"
                onPress={handleShare}
              />
              <Button 
                title="Navigate" 
                variant="outline"
                icon={<Navigation size={18} color="#042D4C" />}
                className="flex-1"
                onPress={handleNavigate}
              />
            </View>
          ) : (
            <View className="flex-row gap-3">
              <Button 
                title="Save trip" 
                icon={<Heart size={18} color="white" fill="transparent" />}
                className="flex-1"
                variant="primary"
                onPress={handleSave}
                disabled={saved}
              />
              <Button 
                title="Regenerate" 
                variant="outline" 
                icon={<RotateCcw size={18} color="#042D4C" />}
                className="flex-1"
                onPress={handleRegenerate}
              />
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
};
