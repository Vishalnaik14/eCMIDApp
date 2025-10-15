// hooks/useActivities.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function useActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const fetchActivities = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockActivities = [
        {
          id: '1',
          description: 'Subscription to a marine publication, journal or magazine',
          comments: 'Receipt of regular professional or industry updates.',
          points: 1,
        },
        {
          id: '2',
          description: 'Attendance at marine industry conference',
          comments: 'Minimum 4 hours attendance required.',
          points: 2,
        },
        {
          id: '3',
          description: 'Completion of online training course',
          comments: 'Certified course with assessment.',
          points: 3,
        },
        {
          id: '4',
          description: 'Professional development workshop',
          comments: 'Full day workshop attendance.',
          points: 4,
        },
      ];
      setActivities(mockActivities.sort((a, b) => a.points - b.points));
    } catch (err) {
      Alert.alert('Error', 'Failed to load activities.');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = () => {
    console.log('Pull to refresh triggered!');
    fetchActivities(true);
  };

  return { 
    activities, 
    isLoading, 
    isRefreshing, 
    onRefresh 
  };
}