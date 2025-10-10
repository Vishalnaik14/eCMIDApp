import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';
import ThemedButton from '../components/ThemedButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ScoreScreen() {
  const { goBack, navigateTo } = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetMorePoints = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call or navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigateTo('/home');
    } catch (error) {
      console.error('Error getting more points:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigateTo]);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aldrige EDOT Solutions</Text>
        <View style={styles.headerRight}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Top Section - Current Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreNumber}>0</Text>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreDate}>8 July 2025 - Today</Text>
        </View>

        {/* Bottom Section - Required Points */}
        <View style={styles.targetSection}>
          <Text style={styles.targetText}>
            Points required to meet your target for the current accreditation year
          </Text>
          <Text style={styles.targetNumber}>10</Text>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <ThemedButton
          title="GET MORE POINTS!!"
          onPress={handleGetMorePoints}
          variant="primary"
          size="large"
          loading={isLoading}
          style={styles.getPointsButton}
        />
      </View>
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
    minHeight: 56,
  },
  backButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerLogo: {
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  scoreSection: {
    flex: 1,
    backgroundColor: '#347a8c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    minHeight: SCREEN_HEIGHT * 0.3,
  },
  scoreNumber: {
    fontSize: Math.min(72, SCREEN_WIDTH * 0.18),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '500',
  },
  scoreDate: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    color: '#ffffff',
    opacity: 0.9,
  },
  targetSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    minHeight: SCREEN_HEIGHT * 0.3,
  },
  targetText: {
    fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
    maxWidth: 500,
  },
  targetNumber: {
    fontSize: Math.min(64, SCREEN_WIDTH * 0.16),
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#1e9fd8',
  },
  getPointsButton: {
    letterSpacing: 1,
  },
});