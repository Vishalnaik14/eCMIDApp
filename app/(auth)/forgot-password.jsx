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
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../hooks/useUser';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordResetEmail } = useUser();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const deviceType = getDeviceType();
  const headerSize = getHeaderSize();
  const formSizing = getFormSizing();
  const safeArea = getSafeAreaPadding();

  // Email validation function
  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };

  const handleResetPassword = async () => {
    // Validate email
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Success',
        'Password has been reset successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
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
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={responsiveWidth(26)} color="#ffffff" />
          </TouchableOpacity>
          <Text style={[styles.headerText, { fontSize: headerSize.fontSize }]} numberOfLines={1}>
            Forgot Password
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
              paddingTop: responsiveHeight(40),
              paddingHorizontal: safeArea.horizontal,
              paddingBottom: Platform.OS === 'android' ? responsiveHeight(100) : responsiveHeight(40),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Instructions */}
          <View style={[styles.instructionsContainer, { marginBottom: responsiveHeight(40) }]}>
            <Text style={[styles.instructionsText, { fontSize: responsiveFontSize(16) }]}>
              Enter your details to reset password
            </Text>
          </View>

          {/* Form Container */}
          <View style={[styles.formContainer, { marginBottom: responsiveHeight(30) }]}>
            {/* Email Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(30) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* New Password Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(30) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Enter Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                placeholder="Enter new password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputGroup, { marginBottom: responsiveHeight(30) }]}>
              <Text style={[styles.label, { fontSize: responsiveFontSize(14), marginBottom: responsiveHeight(10) }]}>
                Confirm Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingVertical: formSizing.padding / 1.5,
                    fontSize: formSizing.fontSize,
                  },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[
                styles.resetButton,
                { paddingVertical: responsiveHeight(16), marginTop: responsiveHeight(20) },
                loading && styles.resetButtonDisabled,
              ]}
              onPress={handleResetPassword}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[styles.resetButtonText, { fontSize: responsiveFontSize(16) }]}>
                  RESET PASSWORD 
                </Text>
              )}
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
    backgroundColor: '#1e9fd8',
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
    numberOfLines: 1,
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
  instructionsContainer: {
    marginBottom: 40,
  },
  instructionsText: {
    color: '#ffffff',
    textAlign: 'left',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 30,
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
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});