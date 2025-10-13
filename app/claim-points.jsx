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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../hooks/useNavigation';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ThemedDatePicker from '../components/ThemedDatePicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ClaimPointsScreen() {
  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityList, setShowActivityList] = useState(true);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');
  
  const isPickerActiveRef = useRef(false);

  useEffect(() => {
    fetchActivities();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const mockActivities = [
        {
          id: '1',
          description: 'Subscription to a marine publication, journal or magazine',
          comments: 'Receipt of regular professional or industry updates.',
          points: 1,
        },
        {
          id: '2',
          description: 'Attendance at marine industry conference',
          comments: 'Minimum 4 hours attendance required.',
          points: 2,
        },
        {
          id: '3',
          description: 'Completion of online training course',
          comments: 'Certified course with assessment.',
          points: 3,
        },
        {
          id: '4',
          description: 'Professional development workshop',
          comments: 'Full day workshop attendance.',
          points: 4,
        },
      ];
      setActivities(mockActivities.sort((a, b) => a.points - b.points));
    } catch (err) {
      Alert.alert('Error', 'Failed to load activities.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateFileSize = (fileSize) => {
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      Alert.alert('File Too Large', 'File size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleImagePicker = async (source) => {
    if (isPickerActiveRef.current) return;
    
    setShowAttachmentModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    isPickerActiveRef.current = true;

    try {
      const result = source === 'camera' 
        ? await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 0.8 });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        
        if (asset.fileSize && !validateFileSize(asset.fileSize)) {
          return;
        }

        setAttachment({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          width: asset.width,
          height: asset.height,
        });
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${source === 'camera' ? 'capture' : 'select'} photo.`);
    } finally {
      isPickerActiveRef.current = false;
    }
  };

  const handleDocumentPicker = async () => {
    if (isPickerActiveRef.current) return;
    
    setShowAttachmentModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    isPickerActiveRef.current = true;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const doc = result.assets[0];
        
        if (doc.size && !validateFileSize(doc.size)) {
          return;
        }

        setAttachment({
          uri: doc.uri,
          type: 'document',
          name: doc.name,
          mimeType: doc.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document.');
    } finally {
      isPickerActiveRef.current = false;
    }
  };

  const handleStartDateChange = (date) => {
    // If end date exists and new start date is after end date, reset both dates
    if (endDate && date && new Date(date) > new Date(endDate)) {
      Alert.alert('Invalid Date', 'Start date cannot be after end date. Both dates have been reset. Please select valid dates.');
      setStartDate(null);
      setEndDate(null);
      return;
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    // If start date exists and new end date is before start date, reset both dates
    if (startDate && date && new Date(date) < new Date(startDate)) {
      Alert.alert('Invalid Date', 'End date cannot be before start date. Both dates have been reset. Please select valid dates.');
      setStartDate(null);
      setEndDate(null);
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
    if (!attachment || !startDate || !endDate || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Your points claim has been submitted!', [
        { text: 'OK', onPress: () => { handleReset(); goBack(); } },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit claim.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showActivityList) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Claim Points</Text>
          <Image
            source={require('../assets/img/ecmidlogoblack.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        <ScrollView contentContainerStyle={styles.activitiesContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e9fd8" />
            </View>
          ) : (
            activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => { setSelectedActivity(activity); setShowActivityList(false); }}
              >
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityComments}>{activity.comments}</Text>
                  <Text style={styles.activityPoints}>{activity.points} Point{activity.points > 1 ? 's' : ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { handleReset(); setShowActivityList(true); setSelectedActivity(null); }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim Your Points</Text>
        <Image
          source={require('../assets/img/ecmidlogoblack.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        {/* Selected Activity */}
        <View style={styles.selectedActivityBanner}>
          <Text style={styles.activityDescription}>{selectedActivity?.description}</Text>
          <Text style={styles.activityComments}>{selectedActivity?.comments}</Text>
          <Text style={styles.activityPoints}>
            {selectedActivity?.points} Point{selectedActivity?.points > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Attachment Section with Preview */}
        <View style={styles.attachmentSection}>
          {!attachment ? (
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => setShowAttachmentModal(true)}
            >
              <Ionicons name="attach" size={60} color="#ffffff" />
              <Text style={styles.attachmentText}>Click to send attachment</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewWrapper}>
              {attachment.type === 'image' ? (
                <Image 
                  source={{ uri: attachment.uri }} 
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.documentPreview}>
                  <Ionicons name="document" size={60} color="#fff" />
                  <Text style={styles.documentName} numberOfLines={2}>
                    {attachment.name}
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => setAttachment(null)}
              >
                <Ionicons name="close-circle" size={28} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
        </View>

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
              onPress={() => handleImagePicker('camera')}
            >
              <Ionicons name="camera" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImagePicker('gallery')}
            >
              <Ionicons name="images" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDocumentPicker}
            >
              <Ionicons name="document" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Attach Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setShowAttachmentModal(false)}
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  activitiesContent: {
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 6,
  },
  activityComments: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e9fd8',
  },
  formContent: {
    padding: 16,
  },
  selectedActivityBanner: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attachmentSection: {
    backgroundColor: '#b0bec5',
    borderRadius: 8,
    marginBottom: 20,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  attachmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  attachmentText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  documentPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentName: {
    fontSize: 14,
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    padding: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: SCREEN_WIDTH - 60,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333',
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