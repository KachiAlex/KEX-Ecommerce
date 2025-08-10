import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('kex_token');
      const storedUser = await AsyncStorage.getItem('kex_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data;

      // Store in AsyncStorage
      await AsyncStorage.setItem('kex_token', authToken);
      await AsyncStorage.setItem('kex_user', JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Hello ${userData.name}`,
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      const { token: authToken, user: newUser } = response.data;

      // Store in AsyncStorage
      await AsyncStorage.setItem('kex_token', authToken);
      await AsyncStorage.setItem('kex_user', JSON.stringify(newUser));

      // Update state
      setToken(authToken);
      setUser(newUser);
      setIsAuthenticated(true);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Welcome to KEX!',
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: message,
      });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('kex_token');
      await AsyncStorage.removeItem('kex_user');

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Come back soon!',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      const updatedUser = response.data;

      // Update stored user data
      await AsyncStorage.setItem('kex_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed.';
      
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      await axios.put(`${API_BASE_URL}/auth/change-password`, {
        currentPassword,
        newPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Password Changed',
        text2: 'Your password has been updated successfully.',
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed.';
      
      Toast.show({
        type: 'error',
        text1: 'Change Failed',
        text2: message,
      });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });

      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Check your email for password reset instructions.',
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email.';
      
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: message,
      });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
      const { token: newToken } = response.data;

      await AsyncStorage.setItem('kex_token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 