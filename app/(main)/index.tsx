import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TopBar from '@/components/topBar';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
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
  }, []);

  const handleNotificationPress = () => {
    // Handle notification press
    Alert.alert('Notifications', 'No new notifications at the moment.');
  };

  const handleProfilePress = () => {
    // Navigate to profile screen
    router.push('/profile');
  };

  const navigateTo = (route: string) => {
    switch (route) {
      case 'resources':
        router.push('/resource-hub');
        break;
      case 'jobs':
        Alert.alert('Coming Soon', 'Job listings will be available soon!');
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'accessibility':
        Alert.alert('Coming Soon', 'Accessibility settings will be available soon!');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E8F4EA" barStyle="dark-content" />
      <TopBar
        title="ReachOut"
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        profilePicture={profilePicture}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Equal Opportunities for All</Text>
          <Text style={styles.subtitle}>Because Ability is Limitless</Text>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Navigation Tiles */}
        <View style={styles.tilesContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.tilesRow}>
            <TouchableOpacity
              style={styles.tile}
              onPress={() => navigateTo('resources')}
            >
              <View style={styles.tileContent}>
                <Ionicons name="cube-outline" size={32} color="#2D6A4F" />
                <Text style={styles.tileText}>Resource Hub</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tile}
              onPress={() => navigateTo('jobs')}
            >
              <View style={styles.tileContent}>
                <Ionicons name="briefcase-outline" size={32} color="#2D6A4F" />
                <Text style={styles.tileText}>Jobs</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.tilesRow}>
            <TouchableOpacity
              style={styles.tile}
              onPress={() => navigateTo('profile')}
            >
              <View style={styles.tileContent}>
                <Ionicons name="person-outline" size={32} color="#2D6A4F" />
                <Text style={styles.tileText}>Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tile}
              onPress={() => navigateTo('accessibility')}
            >
              <View style={styles.tileContent}>
                <Ionicons name="settings-outline" size={32} color="#2D6A4F" />
                <Text style={styles.tileText}>Accessibility Settings</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Resources Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Resources</Text>
          <TouchableOpacity style={styles.featuredCard} onPress={() => navigateTo('resources')}>
            <View style={styles.featuredContent}>
              <Ionicons name="star" size={24} color="#F9C74F" style={styles.featuredIcon} />
              <View style={styles.featuredTextContainer}>
                <Text style={styles.featuredTitle}>New Accessibility Guidelines</Text>
                <Text style={styles.featuredDescription}>
                  Learn about the latest accessibility standards for digital platforms.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#2D6A4F" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredCard} onPress={() => navigateTo('resources')}>
            <View style={styles.featuredContent}>
              <Ionicons name="bulb" size={24} color="#F9C74F" style={styles.featuredIcon} />
              <View style={styles.featuredTextContainer}>
                <Text style={styles.featuredTitle}>Inclusive Design Workshop</Text>
                <Text style={styles.featuredDescription}>
                  Join our upcoming workshop on creating inclusive digital experiences.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#2D6A4F" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4EA', // Matching other screens
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F', // Matching color scheme from other screens
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.6,
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D6A4F',
    paddingHorizontal: 5,
  },
  tilesContainer: {
    padding: 15,
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tileContent: {
    alignItems: 'center',
    padding: 10,
  },
  tileText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  featuredSection: {
    padding: 15,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 15,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    marginRight: 12,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomSpace: {
    height: 30,
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
});