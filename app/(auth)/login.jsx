import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  responsivePadding,
  getDeviceType,
  getFormSizing,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
} from '../../utils/responsive';
// import { useUser } from '../../hooks/useUser';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get responsive values
  const deviceType = getDeviceType();
  const formSizing = getFormSizing();

  const handleLogin = async () => {
    // Basic validation - only check if fields are empty
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmailFormat = emailRegex.test(trimmedEmail);

    if (!isValidEmailFormat) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    // Simulated API call for testing
    setTimeout(() => {
      setLoading(false);
      // Email is valid format, allow login
      router.replace('/home');
    }, 600);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err)
    );
  };

  const handleContactUs = () => {
    router.push('/(auth)/contact-us');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={[styles.headerContainer, { 
            paddingVertical: responsivePadding(20),
            minHeight: responsiveHeight(80)
          }]}>
            <Text style={[styles.signInText, { fontSize: responsiveFontSize(24) }]}>
              Sign in
            </Text>
          </View>

          {/* Logos */}
          <View style={[styles.logosContainer, { 
            marginBottom: responsivePadding(40),
            paddingHorizontal: responsivePadding(20)
          }]}>
            <Image
              source={require('../../assets/img/ecmidlogoblack.png')}
              style={[styles.ecmidLogo, { 
                width: responsiveWidth(110), 
                height: responsiveHeight(110) 
              }]}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/img/logo_iims.png')}
              style={[styles.airlineLogo, { 
                width: responsiveWidth(110), 
                height: responsiveHeight(90) 
              }]}
              resizeMode="contain"
            />
          </View>

          {/* Form Container */}
          <View style={[styles.formContainer, { 
            paddingHorizontal: formSizing.padding,
            marginBottom: responsivePadding(30)
          }]}>
            {/* Email Input */}
            <View style={[styles.inputGroup, { marginBottom: responsivePadding(20) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14) }]}>
                Email Address
              </Text>
              <TextInput
                style={[styles.input, { 
                  height: formSizing.inputHeight,
                  fontSize: formSizing.fontSize,
                  borderRadius: formSizing.borderRadius
                }]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                selectTextOnFocus={true}
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputGroup, { marginBottom: responsivePadding(20) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14) }]}>
                Password
              </Text>
              <TextInput
                style={[styles.input, { 
                  height: formSizing.inputHeight,
                  fontSize: formSizing.fontSize,
                  borderRadius: formSizing.borderRadius
                }]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                selectTextOnFocus={true}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled, {
                paddingVertical: responsivePadding(16),
                borderRadius: formSizing.borderRadius,
                marginTop: responsivePadding(10),
                marginBottom: responsivePadding(20)
              }]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size={responsiveWidth(20)} />
              ) : (
                <Text style={[styles.loginButtonText, { fontSize: responsiveFontSize(16) }]}>
                  LOGIN
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={[styles.forgotPasswordContainer, { marginBottom: responsivePadding(10) }]}
              disabled={loading}
            >
              <Text style={[styles.forgotPasswordText, { fontSize: responsiveFontSize(12) }]}>
                FORGOT PASSWORD? <Text style={styles.clickHereLink}>Click Here</Text>
              </Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View style={[styles.footerLinksContainer, { 
              marginBottom: responsivePadding(20),
              paddingHorizontal: responsivePadding(20)
            }]}>
              <TouchableOpacity onPress={() => openLink('https://www.iims.org.uk/knowledge-centre/terms-and-conditions/')}>
                <Text style={[styles.footerLink, { fontSize: responsiveFontSize(12) }]}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
              <Text style={[styles.footerSeparator, { fontSize: responsiveFontSize(12) }]}>    </Text>
              <TouchableOpacity onPress={() => openLink('https://www.iims.org.uk/knowledge-centre/privacy-policy/')}>
                <Text style={[styles.footerLink, { fontSize: responsiveFontSize(12) }]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Copyright - Fixed at bottom */}
      <View style={[styles.copyrightContainer, { 
        paddingBottom: insets.bottom,
        paddingVertical: responsivePadding(15),
        paddingHorizontal: responsivePadding(20)
      }]}>
        <TouchableOpacity onPress={handleContactUs}>
          <Text style={[styles.contactLink, { fontSize: responsiveFontSize(12) }]}>
            Copyright © 2025 | Contact Us
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: responsivePadding(20),
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: '#1e9fd8',
    alignItems: 'center',
    marginBottom: responsivePadding(30),
  },
  signInText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ecmidLogo: {},
  airlineLogo: {},
  formContainer: {
    flex: 1,
  },
  inputGroup: {},
  label: {
    color: '#999',
    marginBottom: responsivePadding(8),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: responsivePadding(12),
    paddingHorizontal: 0,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#1e9fd8',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#999',
  },
  clickHereLink: {
    color: '#1e9fd8',
    fontWeight: '600',
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    color: '#1e9fd8',
  },
  footerSeparator: {
    color: '#999',
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  contactLink: {
    color: '#666',
    textAlign: 'center',
  },
});