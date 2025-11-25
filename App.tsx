import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';

import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PreferencesScreen } from './src/screens/PreferencesScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { TripResultScreen } from './src/screens/TripResultScreen';
import { AdjustmentScreen } from './src/screens/AdjustmentScreen';
import { SavedTripsScreen } from './src/screens/SavedTripsScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  let [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAFAFA' }
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="TripResult" component={TripResultScreen} />
          <Stack.Screen name="Adjustment" component={AdjustmentScreen} />
          <Stack.Screen name="SavedTrips" component={SavedTripsScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
