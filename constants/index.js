// App Constants
export const COLORS = {
  primary: '#1e9fd8',
  secondary: '#347a8c',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f5f5f5',
    200: '#e0e0e0',
    300: '#cccccc',
    400: '#999999',
    500: '#666666',
    600: '#333333',
  },
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SCREEN_NAMES = {
  HOME: '/home',
  SCORE: '/score',
  LOGIN: '/login',
  CONTACT_US: '/(auth)/contact-us',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
};

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.example.com',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/profile',
  SCORE: '/user/score',
  ACTIVITIES: '/user/activities',
};

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  THEME: 'theme',
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

export default {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SCREEN_NAMES,
  ANIMATION_DURATION,
  API_ENDPOINTS,
  STORAGE_KEYS,
  VALIDATION_RULES,
};
