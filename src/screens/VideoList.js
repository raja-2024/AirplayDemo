import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const VideoList = () => {
  const [selectedVideo, setSelectedVideo] = useState('');
  const safeAreaInsets = useSafeAreaInsets();
  const navigation = useNavigation();

  const sampleVideos = [
    {
      id: '1',
      title: 'Big Buck Bunny',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Open source animated short film by the Blender Institute',
      duration: '10:53',
    },
    {
      id: '2',
      title: 'Elephants Dream',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'The world\'s first open movie, made entirely with open source software',
      duration: '10:57',
    },
    {
      id: '3',
      title: 'For Bigger Blazes',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Sample video for testing video players and streaming',
      duration: '0:15',
    },
    {
      id: '4',
      title: 'For Bigger Escape',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4',
      description: 'Another sample video for testing purposes',
      duration: '0:15',
    },
    {
      id: '5',
      title: 'For Bigger Fun',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      description: 'Sample video demonstrating video playback capabilities',
      duration: '0:15',
    },
    {
      id: '6',
      title: 'For Bigger Joyrides',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      description: 'Sample video for testing video streaming',
      duration: '0:15',
    },
    {
      id: '7',
      title: 'For Bigger Meltdowns',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      description: 'Sample video demonstrating video player functionality',
      duration: '0:15',
    },
    {
      id: '8',
      title: 'Sintel',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      description: 'Open source animated short film by the Blender Foundation',
      duration: '14:48',
    },
    {
      id: '9',
      title: 'Tears of Steel',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: 'Open source science fiction film by the Blender Foundation',
      duration: '12:14',
    },
    {
      id: '10',
      title: 'We Are Going on Bullrun',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      description: 'Sample video for testing video playback',
      duration: '0:13',
    },
    {
      id: '11',
      title: 'What Car Can You Get For a Grand?',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      description: 'Sample video demonstrating video streaming capabilities',
      duration: '0:13',
    },
  ];

  const handleVideoSelect = (video) => {
    // Navigate to VideoPlayer screen with video data
    navigation.navigate('VideoPlayer', {
      videoUrl: video.url,
      videoTitle: video.title,
    });
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
              navigation.navigate('VideoPlayer', {
                videoUrl: url.trim(),
                videoTitle: 'Custom Video',
              });
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
      <View style={styles.videoItemHeader}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.videoDescription}>{item.description}</Text>
      <Text style={styles.videoUrl} numberOfLines={1} ellipsizeMode="tail">
        {item.url}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: safeAreaInsets.top + 20 }]}>
      <Text style={styles.headerTitle}>React Native Video Demo</Text>
      <Text style={styles.headerSubtitle}>
        {sampleVideos.length} sample videos available
      </Text>
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.customVideoButton}
      onPress={handleCustomVideo}
    >
      <Text style={styles.customVideoButtonText}>+ Add Custom Video URL</Text>
    </TouchableOpacity>
  );

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
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  videoSection: {
    flex: 1,
    padding: 20,
    paddingTop: safeAreaInsets.top + 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  videoDuration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  videoUrl: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  customVideoButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  customVideoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoList;
