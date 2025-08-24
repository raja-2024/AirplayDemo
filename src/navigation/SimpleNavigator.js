import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoList } from '../screens/VideoList';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

const SimpleNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('VideoList');
  const [screenParams, setScreenParams] = useState({});

  const navigateToVideoPlayer = (videoUrl, videoTitle) => {
    setScreenParams({ videoUrl, videoTitle });
    setCurrentScreen('VideoPlayer');
  };

  const goBack = () => {
    setCurrentScreen('VideoList');
    setScreenParams({});
  };

  if (currentScreen === 'VideoPlayer') {
    return (
      <VideoPlayerScreen
        videoUrl={screenParams.videoUrl}
        videoTitle={screenParams.videoTitle}
        onBack={goBack}
      />
    );
  }

  return (
    <VideoList onVideoSelect={navigateToVideoPlayer} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SimpleNavigator;
