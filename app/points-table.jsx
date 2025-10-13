import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function PointsTableScreen() {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch activities from API
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/activities?displayInApp=true');
      // const data = await response.json();

      // Example API response structure:
      // {
      //   activities: [
      //     {
      //       id: "1",
      //       description: "Subscription to a marine publication, journal or magazine",
      //       comments: "Receipt of regular professional or industry updates.",
      //       points: 1,
      //       displayInApp: true
      //     }
      //   ]
      // }

      // Mock data for now (remove when API is ready)
      const mockActivities = [
        {
          id: '1',
          description: 'Other forms of ad hoc CPD for items not listed will be considered and points awarded accordingly',
          comments: 'Details will be required and up to 4 points may be awarded',
          points: 4,
          displayInApp: true,
        },
        {
          id: '2',
          description: 'Subscription to a marine publication, journal or magazine',
          comments: 'Receipt of regular professional or industry updates. Maximum two per year permitted',
          points: 1,
          displayInApp: true,
        },
        {
          id: '3',
          description: 'Visiting a technical exhibition, or other recognised maritime related show',
          comments: 'Maximum two per year permitted',
          points: 1,
          displayInApp: true,
        },
        {
          id: '4',
          description: 'Attendance at an appropriate marine industry networking event',
          comments: 'Maximum two per year permitted',
          points: 1,
          displayInApp: true,
        },
        {
          id: '5',
          description: 'Researching a relevant technical subject, seeking advice on technical helplines or viewing relevant online videos',
          comments: '',
          points: 2,
          displayInApp: true,
        },
        {
          id: '6',
          description: 'Purchase of an IIMS handy guide',
          comments: '',
          points: 2,
          displayInApp: true,
        },
        {
          id: '7',
          description: 'Attendance at marine industry conference',
          comments: 'Minimum 4 hours attendance required',
          points: 2,
          displayInApp: true,
        },
        {
          id: '8',
          description: 'Completion of online training course',
          comments: 'Certified course with assessment',
          points: 3,
          displayInApp: true,
        },
        {
          id: '9',
          description: 'Professional development workshop',
          comments: 'Full day workshop attendance',
          points: 4,
          displayInApp: true,
        },
      ];

      // Sort by points (1-4 first)
      const sortedActivities = mockActivities.sort((a, b) => a.points - b.points);
      setActivities(sortedActivities);

    } catch (err) {
      console.error('Error fetching activities:', err);
      Alert.alert('Error', 'Failed to load activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points Table</Text>
        <View style={styles.headerRight}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Activities List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e9fd8" />
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        ) : (
          activities.map((activity, index) => (
            <View
              key={activity.id}
              style={[
                styles.activityCard,
                index === 0 && styles.firstCard
              ]}
            >
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                {activity.comments ? (
                  <Text style={styles.activityComments}>
                    {activity.comments}
                  </Text>
                ) : null}
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsNumber}>{activity.points}</Text>
                <Text style={styles.pointsLabel}>
                  Point{activity.points > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e9fd8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  firstCard: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  activityContent: {
    flex: 1,
    marginRight: 16,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 20,
  },
  activityComments: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginTop: 4,
  },
  pointsBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e9fd8',
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e9fd8',
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e9fd8',
    textTransform: 'capitalize',
  },
});