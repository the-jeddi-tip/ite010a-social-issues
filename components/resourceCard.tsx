import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';

const ResourceCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Title:</Text>
          <Text style={styles.titleContent}>{item.title}</Text>
          
          <Text style={styles.description}>Description:</Text>
          <Text style={styles.descriptionContent} numberOfLines={3}>
            {item.description}
          </Text>
          
          <Text style={styles.tags}>Tags:</Text>
          <Text style={styles.tagsContent}>{item.tags.join(', ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleContent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  descriptionContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  tags: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  tagsContent: {
    fontSize: 12,
    color: '#666',
  },
});

export default ResourceCard;