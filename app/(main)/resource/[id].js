import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        setLoading(true);
        const resourceDoc = doc(db, 'resources', id);
        const resourceSnapshot = await getDoc(resourceDoc);
        
        if (resourceSnapshot.exists()) {
          setResource({
            id: resourceSnapshot.id,
            ...resourceSnapshot.data()
          });
        } else {
          setError('Resource not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError('Failed to load resource details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchResourceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
        <Text style={styles.loadingText}>Loading resource...</Text>
      </View>
    );
  }

  if (error || !resource) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D6A4F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error || 'Resource not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D6A4F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resource</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: resource.imageUrl }} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{resource.title}</Text>
          
          <View style={styles.tagsContainer}>
            {resource.tags.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.descriptionHeader}>Description</Text>
          <Text style={styles.description}>{resource.description}</Text>
          
          {resource.content && (
            <Text style={styles.content}>{resource.content}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4EA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1E7DD',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginLeft: 15,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: '#4C956C',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4EA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2D6A4F',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginHorizontal: 24,
  },
});