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

// Import responsive utilities
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsivePadding,
  getDeviceType,
  getFormSizing,
  SCREEN_WIDTH,
} from '../utils/responsive';

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

  // Responsive values
  const deviceType = getDeviceType();
  const formSizing = getFormSizing();
  const isTablet = deviceType === 'tablet';

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

        <ScrollView contentContainerStyle={[
          styles.activitiesContent,
          {
            padding: responsivePadding(16),
            alignItems: 'center',
          }
        ]}>
          {loadingActivities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e9fd8" />
            </View>
          ) : (
            <View style={{ 
              width: '100%', 
              maxWidth: isTablet ? responsiveWidth(700) : SCREEN_WIDTH 
            }}>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPress={() => handleActivitySelect(activity)}
                />
              ))}
            </View>
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
        showLogo
        logoPath={require("../assets/img/ecmidlogoblack.png")} 
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.formContent,
            {
              padding: responsivePadding(16),
              paddingBottom: Platform.OS === 'android' ? responsiveHeight(100) : responsiveHeight(40),
              alignItems: 'center',
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={{ 
            width: '100%', 
            maxWidth: isTablet ? responsiveWidth(700) : SCREEN_WIDTH 
          }}>
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
            <View style={{ marginTop: responsiveHeight(16) }}>
              <ThemedDatePicker
                value={endDate}
                onDateChange={handleEndDateChange}
                label="End Date"
              />
            </View>

            {/* Description */}
            <View style={[styles.inputGroup, { marginTop: responsiveHeight(16) }]}>
              <Text style={[
                styles.inputLabel,
                {
                  fontSize: responsiveFontSize(14),
                  marginBottom: responsiveHeight(6),
                }
              ]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    fontSize: formSizing.fontSize,
                    height: isTablet ? responsiveHeight(160) : responsiveHeight(120),
                    padding: formSizing.padding,
                    borderRadius: formSizing.borderRadius,
                  }
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={isTablet ? 8 : 6}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
            </View>

            {/* Buttons */}
            <View style={[
              styles.buttonContainer,
              {
                marginTop: responsiveHeight(20),
              }
            ]}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.resetButton,
                  {
                    minHeight: formSizing.inputHeight,
                    paddingVertical: responsiveHeight(14),
                    borderRadius: formSizing.borderRadius,
                    marginRight: responsiveWidth(8),
                  }
                ]}
                onPress={handleReset}
                disabled={isLoading}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: responsiveFontSize(16) }
                ]}>
                  RESET
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.sendButton,
                  {
                    minHeight: formSizing.inputHeight,
                    paddingVertical: responsiveHeight(14),
                    borderRadius: formSizing.borderRadius,
                    marginLeft: responsiveWidth(8),
                  }
                ]}
                onPress={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[
                    styles.buttonText,
                    { fontSize: responsiveFontSize(16) }
                  ]}>
                    SEND
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
    flexGrow: 1,
  },
  loadingContainer: {
    paddingVertical: responsiveHeight(40),
    alignItems: 'center',
    width: '100%',
  },
  formContent: {
    flexGrow: 1,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    color: '#333',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: responsiveHeight(20),
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#546e7a',
  },
  sendButton: {
    backgroundColor: '#546e7a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});