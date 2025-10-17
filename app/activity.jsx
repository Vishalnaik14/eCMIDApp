import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function ActivityScreen() {
  const { navigateTo, goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/user/activities', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();
      // setActivities(data.activities);

      // Mock data for testing - Remove this when connecting to backend
      const mockActivities = [
        {
          id: 1,
          day: 'Sat',
          date: '6',
          month: 'Sep 2025',
          status: 'PENDING',
          title: 'Visiting a technical exhibition, or other recognised maritime related show.',
          description: 'This is a test. Please ignore. (Sep 2 2025 related show',
          points: 1,
          pointsLabel: 'Point',
        },
        {
          id: 2,
          day: 'Tue',
          date: '8',
          month: 'Apr 2025',
          status: 'REJECTED',
          title: 'Newly attained internal or external training, or completion of structured courses.',
          description: 'Testing by eDOT Please ignore. (Apr 7 2025 - Apr 8 2025)',
          points: 1,
          pointsLabel: 'Point',
        },
        {
          id: 3,
          day: 'Fri',
          date: '10',
          month: 'Jan 2025',
          status: 'APPROVED',
          title: 'Other forms of ad hoc CPD for items not listed will be considered and points awarded accordingly.',
          description: 'Testing by Edot Please ignore. (Jan 7 2025 - Jan 7 2025)',
          points: 1,
          pointsLabel: 'Point',
        },
        {
          id: 4,
          day: 'Fri',
          date: '10',
          month: 'Jan 2025',
          status: 'APPROVED',
          title: 'Subscription to a marine publication, journal or magazine.',
          description: 'This is a new test by Edot',
          points: 4,
          pointsLabel: 'Points',
        },
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const handleActivityPress = (activity) => {
    // TODO: Navigate to activity detail page or perform action
    console.log('Activity pressed:', activity.id);
    // navigateTo('/activity-detail', { activityId: activity.id });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'REJECTED':
        return styles.statusRejected;
      case 'APPROVED':
        return styles.statusApproved;
      default:
        return styles.statusPending;
    }
  };

  const renderActivityCard = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.activityCard}
      activeOpacity={0.7}
      onPress={() => handleActivityPress(activity)}
    >
      {/* Left section: Date */}
      <View style={styles.dateSection}>
        <Text style={styles.dayText}>{activity.day}</Text>
        <Text style={styles.dateText}>{activity.date}</Text>
        <Text style={styles.monthText}>{activity.month}</Text>
        <View style={[styles.statusBadge, getStatusStyle(activity.status)]}>
          <Text style={styles.statusText}>{activity.status}</Text>
        </View>
      </View>

      {/* Middle section: Activity details */}
      <View style={styles.detailsSection}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>

      {/* Right section: Points */}
      <View style={styles.pointsSection}>
        <Text style={styles.pointsValue}>{activity.points}</Text>
        <Text style={styles.pointsLabel}>{activity.pointsLabel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Activity</Text>
        <View style={styles.headerRight}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Activity List */}
      {isLoading && activities.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e9fd8" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyText}>No activities found</Text>
          <Text style={styles.emptySubtext}>
            Your CPD activities will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activities.map((activity) => renderActivityCard(activity))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e9fd8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e9fd8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerLogo: {
    width: 48,
    height: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 12,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateSection: {
    width: 80,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingRight: 12,
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  dateText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 4,
  },
  monthText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    width: '100%',
    maxWidth: 80,
  },
  statusPending: {
    backgroundColor: '#3b82f6',
  },
  statusRejected: {
    backgroundColor: '#ef4444',
  },
  statusApproved: {
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 20,
    textAlign: 'center',
  },
  activityDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
  },
  pointsSection: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 12,
    paddingVertical: 8,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e9fd8',
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});