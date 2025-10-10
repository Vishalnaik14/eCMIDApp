import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { responsiveFontSize } from './responsive';

const ResponsiveText = ({ 
  children, 
  style, 
  fontSize = 14, 
  fontWeight = 'normal',
  color = '#000',
  textAlign = 'left',
  numberOfLines,
  ...props 
}) => {
  const responsiveStyle = {
    fontSize: responsiveFontSize(fontSize),
    fontWeight,
    color,
    textAlign,
    ...style,
  };

  return (
    <Text 
      style={responsiveStyle} 
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ResponsiveText;
