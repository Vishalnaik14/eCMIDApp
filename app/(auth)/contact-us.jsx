import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsivePadding,
  getHeaderSize,
  getFormSizing,
  getSafeAreaPadding,
  getDeviceType,
} from '../../utils/responsive';

export default function ContactUsScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  const deviceType = getDeviceType();
  const headerSize = getHeaderSize();
  const formSizing = getFormSizing();
  const safeArea = getSafeAreaPadding();

  const validate = () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !details.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    Alert.alert('Thank you', 'Your message has been sent.', [
      {
        text: 'OK',
        onPress: () => {
          setName('');
          setEmail('');
          setSubject('');
          setDetails('');
          // Redirect to login page
          router.push('/login');
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require('../../assets/img/bluebackgrounddark2.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={responsiveWidth(26)} color="#ffffff" />
          </TouchableOpacity>
          <Text style={[styles.headerText, { fontSize: headerSize.fontSize }]} numberOfLines={1}>
            Get In Touch
          </Text>
          <Image
            source={require('../../assets/img/ecmidlogoblack.png')}
            style={[styles.headerLogo, { width: headerSize.logoSize, height: headerSize.logoSize }]}
            resizeMode="contain"
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingTop: responsiveHeight(20),
              paddingHorizontal: safeArea.horizontal,
              paddingBottom: Platform.OS === 'android' ? responsiveHeight(100) : responsiveHeight(40),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { marginBottom: responsiveHeight(30) }]}>
            {/* Name Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(25) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Name:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="words"
                autoCorrect={false}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(25) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Email:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Subject Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(25) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Subject:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                placeholder="Enter subject"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="sentences"
                autoCorrect={false}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            {/* Details Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(25) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Please enter details:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                    minHeight: responsiveHeight(120),
                  },
                ]}
                placeholder="Enter your message details here"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="sentences"
                autoCorrect={false}
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={[styles.sendButton, { paddingVertical: responsiveHeight(16), marginTop: responsiveHeight(20) }]}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Text style={[styles.sendButtonText, { fontSize: responsiveFontSize(16) }]}>SEND</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? responsiveHeight(50) : responsiveHeight(40),
    paddingBottom: responsiveHeight(20),
    paddingHorizontal: responsivePadding(16),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: responsiveWidth(12),
  },
  backButton: {
    padding: responsiveWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: responsiveWidth(44),
    minHeight: responsiveWidth(44),
  },
  headerText: {
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerLogo: {
    resizeMode: 'contain',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: '400',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 0,
    color: '#ffffff',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: responsiveHeight(8),
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});