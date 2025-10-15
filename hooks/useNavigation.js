import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Custom hook for navigation with error handling
export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = useCallback((route, options) => {
    try {
      if (options?.replace) {
        router.replace(route);
      } else {
        router.push(route);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to navigate. Please try again.');
    }
  }, [router]);

  const goBack = useCallback(() => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/home');
      }
    } catch (error) {
      console.error('Back navigation error:', error);
      router.replace('/home');
    }
  }, [router]);

  return {
    navigateTo,
    goBack,
    router
  };
};

export default useNavigation;