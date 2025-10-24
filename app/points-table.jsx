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
  ImageBackground,
  StatusBar,
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
          comments: 'Maximum two per year permitted',
          points: 2,
          displayInApp: true,
        },
        {
          id: '6',
          description: 'Purchase of an IIMS handy guide',
          comments: 'Maximum two per year permitted',
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

  const handleActivityPress = (activity) => {
    // No action on press - just allows touch feedback
    console.log('Activity pressed:', activity.id);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/img/bluebackgrounddark2.png')}
        style={[styles.container, { paddingTop: insets.top }]}
        resizeMode="cover"
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.5}
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
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        ) : (
          activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              activeOpacity={0.8}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.activityTitle}>
                    {activity.description}
                  </Text>
                  {activity.comments ? (
                    <Text style={styles.activitySubtitle}>
                      {activity.comments}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.pointsContainer}>
                  <View style={styles.pointsBadge}>
                    <Text style={styles.pointsNumber}>{activity.points}</Text>
                  </View>
                  <Text style={styles.pointsLabel}>
                    Point{activity.points > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1e9fd8',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: 'rgba(30, 159, 216, 0.9)',
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
    padding: 16,
    paddingBottom: 24,
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
    color: '#ffffff',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    display: 'none',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  pointsContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  pointsBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e9fd8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  pointsLabel: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },
});