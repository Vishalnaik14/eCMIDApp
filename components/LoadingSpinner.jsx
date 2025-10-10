import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingSpinner = ({ 
  size = 'large', 
  color = '#1e9fd8', 
  text = 'Loading...',
  showText = true 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {showText && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e9fd8',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default LoadingSpinner;
