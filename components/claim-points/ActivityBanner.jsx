// components/claim-points/ActivityBanner.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivityBanner({ activity }) {
  if (!activity) return null;

  return (
    <View style={styles.selectedActivityBanner}>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      <Text style={styles.activityComments}>{activity.comments}</Text>
      <Text style={styles.activityPoints}>
        {activity.points} Point{activity.points > 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedActivityBanner: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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