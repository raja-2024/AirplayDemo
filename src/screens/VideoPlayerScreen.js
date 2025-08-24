import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const safeAreaInsets = useSafeAreaInsets();
  
  const { videoUrl, videoTitle } = route.params || {};

  useEffect(() => {
    // Force landscape orientation when screen mounts
    const forceLandscape = async () => {
      try {
        // This will be handled by the video component's fullscreen properties
        setFullscreen(true);
      } catch (err) {
        console.log('Orientation change error:', err);
      }
    };

    forceLandscape();

    // Handle back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fullscreen) {
        setFullscreen(false);
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, [fullscreen]);

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleError = (error) => {
    setLoading(false);
    setError('Error loading video');
    console.error('Video error:', error);
  };

  const handleEnd = () => {
    setPaused(true);
  };

  const handleProgress = (data) => {
    // Handle progress updates if needed
  };

  const handleBackPress = () => {
    if (fullscreen) {
      setFullscreen(false);
    } else {
      navigation.goBack();
    }
  };

  const handleFullscreenChange = (event) => {
    setFullscreen(event.isFullscreen);
  };

  if (!videoUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No video URL provided</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: safeAreaInsets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {videoTitle || 'Video Player'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="contain"
          paused={paused}
          onLoad={handleLoad}
          onError={handleError}
          onEnd={handleEnd}
          onProgress={handleProgress}
          onFullscreenPlayerWillPresent={() => setFullscreen(true)}
          onFullscreenPlayerWillDismiss={() => setFullscreen(false)}
          onFullscreenPlayerDidPresent={handleFullscreenChange}
          onFullscreenPlayerDidDismiss={handleFullscreenChange}
          fullscreen={fullscreen}
          fullscreenOrientation="landscape"
          fullscreenAutorotate={true}
          controls={true}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          repeat={false}
        />
        
        {loading && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Loading...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.overlay}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Custom Controls */}
      <View style={styles.customControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setPaused(!paused)}
        >
          <Text style={styles.controlButtonText}>
            {paused ? '▶️ Play' : '⏸️ Pause'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={() => setFullscreen(!fullscreen)}
        >
          <Text style={styles.fullscreenButtonText}>
            {fullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  placeholder: {
    width: 70, // Same width as back button for centering
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  customControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  fullscreenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoPlayerScreen;
