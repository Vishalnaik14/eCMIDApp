import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';

export default function AboutECMIDScreen() {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const openHelp = async () => {
    const url = 'https://www.marinesurveyingacademy.com';
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

      {/* Card with scrollable about text - now flexes to fill space */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>
            Welcome to the eCMID Continuing Professional Development Programme
          </Text>
        </View>
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={styles.cardScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.cardBodyText}>
            {/* Hardcoded placeholder text per instructions */}
            organisation, MSA is dedicated to providing the best quality marine skills-based
            training and accreditation.{"\n\n"}
            As the commercial arm of the Institute, MSA is able to call on a wide selection of
            members and other maritime specialist and experts, who have various skills and
            knowledge acquired over many years. On one level the aim of the MSA is to provide
            basic short course training for IIMS members and non-members in a range of subjects.
            At a higher level the MSA delivers training and examinations leading to formal
            accreditation and qualifications certified by the IIMS.{"\n\n"}
            The MSA is being developed to meet the growing demand from a number of international
            marine organisations for specialised skills-based training and accreditation schemes.
            MSA delivers these training solutions at various locations, using specialist tutors and
            examiners.{"\n\n"}
            For more information visit the website at http://marinesurveyingacademy.com
          </Text>
        </ScrollView>
      </View>

      {/* Help button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.helpButton} onPress={openHelp} activeOpacity={0.85}>
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
    fontSize: 13,
    color: '#444444',
    textAlign: 'center',
    fontWeight: '600',
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
    fontSize: 12.5,
    lineHeight: 18,
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