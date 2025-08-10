import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => removeFromCart(productId), style: 'destructive' },
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Remove Item',
      `Do you want to remove "${productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeFromCart(productId), style: 'destructive' },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearCart, style: 'destructive' },
      ]
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to proceed with checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    navigation.navigate('Checkout');
  };

  const renderCartItem = (item, index) => (
    <Animatable.View
      key={item._id}
      animation="fadeInUp"
      delay={index * 100}
      style={[styles.cartItem, { backgroundColor: theme.colors.card }]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        style={styles.itemImageContainer}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {item.discountPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={[styles.itemCategory, { color: theme.colors.textSecondary }]}>
          {item.category}
        </Text>

        <View style={styles.priceContainer}>
          {item.discountPrice ? (
            <>
              <Text style={[styles.originalPrice, { color: theme.colors.textDisabled }]}>
                ${item.price}
              </Text>
              <Text style={[styles.discountPrice, { color: theme.colors.primary }]}>
                ${item.discountPrice}
              </Text>
            </>
          ) : (
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              ${item.price}
            </Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => handleQuantityChange(item._id, item.quantity - 1)}
          >
            <Icon name="remove" size={16} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.quantityText, { color: theme.colors.text }]}>
            {item.quantity}
          </Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => handleQuantityChange(item._id, item.quantity + 1)}
          >
            <Icon name="add" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemTotal}>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
            Total:
          </Text>
          <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
            ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item._id, item.name)}
      >
        <Icon name="delete-outline" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderEmptyCart = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyCartContainer}>
      <Icon name="shopping-cart-outline" size={80} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyCartTitle, { color: theme.colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptyCartSubtitle, { color: theme.colors.textSecondary }]}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={[styles.shopNowButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopNowText}>Start Shopping</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderCartSummary = () => (
    <View style={[styles.summaryContainer, { backgroundColor: theme.colors.card }]}>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
          Subtotal
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          ${getCartTotal().toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
          Shipping
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          Free
        </Text>
      </View>
      
      <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
      
      <View style={styles.summaryRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
          ${getCartTotal().toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Shopping Cart
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={[styles.clearCartText, { color: theme.colors.error }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {cartItems.map((item, index) => renderCartItem(item, index))}
          </ScrollView>

          {/* Cart Summary */}
          {renderCartSummary()}

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                { backgroundColor: theme.colors.primary },
                loading && styles.checkoutButtonDisabled
              ]}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.checkoutButtonText}>Processing...</Text>
              ) : (
                <>
                  <Text style={styles.checkoutButtonText}>
                    Proceed to Checkout
                  </Text>
                  <Text style={styles.checkoutButtonSubtext}>
                    ${getCartTotal().toFixed(2)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  clearCartText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CartScreen; 