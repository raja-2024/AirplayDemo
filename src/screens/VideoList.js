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
  Slider,
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
      title: 'Sintel',
      duration: '15:01',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
    {
      id: '4',
      title: 'Tears of Steel',
      duration: '12:14',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    {
      id: '5',
      title: 'We Are Going on Bullrun',
      duration: '0:15',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
    {
      id: '6',
      title: 'What Car Can You Get For',
      duration: '0:16',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetFor.mp4',
    },
    {
      id: '7',
      title: 'Subaru Outback On Street And Dirt',
      duration: '0:37',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    },
    {
      id: '8',
      title: 'Volkswagen GTI Review',
      duration: '6:36',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    },
    {
      id: '9',
      title: 'Honda Civic Type R',
      duration: '0:30',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/HondaCivicTypeR.mp4',
    },
    {
      id: '10',
      title: 'Chevrolet Impala',
      duration: '0:30',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ChevroletImpala.mp4',
    },
  ];

  const handleVideoSelect = (video) => {
    const index = sampleVideos.findIndex(v => v.id === video.id);
    setCurrentVideoIndex(index);
    setSelectedVideo(video);
    setIsFullscreen(true);
    setPaused(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleVideoClose = () => {
    setSelectedVideo(null);
    setIsFullscreen(false);
    setPaused(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const goToPrevious = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = sampleVideos[currentVideoIndex - 1];
      setCurrentVideoIndex(currentVideoIndex - 1);
      setSelectedVideo(prevVideo);
      setPaused(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const goToNext = () => {
    if (currentVideoIndex < sampleVideos.length - 1) {
      const nextVideo = sampleVideos[currentVideoIndex + 1];
      setCurrentVideoIndex(currentVideoIndex + 1);
      setSelectedVideo(nextVideo);
      setPaused(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const onSeek = (value) => {
    setSeeking(true);
    setCurrentTime(value);
  };

  const onSeekComplete = (value) => {
    setSeeking(false);
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
  };

  const onProgress = (data) => {
    if (!seeking) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              setSelectedVideo({
                id: 'custom',
                title: 'Custom Video',
                duration: 'Unknown',
                url: url.trim(),
              });
              setIsFullscreen(true);
              setPaused(false);
              setCurrentTime(0);
              setDuration(0);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoSelect(item)}
    >
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.playButton}>▶️</Text>
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
    <View style={styles.footer}>
      <TouchableOpacity style={styles.customButton} onPress={handleCustomVideo}>
        <Text style={styles.customButtonText}>🎬 Add Custom Video</Text>
      </TouchableOpacity>
    </View>
  );

  // If a video is selected and fullscreen, show only the video player
  if (selectedVideo && isFullscreen) {
    return (
      <View style={styles.fullscreenContainer}>
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo.url }}
          style={styles.fullscreenVideo}
          resizeMode="contain"
          controls={false}
          paused={paused}
          fullscreen={true}
          fullscreenOrientation="landscape"
          fullscreenAutorotate={true}
          onEnd={() => handleVideoClose()}
          onError={() => handleVideoClose()}
          onProgress={onProgress}
          onLoad={onLoad}
        />
        
        {/* Custom Controls */}
        <View style={styles.customControls}>
          {/* Previous Button */}
          <TouchableOpacity 
            style={[styles.controlButton, currentVideoIndex === 0 && styles.disabledButton]} 
            onPress={goToPrevious}
            disabled={currentVideoIndex === 0}
          >
            <Text style={styles.controlButtonText}>⏮️</Text>
          </TouchableOpacity>

          {/* Play/Pause Button */}
          <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
            <Text style={styles.controlButtonText}>
              {paused ? '▶️' : '⏸️'}
            </Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity 
            style={[styles.controlButton, currentVideoIndex === sampleVideos.length - 1 && styles.disabledButton]} 
            onPress={goToNext}
            disabled={currentVideoIndex === sampleVideos.length - 1}
          >
            <Text style={styles.controlButtonText}>⏭️</Text>
          </TouchableOpacity>
        </View>

        {/* Seekbar */}
        <View style={styles.seekbarContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.seekbar}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            onValueChange={onSeek}
            onSlidingComplete={onSeekComplete}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#666666"
            thumbStyle={styles.thumb}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Video Info */}
        <View style={styles.videoInfoOverlay}>
          <Text style={styles.videoTitleOverlay}>{selectedVideo.title}</Text>
          <Text style={styles.videoProgress}>
            {currentVideoIndex + 1} of {sampleVideos.length}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={handleVideoClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
  playButton: {
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
  fullscreenVideo: {
    flex: 1,
  },
  customControls: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
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
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 24,
    color: 'white',
  },
  seekbarContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  seekbar: {
    flex: 1,
    marginHorizontal: 15,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'center',
  },
  thumb: {
    backgroundColor: '#2196F3',
    width: 20,
    height: 20,
  },
  videoInfoOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  videoTitleOverlay: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  videoProgress: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default VideoList;
