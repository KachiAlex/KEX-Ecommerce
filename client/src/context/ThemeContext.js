import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    // Colors
    colors: {
      primary: '#2E7D32', // KEX Green
      primaryLight: '#4CAF50',
      primaryDark: '#1B5E20',
      secondary: '#FF6B35', // KEX Orange
      secondaryLight: '#FF8A65',
      secondaryDark: '#E64A19',
      accent: '#FFC107', // KEX Gold
      accentLight: '#FFD54F',
      accentDark: '#FF8F00',
      
      // Background colors
      background: '#FFFFFF',
      surface: '#FAFAFA',
      card: '#FFFFFF',
      
      // Text colors
      text: '#212121',
      textSecondary: '#757575',
      textDisabled: '#BDBDBD',
      
      // Status colors
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
      
      // Border colors
      border: '#E0E0E0',
      borderLight: '#F5F5F5',
      
      // Shadow colors
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowDark: 'rgba(0, 0, 0, 0.2)',
      
      // Gradient colors
      gradientStart: '#2E7D32',
      gradientEnd: '#4CAF50',
    },
    
    // Typography
    typography: {
      fontFamily: {
        regular: 'Roboto-Regular',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
        light: 'Roboto-Light',
      },
      fontSize: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 20,
        xxxl: 24,
        title: 28,
        largeTitle: 32,
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
      },
    },
    
    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
    },
    
    // Border radius
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      round: 50,
    },
    
    // Shadows
    shadows: {
      sm: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      },
      md: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      lg: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
      },
    },
    
    // Animation
    animation: {
      duration: {
        fast: 200,
        normal: 300,
        slow: 500,
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
      },
    },
  };

  const darkTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: '#121212',
      surface: '#1E1E1E',
      card: '#2D2D2D',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#404040',
      borderLight: '#2D2D2D',
    },
  };

  const currentTheme = isDarkMode ? darkTheme : theme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 