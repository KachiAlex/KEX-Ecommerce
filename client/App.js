import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AccountScreen from './src/screens/AccountScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SearchScreen from './src/screens/SearchScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';

// Import context
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';

// Import components
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Categories') {
            iconName = 'category';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Orders') {
            iconName = 'receipt';
          } else if (route.name === 'Account') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer initialRouteName="Splash">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#FFFFFF',
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTintColor: '#2E7D32',
                headerTitleStyle: {
                  fontWeight: '600',
                },
              }}
            >
              <Stack.Screen 
                name="Splash" 
                component={SplashScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="MainTabs" 
                component={TabNavigator} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen}
                options={{ title: 'Product Details' }}
              />
              <Stack.Screen 
                name="Category" 
                component={CategoryScreen}
                options={{ title: 'Category' }}
              />
              <Stack.Screen 
                name="Search" 
                component={SearchScreen}
                options={{ title: 'Search Products' }}
              />
              <Stack.Screen 
                name="Checkout" 
                component={CheckoutScreen}
                options={{ title: 'Checkout' }}
              />
              <Stack.Screen 
                name="Payment" 
                component={PaymentScreen}
                options={{ title: 'Payment' }}
              />
              <Stack.Screen 
                name="OrderConfirmation" 
                component={OrderConfirmationScreen}
                options={{ title: 'Order Confirmed' }}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ title: 'Sign In' }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ title: 'Create Account' }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ title: 'My Profile' }}
              />
              <Stack.Screen 
                name="Wishlist" 
                component={WishlistScreen}
                options={{ title: 'My Wishlist' }}
              />
              <Stack.Screen 
                name="Notifications" 
                component={NotificationScreen}
                options={{ title: 'Notifications' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
              <Stack.Screen 
                name="Help" 
                component={HelpScreen}
                options={{ title: 'Help & Support' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 