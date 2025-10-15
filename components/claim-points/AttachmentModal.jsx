// components/claim-points/AttachmentModal.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AttachmentModal({ 
  visible, 
  onDismiss, 
  onCamera, 
  onGallery, 
  onDocument 
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Mode</Text>

          <TouchableOpacity style={styles.modalOption} onPress={onCamera}>
            <Ionicons name="camera" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={onGallery}>
            <Ionicons name="images" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={onDocument}>
            <Ionicons name="document" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Attach Document</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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