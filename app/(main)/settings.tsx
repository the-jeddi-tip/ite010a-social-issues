import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import TopBar from '@/components/topBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccessibilitySettings() {
  const router = useRouter();

  // State for settings
  const [fontSize, setFontSize] = useState(16);
  const [colorScheme, setColorScheme] = useState('default');
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [colorBlindnessMode, setColorBlindnessMode] = useState('none');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        // Try to load from Firebase if user is logged in
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().accessibilitySettings) {
            const settings = userSnap.data().accessibilitySettings;
            setFontSize(settings.fontSize || 16);
            setColorScheme(settings.colorScheme || 'default');
            setHighContrast(settings.highContrast || false);
            setTextToSpeech(settings.textToSpeech || false);
            setColorBlindnessMode(settings.colorBlindnessMode || 'none');
            setReduceMotion(settings.reduceMotion || false);
          } else {
            // If no settings in Firebase, try to load from AsyncStorage
            await loadFromLocalStorage();
          }
        } else {
          // No user logged in, load from AsyncStorage
          await loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
        Alert.alert('Error', 'Failed to load accessibility settings.');
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setFontSize(settings.fontSize || 16);
          setColorScheme(settings.colorScheme || 'default');
          setHighContrast(settings.highContrast || false);
          setTextToSpeech(settings.textToSpeech || false);
          setColorBlindnessMode(settings.colorBlindnessMode || 'none');
          setReduceMotion(settings.reduceMotion || false);
        }
      } catch (error) {
        console.error('Error loading from AsyncStorage:', error);
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

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const settings = {
        fontSize,
        colorScheme,
        highContrast,
        textToSpeech,
        colorBlindnessMode,
        reduceMotion
      };

      // Save to AsyncStorage for all users
      await AsyncStorage.setItem('accessibilitySettings', JSON.stringify(settings));

      // Save to Firebase if user is logged in
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          accessibilitySettings: settings,
          uiPreferences: `Font Size: ${fontSize}, Color Scheme: ${colorScheme}, Color Blindness: ${colorBlindnessMode}` +
            `${textToSpeech ? ', Text-to-Speech Enabled' : ''}` +
            `${highContrast ? ', High Contrast Mode' : ''}` +
            `${reduceMotion ? ', Reduced Motion' : ''}`
        });
      }

      Alert.alert('Success', 'Accessibility settings saved successfully!');

      // Apply the settings throughout the app
      applySettings();

    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save accessibility settings.');
    }
  };

  const applySettings = () => {
    // This function would implement the actual style changes 
    // For a complete implementation, you would need a context provider
    console.log('Applying settings throughout the app');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'No new notifications at the moment.');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  // Custom slider component implementation to replace the external dependency
  const CustomSlider = ({ value, onValueChange, min, max }) => {
    const steps = [min, min + (max - min) / 4, min + 2 * (max - min) / 4, min + 3 * (max - min) / 4, max];

    return (
      <View style={styles.customSliderContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sliderButton,
              value >= step && styles.sliderButtonActive
            ]}
            onPress={() => onValueChange(step)}
          />
        ))}
      </View>
    );
  };

  const renderColorSchemeOption = (name, value, color1, color2) => (
    <TouchableOpacity
      style={[
        styles.colorSchemeOption,
        colorScheme === value && styles.selectedOption,
        { backgroundColor: color1 }
      ]}
      onPress={() => setColorScheme(value)}
    >
      <View style={[styles.colorSample, { backgroundColor: color1 }]}>
        <Text style={[styles.sampleText, { color: color2 }]}>Aa</Text>
      </View>
      <Text style={styles.optionLabel}>{name}</Text>
    </TouchableOpacity>
  );

  const renderColorBlindnessOption = (name, value, icon) => (
    <TouchableOpacity
      style={[
        styles.colorBlindnessOption,
        colorBlindnessMode === value && styles.selectedOption
      ]}
      onPress={() => setColorBlindnessMode(value)}
    >
      <View style={styles.colorBlindnessImage}>
        <Ionicons name={icon} size={36} color="#2D6A4F" />
      </View>
      <Text style={styles.optionLabel}>{name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size='large' color='#4C956C' />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        title="Accessibility Settings"
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        profilePicture={profilePicture}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Font Size Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Size</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>A</Text>
            <CustomSlider
              min={12}
              max={24}
              value={fontSize}
              onValueChange={setFontSize}
            />
            <Text style={[styles.sliderLabel, { fontSize: 24 }]}>A</Text>
          </View>
          <Text style={[styles.sampleText, { fontSize: fontSize }]}>
            Sample text at size {fontSize}
          </Text>

          <View style={styles.fontSizeButtons}>
            <TouchableOpacity
              style={styles.fontSizeButton}
              onPress={() => setFontSize(Math.max(12, fontSize - 1))}
            >
              <Text style={styles.fontSizeButtonText}>Smaller</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fontSizeButton}
              onPress={() => setFontSize(Math.min(24, fontSize + 1))}
            >
              <Text style={styles.fontSizeButtonText}>Larger</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Scheme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Scheme</Text>
          <View style={styles.optionsContainer}>
            {renderColorSchemeOption('Default', 'default', '#FFFFFF', '#2D6A4F')}
            {renderColorSchemeOption('Dark', 'dark', '#333333', '#FFFFFF')}
            {renderColorSchemeOption('Light Green', 'lightGreen', '#E8F4EA', '#2D6A4F')}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>High Contrast Mode</Text>
            <Switch
              trackColor={{ false: "#d3d3d3", true: "#4C956C" }}
              thumbColor={highContrast ? "#FFFFFF" : "#f4f3f4"}
              ios_backgroundColor="#d3d3d3"
              onValueChange={setHighContrast}
              value={highContrast}
            />
          </View>
        </View>

        {/* Color Blindness Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Blindness Settings</Text>
          <View style={styles.optionsContainer}>
            {renderColorBlindnessOption('None', 'none', 'eye-outline')}
            {renderColorBlindnessOption('Red-Green', 'redGreen', 'contrast-outline')}
            {renderColorBlindnessOption('Blue-Yellow', 'blueYellow', 'contrast')}
          </View>
        </View>

        {/* Text-to-Speech Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading & Media</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Text-to-Speech</Text>
            <Switch
              trackColor={{ false: "#d3d3d3", true: "#4C956C" }}
              thumbColor={textToSpeech ? "#FFFFFF" : "#f4f3f4"}
              ios_backgroundColor="#d3d3d3"
              onValueChange={setTextToSpeech}
              value={textToSpeech}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Reduce Motion</Text>
            <Switch
              trackColor={{ false: "#d3d3d3", true: "#4C956C" }}
              thumbColor={reduceMotion ? "#FFFFFF" : "#f4f3f4"}
              ios_backgroundColor="#d3d3d3"
              onValueChange={setReduceMotion}
              value={reduceMotion}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {/* Bottom space */}
        <View style={styles.bottomSpace}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4EA",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#2D6A4F",
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  customSliderContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 5,
  },
  sliderButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDD',
  },
  sliderButtonActive: {
    backgroundColor: '#4C956C',
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  sampleText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  fontSizeButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  fontSizeButtonText: {
    color: '#2D6A4F',
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  colorSchemeOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 90,
  },
  colorBlindnessOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 100,
  },
  selectedOption: {
    borderColor: '#4C956C',
  },
  colorSample: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBlindnessImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  optionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: "#4C956C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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