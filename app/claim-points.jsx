import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ThemedDatePicker from '../components/ThemedDatePicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function ClaimPointsScreen() {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();

  // State management
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityList, setShowActivityList] = useState(true);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [attachment, setAttachment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');

  // Prevent multiple simultaneous picker launches
  const isPickerActiveRef = useRef(false);

  // Fetch activities from API
  useEffect(() => {
    fetchActivities();
    // Request permissions on mount
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', cameraStatus.status);
      
      // Request media library permission
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', mediaStatus.status);
      
      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        console.warn('Permissions not fully granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // Mock data for now (remove when API is ready)
      const mockActivities = [
        {
          id: '1',
          description: 'Subscription to a marine publication, journal or magazine',
          comments: 'Receipt of regular professional or industry updates.',
          points: 1,
          displayInApp: true,
        },
        {
          id: '2',
          description: 'Attendance at marine industry conference',
          comments: 'Minimum 4 hours attendance required.',
          points: 2,
          displayInApp: true,
        },
        {
          id: '3',
          description: 'Completion of online training course',
          comments: 'Certified course with assessment.',
          points: 3,
          displayInApp: true,
        },
        {
          id: '4',
          description: 'Professional development workshop',
          comments: 'Full day workshop attendance.',
          points: 4,
          displayInApp: true,
        },
      ];

      const sortedActivities = mockActivities.sort((a, b) => a.points - b.points);
      setActivities(sortedActivities);

    } catch (err) {
      console.error('Error fetching activities:', err);
      Alert.alert('Error', 'Failed to load activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowActivityList(false);
  };

  const validateFileSize = (fileSize, fileName) => {
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      Alert.alert('File Too Large', 'File size must be less than 5MB. Please choose a smaller file.');
      return false;
    }
    return true;
  };

  const handleAttachFromCamera = async () => {
    // Prevent multiple simultaneous launches
    if (isPickerActiveRef.current) {
      console.log('Picker already active, ignoring...');
      return;
    }

    setShowAttachmentModal(false);
    
    // CRITICAL: Wait for modal animation to complete on iOS
    await new Promise(resolve => setTimeout(resolve, 600));
    
    isPickerActiveRef.current = true;
    
    try {
      // Check permission first
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take photos. Please enable it in Settings > [Your App] > Camera.',
            [{ text: 'OK' }]
          );
          isPickerActiveRef.current = false;
          return;
        }
      }

      console.log('Launching camera...');
      
      // Simplest possible call - mediaTypes defaults to 'images'
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          console.log('Captured image URI:', asset.uri);
          
          if (!asset.uri) {
            console.error('No URI in asset');
            Alert.alert('Error', 'Failed to capture image. Please try again.');
            isPickerActiveRef.current = false;
            return;
          }
          
          // Check file size if available
          if (asset.fileSize) {
            console.log('File size:', asset.fileSize);
            if (!validateFileSize(asset.fileSize, asset.fileName)) {
              isPickerActiveRef.current = false;
              return;
            }
          }

          const fileName = asset.fileName || `camera_photo_${Date.now()}.jpg`;
          
          const attachmentData = {
            uri: asset.uri,
            type: 'image',
            name: fileName,
            mimeType: 'image/jpeg',
            width: asset.width,
            height: asset.height,
          };
          
          console.log('Setting attachment:', attachmentData);
          setAttachment(attachmentData);

          Alert.alert('Success', 'Photo captured successfully!');
        } else {
          console.log('No assets in result');
        }
      } else {
        console.log('Camera was canceled');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error',
        `Failed to take photo: ${error.message || 'Unknown error'}. Please try again.`
      );
    } finally {
      isPickerActiveRef.current = false;
    }
  };

  const handleAttachFromGallery = async () => {
    // Prevent multiple simultaneous launches
    if (isPickerActiveRef.current) {
      console.log('Picker already active, ignoring...');
      return;
    }

    setShowAttachmentModal(false);
    
    // CRITICAL: Wait for modal animation to complete on iOS
    await new Promise(resolve => setTimeout(resolve, 600));
    
    isPickerActiveRef.current = true;
    
    try {
      // Check permission first
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Photo library permission is required. Please enable it in Settings > [Your App] > Photos.',
            [{ text: 'OK' }]
          );
          isPickerActiveRef.current = false;
          return;
        }
      }

      console.log('Launching gallery...');
      
      // Simplest possible call - mediaTypes defaults to 'images'
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          console.log('Selected image URI:', asset.uri);
          
          if (!asset.uri) {
            console.error('No URI in asset');
            Alert.alert('Error', 'Failed to select image. Please try again.');
            isPickerActiveRef.current = false;
            return;
          }
          
          // Check file size if available
          if (asset.fileSize) {
            console.log('File size:', asset.fileSize);
            if (!validateFileSize(asset.fileSize, asset.fileName)) {
              isPickerActiveRef.current = false;
              return;
            }
          }

          const fileName = asset.fileName || `gallery_photo_${Date.now()}.jpg`;
          
          const attachmentData = {
            uri: asset.uri,
            type: 'image',
            name: fileName,
            mimeType: 'image/jpeg',
            width: asset.width,
            height: asset.height,
          };
          
          console.log('Setting attachment:', attachmentData);
          setAttachment(attachmentData);

          Alert.alert('Success', 'Photo selected successfully!');
        } else {
          console.log('No assets in result');
        }
      } else {
        console.log('Gallery was canceled');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert(
        'Gallery Error',
        `Failed to select photo: ${error.message || 'Unknown error'}. Please try again.`
      );
    } finally {
      isPickerActiveRef.current = false;
    }
  };

  const handleAttachDocument = async () => {
    // Prevent multiple simultaneous launches
    if (isPickerActiveRef.current) {
      console.log('Picker already active, ignoring...');
      return;
    }

    setShowAttachmentModal(false);
    
    // Wait for modal to close
    await new Promise(resolve => setTimeout(resolve, 600));
    
    isPickerActiveRef.current = true;

    try {
      console.log('Launching document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document picker result:', result);

      if (!result.canceled) {
        // Handle new API format (expo-document-picker v14+)
        if (result.assets && result.assets.length > 0) {
          const doc = result.assets[0];
          console.log('Selected document:', doc);
          
          // Check file size
          if (doc.size && !validateFileSize(doc.size, doc.name)) {
            isPickerActiveRef.current = false;
            return;
          }

          setAttachment({
            uri: doc.uri,
            type: 'document',
            name: doc.name,
            mimeType: doc.mimeType || 'application/octet-stream',
          });

          Alert.alert('Success', 'Document selected successfully!');
        }
      } else {
        console.log('Document picker canceled');
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert(
        'Document Error',
        `Failed to select document: ${error.message || 'Unknown error'}. Please try again.`
      );
    } finally {
      isPickerActiveRef.current = false;
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    
    // If end date exists and is before the new start date, reset end date
    if (endDate && date && new Date(endDate) < new Date(date)) {
      setEndDate(null);
      Alert.alert('Date Adjusted', 'End date has been reset as it was before the new start date.');
    }
  };

  const handleEndDateChange = (date) => {
    // Validate that end date is not before start date
    if (startDate && date && new Date(date) < new Date(startDate)) {
      Alert.alert('Invalid Date', 'End date cannot be before start date. Please select a valid end date.');
      return;
    }
    
    setEndDate(date);
  };

  const handleReset = () => {
    setAttachment(null);
    setStartDate(null);
    setEndDate(null);
    setDescription('');
  };

  const handleSend = async () => {
    // Validation
    if (!attachment) {
      Alert.alert('Missing Attachment', 'Please attach a file before submitting.');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Missing Dates', 'Please provide start and end dates.');
      return;
    }
    
    // Additional date validation
    if (new Date(endDate) < new Date(startDate)) {
      Alert.alert('Invalid Dates', 'End date cannot be before start date.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please provide a description.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API
      console.log('Preparing submission:', {
        activityId: selectedActivity.id,
        attachment: attachment,
        startDate: startDate,
        endDate: endDate,
        description: description,
      });

      // TODO: Implement your API call here
      // const formData = new FormData();
      // formData.append('activityId', selectedActivity.id);
      // formData.append('file', {
      //   uri: attachment.uri,
      //   type: attachment.mimeType,
      //   name: attachment.name,
      // });
      // formData.append('startDate', startDate.toISOString());
      // formData.append('endDate', endDate.toISOString());
      // formData.append('description', description);
      
      // const response = await fetch('YOUR_API_ENDPOINT/claim-points', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: formData,
      // });
      
      // const data = await response.json();
      // console.log('API response:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Your points claim has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            handleReset();
            goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', `Failed to submit claim: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (showActivityList) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Claim Points</Text>
          <View style={styles.headerRight}>
            <Image
              source={require('../assets/img/ecmidlogoblack.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Activities List */}
        <ScrollView style={styles.activitiesList} contentContainerStyle={styles.activitiesListContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e9fd8" />
              <Text style={styles.loadingText}>Loading activities...</Text>
            </View>
          ) : (
            activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => handleActivitySelect(activity)}
                activeOpacity={0.7}
              >
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityComments}>{activity.comments}</Text>
                  <Text style={styles.activityPoints}>{activity.points} Point{activity.points > 1 ? 's' : ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666666" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleReset();
            setShowActivityList(true);
            setSelectedActivity(null);
          }}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim Your Points</Text>
        <View style={styles.headerRight}>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        {/* Selected Activity Display */}
        <View style={styles.selectedActivityBanner}>
          <Text style={styles.selectedActivityDescription}>{selectedActivity?.description}</Text>
          <Text style={styles.selectedActivityComments}>{selectedActivity?.comments}</Text>
          <Text style={styles.selectedActivityPoints}>
            {selectedActivity?.points} Point{selectedActivity?.points > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Attachment Section */}
        <View style={styles.attachmentSection}>
          <TouchableOpacity
            style={styles.attachmentIconContainer}
            onPress={() => setShowAttachmentModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="attach" size={60} color="#ffffff" />
            <Text style={styles.attachmentText}>Click to send attachment</Text>
          </TouchableOpacity>
          {attachment && (
            <View style={styles.attachmentPreview}>
              <Ionicons 
                name={attachment.type === 'image' ? 'image' : 'document'} 
                size={20} 
                color="#4CAF50" 
              />
              <Text style={styles.attachmentName} numberOfLines={1}>
                {attachment.name}
              </Text>
              <TouchableOpacity onPress={() => setAttachment(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={20} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Start Date */}
        <ThemedDatePicker
          value={startDate}
          onDateChange={handleStartDateChange}
          label="Start Date"
        />

        {/* End Date */}
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
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="#999999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.sendButtonText}>SEND</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Attachment Modal */}
      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Mode</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleAttachFromCamera}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color="#333333" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Attach Pic From Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleAttachFromGallery}
              activeOpacity={0.7}
            >
              <Ionicons name="images" size={24} color="#333333" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Attach Pic From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleAttachDocument}
              activeOpacity={0.7}
            >
              <Ionicons name="document" size={24} color="#333333" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Attach Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setShowAttachmentModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.dismissButtonText}>DISMISS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e9fd8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  activitiesList: {
    flex: 1,
  },
  activitiesListContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  activityComments: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e9fd8',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  selectedActivityBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedActivityDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  selectedActivityComments: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  selectedActivityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e9fd8',
  },
  attachmentSection: {
    backgroundColor: '#b0bec5',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 180,
  },
  attachmentIconContainer: {
    alignItems: 'center',
    width: '100%',
  },
  attachmentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 12,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
    maxWidth: '100%',
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    marginHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#546e7a',
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    width: SCREEN_WIDTH - 60,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  modalIcon: {
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333333',
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA500',
  },
});