import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';
import ThemedButton from '../components/ThemedButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive font sizing
const getFontSize = (baseSize) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = baseSize * scale;
  return Math.round(Math.min(Math.max(newSize, baseSize * 0.8), baseSize * 1.2));
};

export default function ScoreScreen() {
  const { goBack, navigateTo } = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic user data state
  const [userData, setUserData] = useState({
    userName: 'Vishal Naik',
    companyName: 'EDOT Solutions',
    currentScore: 0,
    targetScore: 10,
    scoreStartDate: '8 July 2025',
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoadingData(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserData({
        userName: 'Vishal Naik',
        companyName: 'EDOT Solutions',
        currentScore: 0,
        targetScore: 10,
        scoreStartDate: '8 July 2025',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGetMorePoints = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigateTo('/claim-points');
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1e9fd8"
        translucent={false}
      />
      
      {/* Header with User Name and Company */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          {isLoadingData ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.headerUserName} numberOfLines={1}>
                {userData.userName}
              </Text>
              <Text style={styles.headerCompanyName} numberOfLines={1}>
                {userData.companyName}
              </Text>
            </>
          )}
        </View>
        
        <View style={styles.headerRight}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Main Content - Two equal sections */}
      <View style={styles.content}>
        {/* Top Section - Current Score */}
        <View style={styles.scoreSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.scoreNumber, { fontSize: getFontSize(72) }]}>
              {userData.currentScore}
            </Text>
            <Text style={[styles.scoreLabel, { fontSize: getFontSize(18) }]}>
              Your Score
            </Text>
            <Text style={[styles.scoreDate, { fontSize: getFontSize(14) }]}>
              {userData.scoreStartDate} - Today
            </Text>
          </View>
        </View>

        {/* Bottom Section - Required Points */}
        <View style={styles.targetSection}>
          <View style={styles.sectionContent}>
            <Text style={[styles.targetText, { fontSize: getFontSize(16) }]}>
              Points required to meet your target for the current accreditation year
            </Text>
            <Text style={[styles.targetNumber, { fontSize: getFontSize(64) }]}>
              {userData.targetScore}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={[
        styles.buttonContainer, 
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}>
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
    minHeight: 60,
  },
  backButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minHeight: 44,
  },
  headerUserName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  headerCompanyName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
  },
  headerRight: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  scoreSection: {
    flex: 1,
    backgroundColor: '#347a8c',
    width: '100%',
    minHeight: 0,
  },
  targetSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    minHeight: 0,
  },
  sectionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scoreNumber: {
    fontWeight: Platform.select({
      ios: '700',
      android: 'bold',
      default: 'bold',
    }),
    color: '#ffffff',
    marginBottom: 8,
  },
  scoreLabel: {
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '500',
  },
  scoreDate: {
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  targetText: {
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
    maxWidth: Platform.select({
      web: 500,
      default: SCREEN_WIDTH - 40,
    }),
  },
  targetNumber: {
    fontWeight: Platform.select({
      ios: '700',
      android: 'bold',
      default: 'bold',
    }),
    color: '#333333',
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#1e9fd8',
  },
  getPointsButton: {
    letterSpacing: 1,
    minHeight: 48,
  },
});