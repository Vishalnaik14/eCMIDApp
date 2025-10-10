import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function HomeScreen() {
  const { navigateTo } = useNavigation();
  const insets = useSafeAreaInsets();

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
    { key: 'claim', label: 'Claim Points', icon: 'gift-outline', onPress: () => {} },
    { key: 'activity', label: 'My Activity', icon: 'document-text-outline', onPress: () => {} },
    { key: 'points-table', label: 'Points Table', icon: 'calendar-outline', onPress: () => {} },
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
              Aldrige EDOT Solutions
            </Text>
            <Text style={styles.pointsText}>
              Your eCMID CPD Score is  0
            </Text>
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
  pointsText: {
    color: '#666666',
    fontSize: 13,
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