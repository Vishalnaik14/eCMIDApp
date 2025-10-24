import { captureError, captureMessage, addBreadcrumb } from './sentry';

// Performance monitoring utilities
export const performanceMonitor = {
  // Track component render times
  trackRender: (componentName) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${componentName} render time: ${end - start}ms`);
    };
  },

  // Track API call performance
  trackApiCall: async (apiName, apiCall) => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      console.log(`${apiName} completed in: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${apiName} failed after: ${end - start}ms`, error);
      throw error;
    }
  },

  // Track navigation performance
  trackNavigation: (from, to) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`Navigation from ${from} to ${to}: ${end - start}ms`);
    };
  },
};

// Memory usage monitoring
export const memoryMonitor = {
  logMemoryUsage: () => {
    if (performance.memory) {
      console.log('Memory usage:', {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB',
      });
    }
  },
};

// Error tracking utilities
export const errorTracker = {
  logError: (error, context = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };
    
    console.error('Error occurred:', errorData);
    
    // Send to Sentry
    captureError(error, context);
  },

  logWarning: (message, context = {}) => {
    const warningData = {
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    
    console.warn('Warning:', warningData);
    
    // Send to Sentry
    captureMessage(message, 'warning', context);
  },
  
  // Add breadcrumb for tracking user actions
  trackAction: (action, data = {}) => {
    addBreadcrumb(action, 'user-action', 'info', data);
  },
};

export default {
  performanceMonitor,
  memoryMonitor,
  errorTracker,
};