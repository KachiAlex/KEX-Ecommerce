import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('kex-token');
    const savedUser = localStorage.getItem('kex-user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('kex-token');
        localStorage.removeItem('kex-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Implement actual API call
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'customer'
      };
      
      setUser(mockUser);
      localStorage.setItem('kex-token', 'mock-token');
      localStorage.setItem('kex-user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Implement actual API call
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'customer'
      };
      
      setUser(mockUser);
      localStorage.setItem('kex-token', 'mock-token');
      localStorage.setItem('kex-user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kex-token');
    localStorage.removeItem('kex-user');
  };

  const updateProfile = async (userData) => {
    try {
      // TODO: Implement actual API call
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('kex-user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
