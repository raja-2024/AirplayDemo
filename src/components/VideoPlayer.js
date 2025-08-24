import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const VideoPlayer = ({ source, title = 'Video Player' }) => {
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleError = (error) => {
    setLoading(false);
    setError('Error loading video');
    console.error('Video error:', error);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const handleVideoPress = () => {
    togglePlayPause();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: source }}
          style={styles.video}
          resizeMode="contain"
          paused={paused}
          onLoad={handleLoad}
          onError={handleError}
          onPress={handleVideoPress}
          controls={false}
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
        
        {!loading && !error && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={handleVideoPress}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>
              {paused ? '▶️' : '⏸️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={togglePlayPause}
        >
          <Text style={styles.controlButtonText}>
            {paused ? 'Play' : 'Pause'}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    position: 'relative',
    width: width - 40,
    height: (width - 40) * 0.6,
    backgroundColor: '#111',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
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
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  playButtonText: {
    fontSize: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoPlayer;
