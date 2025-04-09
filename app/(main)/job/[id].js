import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobDoc = doc(db, 'jobs', id);
        const jobSnapshot = await getDoc(jobDoc);
        
        if (jobSnapshot.exists()) {
          setJob({
            id: jobSnapshot.id,
            ...jobSnapshot.data()
          });
        } else {
          setError('Job not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleApply = () => {
    Alert.alert(
      'Apply for this position',
      'This feature is coming soon! Your application will be sent to the employer.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed')
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (error || !job) {
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
          <Text style={styles.errorText}>{error || 'Job not found'}</Text>
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
        <Text style={styles.headerTitle}>Job Details</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: job.imageUrl }} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {job.location}
          </Text>
          
          {job.skills && job.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionHeader}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
          
          {job.responsibilities && (
            <>
              <Text style={styles.sectionHeader}>Responsibilities</Text>
              <View style={styles.listContainer}>
                {job.responsibilities.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {job.requirements && (
            <>
              <Text style={styles.sectionHeader}>Requirements</Text>
              <View style={styles.listContainer}>
                {job.requirements.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {job.benefits && (
            <>
              <Text style={styles.sectionHeader}>Benefits</Text>
              <View style={styles.listContainer}>
                {job.benefits.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
          
          {/* Job Details Footer */}
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.footerText}>{job.jobType || 'Full-time'}</Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="cash-outline" size={18} color="#666" />
              <Text style={styles.footerText}>{job.salary || 'Competitive'}</Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.footerText}>Posted {job.postedDate || 'Recently'}</Text>
            </View>
          </View>
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
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 5,
  },
  company: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  skillBadge: {
    backgroundColor: '#4C956C',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1E7DD',
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: '#2D6A4F',
  },
  listItemText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
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