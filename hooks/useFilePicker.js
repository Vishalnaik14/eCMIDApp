// hooks/useFilePicker.js
import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function useFilePicker() {
  const [attachment, setAttachment] = useState(null);
  const isPickerActiveRef = useRef(false);

  const validateFileSize = (fileSize) => {
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      Alert.alert('File Too Large', 'File size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const pickImage = async (source) => {
    if (isPickerActiveRef.current) return;
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

  const pickDocument = async () => {
    if (isPickerActiveRef.current) return;
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

  const clearAttachment = () => setAttachment(null);

  return { 
    attachment, 
    setAttachment, 
    pickImage, 
    pickDocument,
    clearAttachment 
  };
}