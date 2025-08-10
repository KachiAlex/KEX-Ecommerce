import React, { useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from order
    return formatDate(deliveryDate);
  };

  const renderOrderItem = (item, index) => (
    <View key={index} style={[styles.orderItem, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
      <View style={styles.itemImageContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Ionicons name="image" size={24} color={isDarkMode ? '#666666' : '#cccccc'} />
        </View>
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
          {item.product.name}
        </Text>
        <Text style={[styles.itemDetails, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
          Qty: {item.quantity}
          {item.selectedSize && ` | Size: ${item.selectedSize}`}
          {item.selectedColor && ` | Color: ${item.selectedColor}`}
        </Text>
        <Text style={[styles.itemPrice, { color: isDarkMode ? '#FFD700' : '#007bff' }]}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.successContainer,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.successCircle}
          >
            <Ionicons name="checkmark" size={60} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* Order Confirmed Text */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
            Order Confirmed!
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
            Thank you for your purchase
          </Text>
        </Animated.View>

        {/* Order Details Card */}
        <Animated.View
          style={[
            styles.orderCard,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.orderHeader}>
            <Text style={[styles.orderTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              Order Details
            </Text>
            <View style={styles.orderIdContainer}>
              <Text style={[styles.orderIdLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                Order ID:
              </Text>
              <Text style={[styles.orderId, { color: isDarkMode ? '#FFD700' : '#007bff' }]}>
                #{order._id.slice(-8).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={isDarkMode ? '#cccccc' : '#666666'} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                Order Date:
              </Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
                {formatDate(order.createdAt)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={isDarkMode ? '#cccccc' : '#666666'} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                Delivery Address:
              </Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
                {order.shippingAddress.street}, {order.shippingAddress.city}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={isDarkMode ? '#cccccc' : '#666666'} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                Estimated Delivery:
              </Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? '#4CAF50' : '#4CAF50' }]}>
                {getEstimatedDelivery()}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Order Items */}
        <Animated.View
          style={[
            styles.itemsCard,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.itemsTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
            Order Items ({order.items.length})
          </Text>
          
          {order.items.map((item, index) => renderOrderItem(item, index))}
        </Animated.View>

        {/* Order Summary */}
        <Animated.View
          style={[
            styles.summaryCard,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.summaryTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
              Shipping
            </Text>
            <Text style={[styles.summaryValue, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              ${order.shipping.toFixed(2)}
            </Text>
          </View>
          
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                -${order.discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
              Tax
            </Text>
            <Text style={[styles.summaryValue, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              ${order.tax.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#ffffff' : '#333333', fontWeight: 'bold' }]}>
              Total
            </Text>
            <Text style={[styles.summaryValue, { color: isDarkMode ? '#FFD700' : '#007bff', fontWeight: 'bold' }]}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#007bff' }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={[styles.secondaryButtonText, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              View Orders
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderInfo: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
  },
  itemsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImageContainer: {
    marginRight: 15,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginTop: 10,
  },
  buttonContainer: {
    gap: 15,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen;
