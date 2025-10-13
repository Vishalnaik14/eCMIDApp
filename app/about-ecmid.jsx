import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function AboutECMIDScreen() {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();
  
  // State for dynamic content
  const [aboutData, setAboutData] = useState({
    title: 'Welcome to the eCMID Continuing Professional Development Programme',
    content: `organisation, MSA is dedicated to providing the best quality marine skills-based training and accreditation.

As the commercial arm of the Institute, MSA is able to call on a wide selection of members and other maritime specialist and experts, who have various skills and knowledge acquired over many years. On one level the aim of the MSA is to provide basic short course training for IIMS members and non-members in a range of subjects. At a higher level the MSA delivers training and examinations leading to formal accreditation and qualifications certified by the IIMS.

The MSA is being developed to meet the growing demand from a number of international marine organisations for specialised skills-based training and accreditation schemes. MSA delivers these training solutions at various locations, using specialist tutors and examiners.

For more information visit the website at `,
    websiteUrl: 'http://marinesurveyingacademy.com',
    helpUrl: 'http://ecmid.iims.org.uk/ecmidWeb/Public/apphelp.aspx',
    lastUpdated: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch content from API
  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/about-ecmid');
      // const data = await response.json();
      
      // Example API response structure:
      // {
      //   title: "Welcome to the eCMID Continuing Professional Development Programme",
      //   content: "Full content text here...",
      //   websiteUrl: "http://marinesurveyingacademy.com",
      //   helpUrl: "https://www.marinesurveyingacademy.com",
      //   lastUpdated: "2025-10-11T10:00:00Z"
      // }
      
      // Uncomment when API is ready:
      // setAboutData({
      //   title: data.title || aboutData.title,
      //   content: data.content || aboutData.content,
      //   websiteUrl: data.websiteUrl || aboutData.websiteUrl,
      //   helpUrl: data.helpUrl || aboutData.helpUrl,
      //   lastUpdated: data.lastUpdated,
      // });
      
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError('Failed to load content. Showing cached version.');
      // Keep using default/cached data
    } finally {
      setIsLoading(false);
    }
  };

  const openWebsite = async () => {
    const url = aboutData.websiteUrl;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (e) {
      console.warn('Failed to open website URL:', e);
    }
  };

  const openHelp = async () => {
    const url = aboutData.helpUrl;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
    } catch (e) {
      console.warn('Failed to open help URL', e);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/bluebackgrounddark2.png')}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About eCMID CPD</Text>
        <Image
          source={require('../assets/img/ecmidlogoblack.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Card with scrollable about text */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>
            {aboutData.title}
          </Text>
          {aboutData.lastUpdated && (
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(aboutData.lastUpdated).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="warning" size={16} color="#ffcc00" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <Text style={styles.cardBodyText}>
              {aboutData.content}
              <TouchableOpacity onPress={openWebsite} activeOpacity={0.7}>
                <Text style={styles.websiteLink}>
                  {aboutData.websiteUrl}
                </Text>
              </TouchableOpacity>
            </Text>
          </ScrollView>
        )}
      </View>

      {/* Help button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.helpButton} 
          onPress={openHelp} 
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text style={styles.helpButtonText}>HELP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#1e9fd8',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginLeft: -20,
  },
  headerLogo: {
    width: 48,
    height: 48,
  },
  card: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  cardHeader: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cardHeaderText: {
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
    fontWeight: '600',
  },
  lastUpdatedText: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  cardScroll: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardScrollContent: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  cardBodyText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
  },
  websiteLink: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  errorText: {
    color: '#ffcc00',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  helpButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 14,
  },
  helpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});