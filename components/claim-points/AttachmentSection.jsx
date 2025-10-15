// components/claim-points/AttachmentSection.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AttachmentSection({ attachment, onAttach, onRemove }) {
  if (!attachment) {
    return (
      <View style={styles.attachmentSection}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={onAttach}
        >
          <Ionicons name="attach" size={60} color="#ffffff" />
          <Text style={styles.attachmentText}>Click to send attachment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.attachmentSection}>
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
          onPress={onRemove}
        >
          <Ionicons name="close-circle" size={28} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});