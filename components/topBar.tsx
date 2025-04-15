// topBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TopBar({ title, onNotificationPress, onProfilePress, profilePicture }) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.icon}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require('../assets/defaultProfile.png') // fallback image
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#e4f5e7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
