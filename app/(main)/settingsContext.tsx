import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our accessibility settings
interface AccessibilitySettings {
  fontSize: number;
  colorScheme: 'default' | 'dark' | 'lightGreen';
  highContrast: boolean;
  textToSpeech: boolean;
  colorBlindnessMode: 'none' | 'redGreen' | 'blueYellow';
  reduceMotion: boolean;
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  colorScheme: 'default',
  highContrast: false,
  textToSpeech: false,
  colorBlindnessMode: 'none',
  reduceMotion: false,
};

// Create a context with settings and update function
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  isLoading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  isLoading: true,
});

// Provider component for wrapping the app
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Function to update settings
  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      await AsyncStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);