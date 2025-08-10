import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  TextInput,
  Modal,
  Switch
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile, updatePassword } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const success = await updateProfile(editForm);
      if (success) {
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const success = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (success) {
        setPasswordModalVisible(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        Alert.alert('Success', 'Password updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update password');
    }
    setLoading(false);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'shipped': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const menuItems = [
    {
      icon: <Ionicons name="person-outline" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Edit Profile',
      onPress: () => setEditModalVisible(true)
    },
    {
      icon: <Ionicons name="lock-closed-outline" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Change Password',
      onPress: () => setPasswordModalVisible(true)
    },
    {
      icon: <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'My Orders',
      onPress: () => navigation.navigate('Orders')
    },
    {
      icon: <MaterialIcons name="favorite-border" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Wishlist',
      onPress: () => navigation.navigate('Wishlist')
    },
    {
      icon: <MaterialIcons name="location-on" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Addresses',
      onPress: () => navigation.navigate('Addresses')
    },
    {
      icon: <MaterialIcons name="payment" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Payment Methods',
      onPress: () => navigation.navigate('PaymentMethods')
    },
    {
      icon: <MaterialIcons name="notifications-none" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Notifications',
      onPress: () => navigation.navigate('Notifications')
    },
    {
      icon: <MaterialIcons name="security" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Privacy & Security',
      onPress: () => navigation.navigate('Privacy')
    },
    {
      icon: <MaterialIcons name="help-outline" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'Help & Support',
      onPress: () => navigation.navigate('Support')
    },
    {
      icon: <MaterialIcons name="info-outline" size={24} color={isDarkMode ? '#fff' : '#333'} />,
      title: 'About',
      onPress: () => navigation.navigate('About')
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.avatar || 'https://via.placeholder.com/80' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {user?.name || 'User Name'}
              </Text>
              <Text style={[styles.userEmail, { color: isDarkMode ? '#ccc' : '#666' }]}>
                {user?.email || 'user@example.com'}
              </Text>
              <Text style={[styles.memberSince, { color: isDarkMode ? '#999' : '#888' }]}>
                Member since {formatDate(user?.createdAt || new Date())}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: isDarkMode ? '#fff' : '#333' }]}>
              {orders.length}
            </Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Orders
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: isDarkMode ? '#fff' : '#333' }]}>
              {orders.filter(order => order.status === 'delivered').length}
            </Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Delivered
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: isDarkMode ? '#fff' : '#333' }]}>
              {orders.filter(order => order.status === 'pending' || order.status === 'processing').length}
            </Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Active
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[styles.menuItemText, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? '#666' : '#999'} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Toggle */}
        <View style={[styles.themeContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.themeItem}>
            <View style={styles.themeItemLeft}>
              <MaterialCommunityIcons 
                name={isDarkMode ? "weather-night" : "weather-sunny"} 
                size={24} 
                color={isDarkMode ? '#fff' : '#333'} 
              />
              <Text style={[styles.themeItemText, { color: isDarkMode ? '#fff' : '#333' }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#2d2d2d' : '#fff' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#f44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Full Name"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Email"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              keyboardType="email-address"
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Phone Number"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={editForm.phone}
              onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
              keyboardType="phone-pad"
            />
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#007bff' }]}
              onPress={handleEditProfile}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Change Password
              </Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Current Password"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={passwordForm.currentPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
              secureTextEntry
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="New Password"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={passwordForm.newPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
              secureTextEntry
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Confirm New Password"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={passwordForm.confirmPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
              secureTextEntry
            />
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#007bff' }]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>
                {loading ? 'Updating...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 3,
  },
  memberSince: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  menuContainer: {
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  themeContainer: {
    marginBottom: 10,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  themeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
