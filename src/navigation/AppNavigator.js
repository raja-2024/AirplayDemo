import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { VideoList } from '../screens/VideoList';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="VideoList"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="VideoList" 
          component={VideoList}
          options={{
            title: 'Video List',
          }}
        />
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen}
          options={{
            title: 'Video Player',
            presentation: 'modal',
            animationTypeForReplace: 'push',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
