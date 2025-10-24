import { createContext, useState } from "react";
import { setUserContext, clearUserContext, addBreadcrumb } from '../utils/sentry';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(true); // Set to true since we're not checking backend

  // Mock login function - just for navigation purposes
  async function login(email, password) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user object
      const mockUser = {
        id: email, // Add ID for Sentry
        email: email,
        name: email.split('@')[0],
      };
      
      setUser(mockUser);
      
      // Set Sentry user context
      setUserContext(mockUser);
      
      // Track login event
      addBreadcrumb('User logged in', 'auth', 'info', { email });
      
      return { success: true };
    } catch (error) {
      throw Error('Login failed');
    }
  }

  // Mock register function
  async function register(email, password) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: email, // Add ID for Sentry
        email: email,
        name: email.split('@')[0],
      };
      setUser(mockUser);
      
      // Set Sentry user context
      setUserContext(mockUser);
      
      // Track registration event
      addBreadcrumb('User registered', 'auth', 'info', { email });
      
      return { success: true };
    } catch (error) {
      throw Error('Registration failed');
    }
  }

  // Mock logout function
  async function logout() {
    setUser(null);
    
    // Clear Sentry user context
    clearUserContext();
    
    // Track logout event
    addBreadcrumb('User logged out', 'auth', 'info');
  }

  // Mock password reset email
  async function sendPasswordResetEmail(email) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      throw Error('Failed to send reset email');
    }
  }

  // Mock password reset
  async function resetPassword(userId, secret, newPassword) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      throw Error('Failed to reset password');
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      authChecked,
      sendPasswordResetEmail,
      resetPassword
    }}>
      {children}
    </UserContext.Provider>
  );
}