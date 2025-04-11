import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, ActivityIndicator, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firebase config
import ResourceCard from '../../components/resourceCard';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/topBar';

export default function ResourceHubScreen() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const resourcesCollection = collection(db, 'resources');
        const resourceSnapshot = await getDocs(resourcesCollection);
        const resourcesList = resourceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setResources(resourcesList);
        setFilteredResources(resourcesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
        setLoading(false);
      }
    };

    const fetchProfilePicture = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setProfilePicture(data.profilePicture || '');
          }
        } catch (err) {
          console.error('Error fetching profile picture:', err);
        }
      }
    };

    fetchProfilePicture();
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  const handleCardPress = (item) => {
    router.navigate({
      pathname: '/resource/[id]',
      params: { id: item.id }
    });
  };

  const handleNotificationPress = () => {
    // Handle notification press
    Alert.alert('Notifications', 'No new notifications at the moment.');
  };

  const handleProfilePress = () => {
    // Navigate to profile screen
    router.push('/profile');
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
        <Text style={styles.loadingText}>Loading resources...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>

        <TopBar
          title="Resource Hub"
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
          profilePicture={profilePicture}
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close"
              size={20}
              color="#666"
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResourceCard item={item} onPress={handleCardPress} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4EA',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    marginHorizontal: 15,
    color: '#2D6A4F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContainer: {
    padding: 15,
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
