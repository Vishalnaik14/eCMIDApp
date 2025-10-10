import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Device type detection
export const getDeviceType = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  
  if (SCREEN_WIDTH >= 768) {
    return 'tablet';
  } else if (aspectRatio > 2.0) {
    return 'phone-tall'; // iPhone X series, Galaxy S series
  } else if (aspectRatio < 1.5) {
    return 'phone-wide'; // Some Android phones
  } else {
    return 'phone-standard'; // Standard phones
  }
};

// Responsive width calculation
export const responsiveWidth = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive height calculation
export const responsiveHeight = (size) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive font size
export const responsiveFontSize = (size) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive padding/margin
export const responsivePadding = (size) => {
  const deviceType = getDeviceType();
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  
  switch (deviceType) {
    case 'tablet':
      return Math.ceil(PixelRatio.roundToNearestPixel(size * scale * 1.2));
    case 'phone-tall':
      return Math.ceil(PixelRatio.roundToNearestPixel(size * scale * 1.1));
    default:
      return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
  }
};

// Grid columns based on device type
export const getGridColumns = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'tablet':
      return 3; // 3 columns for tablets
    case 'phone-tall':
    case 'phone-wide':
    case 'phone-standard':
    default:
      return 2; // 2 columns for phones
  }
};

// Responsive tile size
export const getTileSize = () => {
  const deviceType = getDeviceType();
  const columns = getGridColumns();
  
  switch (deviceType) {
    case 'tablet':
      return {
        width: (SCREEN_WIDTH - responsivePadding(32)) / columns,
        height: responsiveHeight(120),
        fontSize: responsiveFontSize(16),
        iconSize: responsiveWidth(48)
      };
    case 'phone-tall':
      return {
        width: (SCREEN_WIDTH - responsivePadding(16)) / columns,
        height: responsiveHeight(100),
        fontSize: responsiveFontSize(14),
        iconSize: responsiveWidth(42)
      };
    default:
      return {
        width: (SCREEN_WIDTH - responsivePadding(16)) / columns,
        height: responsiveHeight(90),
        fontSize: responsiveFontSize(13),
        iconSize: responsiveWidth(38)
      };
  }
};

// Safe area adjustments
export const getSafeAreaPadding = () => {
  const deviceType = getDeviceType();
  
  return {
    top: Platform.OS === 'ios' ? responsiveHeight(44) : responsiveHeight(24),
    bottom: Platform.OS === 'ios' ? responsiveHeight(34) : responsiveHeight(16),
    horizontal: responsivePadding(16)
  };
};

// Header size based on device
export const getHeaderSize = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'tablet':
      return {
        height: responsiveHeight(80),
        fontSize: responsiveFontSize(20),
        logoSize: responsiveWidth(60)
      };
    case 'phone-tall':
      return {
        height: responsiveHeight(70),
        fontSize: responsiveFontSize(18),
        logoSize: responsiveWidth(52)
      };
    default:
      return {
        height: responsiveHeight(60),
        fontSize: responsiveFontSize(16),
        logoSize: responsiveWidth(48)
      };
  }
};

// Form input sizing
export const getFormSizing = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'tablet':
      return {
        inputHeight: responsiveHeight(56),
        fontSize: responsiveFontSize(18),
        padding: responsivePadding(20),
        borderRadius: responsiveWidth(8)
      };
    case 'phone-tall':
      return {
        inputHeight: responsiveHeight(50),
        fontSize: responsiveFontSize(16),
        padding: responsivePadding(16),
        borderRadius: responsiveWidth(6)
      };
    default:
      return {
        inputHeight: responsiveHeight(48),
        fontSize: responsiveFontSize(15),
        padding: responsivePadding(14),
        borderRadius: responsiveWidth(4)
      };
  }
};

export default {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsivePadding,
  getDeviceType,
  getGridColumns,
  getTileSize,
  getSafeAreaPadding,
  getHeaderSize,
  getFormSizing,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
};
