import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E0F0E0" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ReachOut</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileCircle} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Equal Opportunities for All</Text>
        <Text style={styles.subtitle}>Because Ability is Limitless</Text>
        
        {/* Image */}
        <View style={styles.imageContainer}>
          {/* <Image
            source={require('../assets/collaboration.png')}
            style={styles.image}
            resizeMode="contain"
          /> */}
        </View>
      </View>
      
      {/* Navigation Tiles */}
      <View style={styles.tilesContainer}>
        <View style={styles.tilesRow}>
          <TouchableOpacity style={styles.tile}>
            <View style={styles.tileContent}>
              <Ionicons name="cube-outline" size={32} color="#333" />
              <Text style={styles.tileText}>Resource Hub</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tile}>
            <View style={styles.tileContent}>
              <Ionicons name="briefcase-outline" size={32} color="#333" />
              <Text style={styles.tileText}>Jobs</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tilesRow}>
          <TouchableOpacity style={styles.tile}>
            <View style={styles.tileContent}>
              <Ionicons name="person-outline" size={32} color="#333" />
              <Text style={styles.tileText}>Profile</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tile}>
            <View style={styles.tileContent}>
              <Ionicons name="settings-outline" size={32} color="#333" />
              <Text style={styles.tileText}>Accessibility Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0E0', // Light mint green background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D0E0D0',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'serif',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 15,
  },
  profileButton: {
    
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DDDDDD',
  },
  mainContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  tilesContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#E8E8E8',
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  }
});