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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactUsScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  const validate = () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !details.trim()) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    Alert.alert('Thank you', 'Your message has been sent.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Get In Touch</Text>
        <Image
          source={require('../../assets/img/logo_light.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder=""
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Please enter details:</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder=""
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
            <Text style={styles.sendButtonText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e9fd8',
  },
  headerContainer: {
    backgroundColor: '#1e9fd8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
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
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: '400',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#ffffff',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 8,
    minHeight: 96,
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});


