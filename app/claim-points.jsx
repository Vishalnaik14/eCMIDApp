// app/claim-points.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ThemedDatePicker from '../components/ThemedDatePicker';

// Import custom components
import Header from '../components/claim-points/Header';
import ActivityCard from '../components/claim-points/ActivityCard';
import ActivityBanner from '../components/claim-points/ActivityBanner';
import AttachmentSection from '../components/claim-points/AttachmentSection';
import AttachmentModal from '../components/claim-points/AttachmentModal';

// Import custom hooks
import useActivities from '../hooks/useActivities';
import useFilePicker from '../hooks/useFilePicker';
import useDateValidation from '../hooks/useDateValidation';

export default function ClaimPointsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef(null);

  // Custom hooks
  const { activities, isLoading: loadingActivities } = useActivities();
  const { attachment, pickImage, pickDocument, clearAttachment } = useFilePicker();
  const { startDate, endDate, handleStartDateChange, handleEndDateChange, resetDates } = useDateValidation();

  // Local state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityList, setShowActivityList] = useState(true);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');

  const handleReset = () => {
    clearAttachment();
    resetDates();
    setDescription('');
  };

  const handleSend = async () => {
    if (!attachment || !startDate || !endDate || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Your points claim has been submitted!', [
        { 
          text: 'OK', 
          onPress: () => { 
            handleReset(); 
            router.back(); 
          } 
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit claim.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowActivityList(false);
  };

  const handleBackToList = () => {
    handleReset();
    setShowActivityList(true);
    setSelectedActivity(null);
  };

  const handleAttachmentModalCamera = async () => {
    setShowAttachmentModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    pickImage('camera');
  };

  const handleAttachmentModalGallery = async () => {
    setShowAttachmentModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    pickImage('gallery');
  };

  const handleAttachmentModalDocument = async () => {
    setShowAttachmentModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    pickDocument();
  };

  // Activity List View
  if (showActivityList) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header 
          title="Claim Points" 
          onBack={() => router.back()} 
          showLogo 
        />

        <ScrollView contentContainerStyle={styles.activitiesContent}>
          {loadingActivities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e9fd8" />
            </View>
          ) : (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivitySelect(activity)}
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Claim Form View
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header 
        title="Claim Your Points" 
        onBack={handleBackToList} 
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Selected Activity Banner */}
          <ActivityBanner activity={selectedActivity} />

          {/* Attachment Section */}
          <AttachmentSection
            attachment={attachment}
            onAttach={() => setShowAttachmentModal(true)}
            onRemove={clearAttachment}
          />

          {/* Date Pickers */}
          <ThemedDatePicker
            value={startDate}
            onDateChange={handleStartDateChange}
            label="Start Date"
          />
          <View style={{ marginTop: 16 }}>
            <ThemedDatePicker
              value={endDate}
              onDateChange={handleEndDateChange}
              label="End Date"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>SEND</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Attachment Modal */}
      <AttachmentModal
        visible={showAttachmentModal}
        onDismiss={() => setShowAttachmentModal(false)}
        onCamera={handleAttachmentModalCamera}
        onGallery={handleAttachmentModalGallery}
        onDocument={handleAttachmentModalDocument}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  activitiesContent: {
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  formContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 100 : 40,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  resetButton: {
    backgroundColor: '#546e7a',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#546e7a',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});