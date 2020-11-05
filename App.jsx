import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import TripListScreen from "./screens/TripListScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripOverviewScreen from './screens/TripOverviewScreen';
import TripScreen from './screens/TrackingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="float">
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name="Trips"
        component={TripListScreen}
        options={{title: "Your Trips"}}
        />
        <Stack.Screen
        name="TripOverview"
        component={TripOverviewScreen}
        options={{title: "Trip Overview"}}
        />
        <Stack.Screen
        name="StartTrip"
        component={TripScreen}
        options={{title: "Trip"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
