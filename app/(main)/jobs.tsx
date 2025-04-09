import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Alert, ScrollView, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import TopBar from '@/components/topBar';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const jobCategories = [
    { id: 1, name: 'OFFICE' },
    { id: 2, name: 'FINANCE' },
    { id: 3, name: 'FOOD SERVICES' },
    { id: 4, name: 'ARTS' },
    { id: 5, name: 'MANUFACTURING' },
    { id: 6, name: 'I.T' },
    { id: 7, name: 'DESIGN' },
    { id: 8, name: 'MARKETING' },
  ];

  // Fetch jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsCollection = collection(db, 'jobs');
        const jobSnapshot = await getDocs(jobsCollection);
        const jobsList = jobSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setJobs(jobsList);
        setFilteredJobs(jobsList);
        setLoading(false);
        console.log("Fetched jobs:", jobsList);

      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query and selected category
  useEffect(() => {
    let result = jobs;
    
    // Filter by category if one is selected
    if (selectedCategory) {
      result = result.filter(job => 
        job.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(skill =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }
    
    setFilteredJobs(result);
  }, [searchQuery, selectedCategory, jobs]);

  const handleCategoryPress = (categoryName) => {
    if (selectedCategory === categoryName) {
      // If the same category is selected again, clear the filter
      setSelectedCategory(null);
    } else {
      // Otherwise set the selected category
      setSelectedCategory(categoryName);
    }
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'No new notifications at the moment.');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleJobPress = (job) => {
    router.navigate({
      pathname: '/job/[id]',
      params: { id: job.id }
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter jobs by type (recommended, trending, popular)
  const getRecommendedJobs = () => {
    return filteredJobs.filter(job => job.isRecommended === true).slice(0, 3);
  };

  const getTrendingJobs = () => {
    return filteredJobs.filter(job => job.isTrending === true).slice(0, 2);
  };

  const getPopularJobs = () => {
    return filteredJobs.filter(job => job.isPopular === true).slice(0, 4);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderJobCard = (job, size = 'normal') => {
    const isLarge = size === 'large';
    return (
      <TouchableOpacity 
        key={job.id} 
        style={isLarge ? styles.popularJobCard : styles.jobCard}
        onPress={() => handleJobPress(job)}
      >
        <Image 
          source={{ uri: job.imageUrl }} 
          style={isLarge ? styles.popularJobImage : styles.jobImage} 
        />
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E8F4EA" barStyle="dark-content" />
      <TopBar
        title="Jobs"
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color="#666"
            style={styles.clearIcon}
            onPress={clearSearch}
          />
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {jobCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonSelected
              ]}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Jobs */}
        {getRecommendedJobs().length > 0 && (
          <View style={styles.jobsSection}>
            <Text style={styles.sectionTitle}>Recommended Jobs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {getRecommendedJobs().map(job => renderJobCard(job))}
            </ScrollView>
          </View>
        )}

        {/* Trending Jobs */}
        {getTrendingJobs().length > 0 && (
          <View style={styles.jobsSection}>
            <Text style={styles.sectionTitle}>Trending Jobs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {getTrendingJobs().map(job => renderJobCard(job))}
            </ScrollView>
          </View>
        )}

        {/* Popular Jobs */}
        {getPopularJobs().length > 0 && (
          <View style={styles.jobsSection}>
            <Text style={styles.sectionTitle}>Popular Jobs</Text>
            <View style={styles.popularJobsGrid}>
              {getPopularJobs().map(job => renderJobCard(job, 'large'))}
            </View>
          </View>
        )}
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4EA',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  categoriesScroll: {
    maxHeight: 50,
    marginVertical: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryButtonSelected: {
    backgroundColor: '#2D6A4F',
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#333',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  jobsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D6A4F',
  },
  horizontalScroll: {
    marginLeft: -5,
  },
  jobCard: {
    width: 180,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
  },
  jobTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  popularJobsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularJobCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularJobImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
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
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginHorizontal: 24,
  },
});