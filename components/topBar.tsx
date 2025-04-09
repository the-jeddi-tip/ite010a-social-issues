// components/TopBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TopBarProps {
  title?: string;
  showBackButton?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title = 'ReachOut',
  showBackButton = false,
  showNotification = true,
  showProfile = true,
  onNotificationPress,
  onProfilePress,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#2D6A4F" />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={onNotificationPress}
            >
              <Ionicons name="notifications-outline" size={24} color="#2D6A4F" />
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={onProfilePress}
            >
              <View style={styles.profileCircle} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#E8F4EA',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#E8F4EA',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2D6A4F',
    fontFamily: 'serif', // This appears to match the ReachOut logo style
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 10,
  },
  profileButton: {
    padding: 2,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CCCCCC', // Default gray, you can change or make it an image
    borderWidth: 1,
    borderColor: '#DADADA',
  },
});

export default TopBar;