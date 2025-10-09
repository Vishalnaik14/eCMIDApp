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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../hooks/useUser';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by index.jsx based on auth state
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.signInText}>Sign in</Text>
        </View>

        {/* Logos */}
        <View style={styles.logosContainer}>
          <Image
            source={require('../../assets/img/logo_dark.png')}
            style={styles.ecmidLogo}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/img/logo_light.png')}
            style={styles.airlineLogo}
            resizeMode="contain"
          />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>
              FORGOT PASSWORD? <Text style={styles.clickHereLink}>Click Here</Text>
            </Text>
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footerLinksContainer}>
            <TouchableOpacity onPress={() => openLink('https://example.com/terms')}>
              <Text style={styles.footerLink}>Terms & Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>    </Text>
            <TouchableOpacity onPress={() => openLink('https://example.com/privacy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Copyright - Fixed at bottom */}
      <View style={styles.copyrightContainer}>
        <TouchableOpacity onPress={handleContactUs}>
          <Text style={styles.contactLink}>Copyright © 2025 | Contact Us</Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  headerContainer: {
    backgroundColor: '#1e9fd8',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  signInText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  ecmidLogo: {
    width: 80,
    height: 80,
  },
  airlineLogo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#1e9fd8',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 12,
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footerLink: {
    fontSize: 12,
    color: '#1e9fd8',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#999',
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  contactLink: {
    fontSize: 12,
    color: '#666',
  },
});