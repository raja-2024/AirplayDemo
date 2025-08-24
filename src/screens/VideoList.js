import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const VideoList = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Manual safe area handling
  const getSafeAreaTop = () => {
    if (Platform.OS === 'ios') {
      return 44; // iOS status bar height
    }
    return 20; // Android default
  };

  const sampleVideos = [
    {
      id: '1',
      title: 'Big Buck Bunny',
      duration: '9:56',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      id: '2',
      title: 'Elephant Dream',
      duration: '10:53',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      id: '3',
      title: 'For Bigger Blazes',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: '4',
      title: 'For Bigger Escape',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4',
    },
    {
      id: '5',
      title: 'For Bigger Fun',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    {
      id: '6',
      title: 'For Bigger Joyrides',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    {
      id: '7',
      title: 'For Bigger Meltdowns',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
      id: '8',
      title: 'Sintel',
      duration: '14:48',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
    {
      id: '9',
      title: 'Subaru Outback On Street And Dirt',
      duration: '0:16',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    },
    {
      id: '10',
      title: 'Tears of Steel',
      duration: '12:14',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (video, index) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setPaused(false);
    setIsFullscreen(false);
  };

  const handleCustomVideo = () => {
    Alert.prompt(
      'Enter Video URL',
      'Please enter a valid video URL:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: (url) => {
            if (url && url.trim()) {
              const customVideo = {
                id: 'custom',
                title: 'Custom Video',
                duration: 'Unknown',
                url: url.trim(),
              };
              setSelectedVideo(customVideo);
              setCurrentVideoIndex(-1);
              setCurrentTime(0);
              setDuration(0);
              setPaused(false);
              setIsFullscreen(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setSeeking(false); // Ensure seeking is false when loading
  };

  const handleError = (error) => {
    console.log('Video error:', error);
    Alert.alert('Error', error.error.errorString);
    setPaused(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleEnd = () => {
    setPaused(true);
    setCurrentTime(0);
  };

  const handleProgress = (data) => {
    if (!seeking) {
      setCurrentTime(data.currentTime);
    }
  };

  const handleSeek = (event) => {
    const { locationX } = event.nativeEvent;
    const seekBarWidth = width - 40; // Account for padding
    const seekPercentage = locationX / seekBarWidth;
    const seekTime = seekPercentage * duration;
    
    if (videoRef.current) {
      videoRef.current.seek(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const goToPrevious = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      handleVideoSelect(sampleVideos[prevIndex], prevIndex);
    }
  };

  const goToNext = () => {
    if (currentVideoIndex < sampleVideos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      handleVideoSelect(sampleVideos[nextIndex], nextIndex);
    }
  };

  const renderVideoItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.videoItem,
        selectedVideo?.id === item.id && styles.selectedVideoItem,
      ]}
      onPress={() => handleVideoSelect(item, index)}
    >
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.playIcon}>▶️</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: getSafeAreaTop() + 20 }]}>
      <Text style={styles.headerTitle}>React Native Video Demo</Text>
      <Text style={styles.headerSubtitle}>
        {sampleVideos.length} sample videos available
      </Text>
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.customVideoButton} onPress={handleCustomVideo}>
      <Text style={styles.customVideoButtonText}>🎬 Add Custom Video</Text>
    </TouchableOpacity>
  );

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    return (
      <View style={styles.videoPlayerContainer}>
        <View style={styles.videoInfoHeader}>
          <Text style={styles.videoPlayerTitle} numberOfLines={1}>
            {selectedVideo.title}
          </Text>
          <Text style={styles.videoCounter}>
            {currentVideoIndex >= 0 ? `${currentVideoIndex + 1} of ${sampleVideos.length}` : 'Custom Video'}
          </Text>
        </View>

        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: selectedVideo.url }}
            style={styles.video}
            resizeMode="contain"
            paused={paused}
            onLoad={handleLoad}
            onError={handleError}
            onEnd={handleEnd}
            onProgress={handleProgress}
            onFullscreenPlayerWillPresent={() => setIsFullscreen(true)}
            onFullscreenPlayerWillDismiss={() => setIsFullscreen(false)}
            fullscreen={isFullscreen}
            fullscreenOrientation="landscape"
            fullscreenAutorotate={true}
            controls={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
            repeat={false}
          />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <TouchableOpacity style={styles.seekBar} onPress={handleSeek}>
            <View style={styles.seekBarBackground}>
              <View
                style={[
                  styles.seekBarProgress,
                  { width: `${(currentTime / duration) * 100}%` },
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, styles.navButton]}
              onPress={goToPrevious}
              disabled={currentVideoIndex <= 0}
            >
              <Text style={styles.controlButtonText}>⏮️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={() => setPaused(!paused)}
            >
              <Text style={styles.controlButtonText}>
                {paused ? '▶️' : '⏸️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.navButton]}
              onPress={goToNext}
              disabled={currentVideoIndex >= sampleVideos.length - 1}
            >
              <Text style={styles.controlButtonText}>⏭️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {selectedVideo ? (
        <View style={styles.fullscreenContainer}>
          {renderVideoPlayer()}
          <TouchableOpacity
            style={styles.backToListButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Text style={styles.backToListButtonText}>← Back to List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.container}
          data={sampleVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  videoItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedVideoItem: {
    backgroundColor: '#e0e0e0', // A subtle highlight for selected item
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 14,
    color: '#666',
  },
  playIcon: {
    fontSize: 24,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  customButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
  },
  videoInfoHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  videoPlayerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  videoCounter: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  seekBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666',
    marginBottom: 15,
  },
  seekBarBackground: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  seekBarProgress: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  navButton: {
    // No specific styles needed, just for clarity
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  controlButtonText: {
    fontSize: 24,
    color: 'white',
  },
  backToListButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backToListButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoList;
