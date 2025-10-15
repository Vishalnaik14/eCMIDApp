// components/claim-points/ActivityCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityCard({ activity, onPress }) {
  return (
    <TouchableOpacity style={styles.activityCard} onPress={onPress}>
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityComments}>{activity.comments}</Text>
        <Text style={styles.activityPoints}>
          {activity.points} Point{activity.points > 1 ? 's' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  activityComments: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e9fd8',
  },
});