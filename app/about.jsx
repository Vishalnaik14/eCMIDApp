import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openWebsite = async () => {
    const url = 'https://www.edot-solutions.com';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (err) {
      console.warn('Failed to open URL:', err);
    }
  };

  const openEmail = async () => {
    const email = 'contact@edot-solutions.com';
    const url = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open email:', email);
      }
    } catch (err) {
      console.warn('Failed to open email:', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ImageBackground
        source={require('../assets/img/bluebackgrounddark2.png')}
        style={[styles.backgroundImage, { paddingTop: insets.top }]}
        resizeMode="cover"
      >
        {/* Blue Header Bar */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>About App</Text>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        {/* Content Area */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Center Logo */}
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.centerLogo}
            resizeMode="contain"
          />

          {/* App Version Section */}
          <View style={styles.section}>
            <Text style={styles.appTitle}>eCMID App Version</Text>
            <Text style={styles.appVersion}>v1.0.16</Text>
          </View>

          {/* Developed By Section */}
          <View style={styles.section}>
            <Text style={styles.developedByTitle}>Developed By</Text>
            <Text style={styles.developedByName}>eDOT Solutions</Text>
            <TouchableOpacity onPress={openWebsite} activeOpacity={0.8}>
              <Text style={styles.websiteLink}>www.edot-solutions.com</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openEmail} activeOpacity={0.8} style={styles.emailContainer}>
              <Text style={styles.emailLink}>contact@edot-solutions.com</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#1e9fd8',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginLeft: -29,
  },
  headerLogo: {
    width: 56,
    height: 56,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 90,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  centerLogo: {
    width: 180,
    height: 180,
    marginTop: 80,
  },
  section: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  appVersion: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.95,
  },
  developedByTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  developedByName: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 6,
  },
  websiteLink: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  emailContainer: {
    marginTop: 8,
  },
  emailLink: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});