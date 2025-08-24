import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

const VideoDemoScreen: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  const sampleVideos = [
    {
      id: '1',
      title: 'Sample Video 1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Big Buck Bunny - Open source animated short film',
    },
    {
      id: '2',
      title: 'Sample Video 2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Elephants Dream - Open source animated short film',
    },
    {
      id: '3',
      title: 'Sample Video 3',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'For Bigger Blazes - Sample video for testing',
    },
  ];

  const handleVideoSelect = (video: typeof sampleVideos[0]) => {
    setSelectedVideo(video.url);
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
              setSelectedVideo(url.trim());
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>React Native Video Demo</Text>
      
      {selectedVideo ? (
        <View style={styles.videoSection}>
          <VideoPlayer
            source={selectedVideo}
            title="Playing Video"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedVideo('')}
          >
            <Text style={styles.backButtonText}>← Back to Video List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.videoList}>
          <Text style={styles.sectionTitle}>Sample Videos</Text>
          
          {sampleVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoItem}
              onPress={() => handleVideoSelect(video)}
            >
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
              <Text style={styles.videoUrl}>{video.url}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.customVideoButton}
            onPress={handleCustomVideo}
          >
            <Text style={styles.customVideoButtonText}>+ Add Custom Video URL</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
  },
  videoSection: {
    padding: 20,
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
  videoList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  videoItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  videoUrl: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  customVideoButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  customVideoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoDemoScreen;
