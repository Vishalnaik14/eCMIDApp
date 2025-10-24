import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

// Sentry Configuration
export const initSentry = () => {
  Sentry.init({
    // Replace with your Sentry DSN from https://sentry.io
    dsn: 'https://f1a7b883defd58a4db4f2883b80e0f27@o4510242760949760.ingest.de.sentry.io/4510242763178064',
    
    // ⚠️ TESTING: Temporarily enabled in development - CHANGE BACK TO !__DEV__ after testing
    enabled: true, // Change this back to: !__DEV__
    
    // Enable in Expo development builds
    enableInExpoDevelopment: true,
    
    // Environment
    environment: __DEV__ ? 'development' : 'production',
    
    // Debug mode - shows Sentry logs in console
    debug: true, // Set to false after testing
    
    // Release version
    release: `${Constants.expoConfig?.slug}@${Constants.expoConfig?.version}`,
    dist: Constants.expoConfig?.version,
    
    // Enable auto session tracking
    enableAutoSessionTracking: true,
    
    // Session tracking interval (30 seconds)
    sessionTrackingIntervalMillis: 30000,
    
    // Enable native crash handling
    enableNative: true,
    enableNativeCrashHandling: true,
    
    // Performance monitoring (optional - adjust sample rate)
    enableTracing: true,
    tracesSampleRate: 0.2, // 20% of transactions
    
    // Attach stack traces
    attachStacktrace: true,
    
    // Max breadcrumbs
    maxBreadcrumbs: 50,
    
    // Before send hook - filter sensitive data
    beforeSend(event, hint) {
      // Log events in development for debugging
      if (__DEV__) {
        console.log('📊 Sentry Event:', event);
      }
      
      // Remove sensitive data from event
      if (event.request) {
        delete event.request.cookies;
      }
      
      return event;
    },
    
    // Integrations
    integrations: [
      new Sentry.ReactNativeTracing({
        // Routing instrumentation (for Expo Router)
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        
        // Trace all requests
        tracePropagationTargets: ['localhost', /^https:\/\/yourapi\.com\/api/],
      }),
    ],
  });
  
  console.log('✅ Sentry initialized:', {
    enabled: true,
    environment: __DEV__ ? 'development' : 'production',
    dsn: 'configured'
  });
};

// Set user context
export const setUserContext = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  
  Sentry.setUser({
    id: user.id || user.email,
    email: user.email,
    username: user.name,
  });
};

// Clear user context (on logout)
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Add custom breadcrumb
export const addBreadcrumb = (message, category = 'user-action', level = 'info', data = {}) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
  console.log('🍞 Breadcrumb added:', message);
};

// Capture error manually
export const captureError = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
  console.log('❌ Error captured:', error.message);
};

// Capture message
export const captureMessage = (message, level = 'info', context = {}) => {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
  console.log('💬 Message captured:', message);
};

// Set custom context
export const setCustomContext = (key, value) => {
  Sentry.setContext(key, value);
};

// Set tag
export const setTag = (key, value) => {
  Sentry.setTag(key, value);
};

export default Sentry;