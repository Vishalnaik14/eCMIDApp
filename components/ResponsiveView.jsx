import React from 'react';
import { View, StyleSheet } from 'react-native';
import { responsivePadding, responsiveWidth, responsiveHeight } from '../utils/responsive';

const ResponsiveView = ({ 
  children, 
  style, 
  padding = 0,
  paddingHorizontal = 0,
  paddingVertical = 0,
  margin = 0,
  marginHorizontal = 0,
  marginVertical = 0,
  width,
  height,
  ...props 
}) => {
  const responsiveStyle = {
    padding: padding ? responsivePadding(padding) : undefined,
    paddingHorizontal: paddingHorizontal ? responsivePadding(paddingHorizontal) : undefined,
    paddingVertical: paddingVertical ? responsivePadding(paddingVertical) : undefined,
    margin: margin ? responsivePadding(margin) : undefined,
    marginHorizontal: marginHorizontal ? responsivePadding(marginHorizontal) : undefined,
    marginVertical: marginVertical ? responsivePadding(marginVertical) : undefined,
    width: width ? responsiveWidth(width) : undefined,
    height: height ? responsiveHeight(height) : undefined,
    ...style,
  };

  return (
    <View style={responsiveStyle} {...props}>
      {children}
    </View>
  );
};

export default ResponsiveView;
