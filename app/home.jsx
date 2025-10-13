import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function HomeScreen() {
  const { navigateTo } = useNavigation();
  const insets = useSafeAreaInsets();

  // State for dynamic user data
  const [userData, setUserData] = useState({
    companyName: 'Aldrige EDOT Solutions',
    score: 0,
    userId: null,
  });
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [scoreError, setScoreError] = useState(null);

  // Fetch user score on component mount
  useEffect(() => {
    fetchUserScore();
  }, []);

  const fetchUserScore = async () => {
    setIsLoadingScore(true);
    setScoreError(null);

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/user/score', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Example API response structure:
      // {
      //   companyName: "Aldrige EDOT Solutions",
      //   score: 0,
      //   userId: "12345",
      //   lastUpdated: "2025-10-11T10:00:00Z"
      // }

      // Uncomment when API is ready:
      // setUserData({
      //   companyName: data.companyName || userData.companyName,
      //   score: data.score ?? 0,
      //   userId: data.userId,
      // });

      // Simulate API call for testing (remove this in production)
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // setUserData(prev => ({ ...prev, score: 0 }));

    } catch (err) {
      console.error('Error fetching user score:', err);
      setScoreError('Failed to load score');
      // Keep using default/cached data
    } finally {
      setIsLoadingScore(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you really want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigateTo('/login', { replace: true }),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const tiles = [
    { key: 'claim', label: 'Claim Points', icon: 'gift-outline', onPress: () => navigateTo('/claim-points') },
    { key: 'activity', label: 'My Activity', icon: 'document-text-outline', onPress: () => navigateTo('/activity') },
    { key: 'points-table', label: 'Points Table', icon: 'calendar-outline', onPress: () => navigateTo('/points-table') },
    { key: 'about-ecmid', label: 'About eCMID', icon: 'reader-outline', isImage: true, onPress: () => navigateTo('/about-ecmid') },
    { key: 'about-app', label: 'About App', icon: 'information-outline', onPress: () => navigateTo('/about') },
    { key: 'logout', label: 'Logout', icon: 'log-out-outline', onPress: handleLogout },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header card: User's points */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.headerTextBlock}>
            <Text style={styles.companyName}>
              {userData.companyName}
            </Text>
            <View style={styles.scoreContainer}>
              {isLoadingScore ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#666666" />
                  <Text style={styles.pointsText}>Loading score...</Text>
                </View>
              ) : (
                <Text style={styles.pointsText}>
                  Your eCMID CPD Score is {userData.score}
                </Text>
              )}
              {scoreError && (
                <TouchableOpacity 
                  onPress={fetchUserScore}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="refresh" size={16} color="#ff6b6b" style={styles.refreshIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => navigateTo('/score')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#999999" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Grid tiles with background image */}
      <ImageBackground
        source={require('../assets/img/bluebackgrounddark2.png')}
        style={styles.gridContainer}
        resizeMode="cover"
      >
        <View style={styles.grid}>
          {tiles.map((t, idx) => {
          const isLeft = idx % 2 === 0;
          const isFirstRow = idx < 2;
          
          return (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.tile, 
                isLeft ? styles.tileLeft : styles.tileRight, 
                !isFirstRow && styles.tileTop
              ]}
              activeOpacity={0.8}
              onPress={t.onPress}
            >
              <View style={styles.tileContent}>
                {t.isImage ? (
                  <Image
                    source={require('../assets/img/aboutecmid.png')}
                    style={styles.tileImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons 
                    name={t.icon} 
                    size={56} 
                    color="#ffffff" 
                    style={styles.tileIcon} 
                  />
                )}
                <Text style={styles.tileLabel}>
                  {t.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e9fd8',
  },
  headerCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 56,
    height: 56,
    marginRight: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  companyName: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#666666',
    fontSize: 13,
    marginLeft: 6,
  },
  refreshIcon: {
    marginLeft: 8,
  },
  gridContainer: {
    flex: 1,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: '50%',
    height: '33.333%',
    borderColor: '#ffffff',
    borderRightWidth: 0.5,
  },
  tileLeft: {
    borderLeftWidth: 0,
  },
  tileRight: {
    borderLeftWidth: 1.5,
  },
  tileTop: {
    borderTopWidth: 1.5,
  },
  tileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tileIcon: {
    marginBottom: 12,
  },
  tileImage: {
    width: 56,
    height: 56,
    marginBottom: 12,
    tintColor: '#ffffff',
  },
  tileLabel: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});