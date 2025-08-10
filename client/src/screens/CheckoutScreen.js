import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Switch
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/api';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Form states
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '1-2 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: 'Next business day' }
  ];

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    
    fetchSavedAddresses();
    fetchPaymentMethods();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.addresses || []);
        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
        if (data.paymentMethods && data.paymentMethods.length > 0) {
          setSelectedPaymentMethod(data.paymentMethods[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.firstName || !addressForm.lastName || !addressForm.street || 
        !addressForm.city || !addressForm.state || !addressForm.zipCode || !addressForm.country) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAddresses([...savedAddresses, data.address]);
        setSelectedAddress(data.address);
        setShowNewAddressForm(false);
        setAddressForm({
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: ''
        });
        Alert.alert('Success', 'Address saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleSavePaymentMethod = async () => {
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardholderName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/payment-methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentForm)
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods([...paymentMethods, data.paymentMethod]);
        setSelectedPaymentMethod(data.paymentMethod);
        setShowNewPaymentForm(false);
        setPaymentForm({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: ''
        });
        Alert.alert('Success', 'Payment method saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save payment method');
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      Alert.alert('Error', 'Failed to save payment method');
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: promoCode })
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedPromo(data.promoCode);
        Alert.alert('Success', `Promo code applied! ${data.promoCode.discount}% off`);
      } else {
        Alert.alert('Error', 'Invalid promo code');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'Failed to apply promo code');
    }
  };

  const calculateTotals = () => {
    const subtotal = cartTotal;
    const shipping = shippingMethods.find(method => method.id === shippingMethod)?.price || 0;
    const discount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal + shipping - discount + tax;

    return { subtotal, shipping, discount, tax, total };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a shipping address');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        shippingAddress: selectedAddress,
        billingAddress: useSameAddress ? selectedAddress : selectedAddress, // In a real app, you'd have separate billing
        paymentMethod: selectedPaymentMethod._id,
        shippingMethod,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        notes: orderNotes,
        promoCode: appliedPromo?.code
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        Alert.alert(
          'Order Placed Successfully!',
          `Your order #${data.order._id} has been placed. You will receive a confirmation email shortly.`,
          [
            {
              text: 'View Order',
              onPress: () => navigation.navigate('OrderDetail', { orderId: data.order._id })
            },
            {
              text: 'Continue Shopping',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderSummary = () => {
    const totals = calculateTotals();

    return (
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
          Order Summary
        </Text>
        
        {cartItems.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={[styles.orderItemName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {item.name}
              </Text>
              <Text style={[styles.orderItemDetails, { color: isDarkMode ? '#ccc' : '#666' }]}>
                Qty: {item.quantity}
                {item.selectedSize && ` | Size: ${item.selectedSize}`}
                {item.selectedColor && ` | Color: ${item.selectedColor}`}
              </Text>
            </View>
            <Text style={[styles.orderItemPrice, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.totalBreakdown}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Subtotal
            </Text>
            <Text style={[styles.totalValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${totals.subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Shipping
            </Text>
            <Text style={[styles.totalValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${totals.shipping.toFixed(2)}
            </Text>
          </View>
          
          {totals.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: '#4caf50' }]}>
                Discount
              </Text>
              <Text style={[styles.totalValue, { color: '#4caf50' }]}>
                -${totals.discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Tax
            </Text>
            <Text style={[styles.totalValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${totals.tax.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={[styles.totalLabel, { color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }]}>
              ${totals.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderShippingAddress = () => {
    return (
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Shipping Address
          </Text>
          <TouchableOpacity onPress={() => setShowNewAddressForm(true)}>
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {savedAddresses.map((address, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.addressItem,
              selectedAddress?._id === address._id && styles.selectedAddress
            ]}
            onPress={() => setSelectedAddress(address)}
          >
            <View style={styles.addressInfo}>
              <Text style={[styles.addressName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {address.firstName} {address.lastName}
              </Text>
              <Text style={[styles.addressText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                {address.street}
              </Text>
              <Text style={[styles.addressText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                {address.city}, {address.state} {address.zipCode}
              </Text>
              <Text style={[styles.addressText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                {address.country}
              </Text>
              {address.phone && (
                <Text style={[styles.addressText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                  {address.phone}
                </Text>
              )}
            </View>
            {selectedAddress?._id === address._id && (
              <Ionicons name="checkmark-circle" size={24} color="#007bff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Payment Method
          </Text>
          <TouchableOpacity onPress={() => setShowNewPaymentForm(true)}>
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {paymentMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paymentItem,
              selectedPaymentMethod?._id === method._id && styles.selectedPayment
            ]}
            onPress={() => setSelectedPaymentMethod(method)}
          >
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentType, { color: isDarkMode ? '#fff' : '#333' }]}>
                {method.cardType} •••• {method.last4}
              </Text>
              <Text style={[styles.paymentExpiry, { color: isDarkMode ? '#ccc' : '#666' }]}>
                Expires {method.expiryMonth}/{method.expiryYear}
              </Text>
            </View>
            {selectedPaymentMethod?._id === method._id && (
              <Ionicons name="checkmark-circle" size={24} color="#007bff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderShippingMethod = () => {
    return (
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
          Shipping Method
        </Text>
        
        {shippingMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.shippingItem,
              shippingMethod === method.id && styles.selectedShipping
            ]}
            onPress={() => setShippingMethod(method.id)}
          >
            <View style={styles.shippingInfo}>
              <Text style={[styles.shippingName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {method.name}
              </Text>
              <Text style={[styles.shippingDays, { color: isDarkMode ? '#ccc' : '#666' }]}>
                {method.days}
              </Text>
            </View>
            <Text style={[styles.shippingPrice, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${method.price.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <ScrollView>
        {/* Order Summary */}
        {renderOrderSummary()}

        {/* Promo Code */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Promo Code
          </Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={[styles.promoInput, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Enter promo code"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity
              style={[styles.promoButton, { backgroundColor: '#007bff' }]}
              onPress={applyPromoCode}
            >
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Address */}
        {renderShippingAddress()}

        {/* Shipping Method */}
        {renderShippingMethod()}

        {/* Payment Method */}
        {renderPaymentMethod()}

        {/* Order Notes */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Order Notes (Optional)
          </Text>
          <TextInput
            style={[styles.notesInput, { 
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              color: isDarkMode ? '#fff' : '#333',
              borderColor: isDarkMode ? '#444' : '#ddd'
            }]}
            placeholder="Add any special instructions..."
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomBar, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, { backgroundColor: '#007bff' }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* New Address Modal */}
      {showNewAddressForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Add New Address
              </Text>
              <TouchableOpacity onPress={() => setShowNewAddressForm(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="First Name"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.firstName}
              onChangeText={(text) => setAddressForm({ ...addressForm, firstName: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Last Name"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.lastName}
              onChangeText={(text) => setAddressForm({ ...addressForm, lastName: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Street Address"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.street}
              onChangeText={(text) => setAddressForm({ ...addressForm, street: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="City"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.city}
              onChangeText={(text) => setAddressForm({ ...addressForm, city: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="State"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.state}
              onChangeText={(text) => setAddressForm({ ...addressForm, state: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="ZIP Code"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.zipCode}
              onChangeText={(text) => setAddressForm({ ...addressForm, zipCode: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Country"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.country}
              onChangeText={(text) => setAddressForm({ ...addressForm, country: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Phone (Optional)"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={addressForm.phone}
              onChangeText={(text) => setAddressForm({ ...addressForm, phone: text })}
              keyboardType="phone-pad"
            />
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#007bff' }]}
              onPress={handleSaveAddress}
            >
              <Text style={styles.modalButtonText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* New Payment Method Modal */}
      {showNewPaymentForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Add Payment Method
              </Text>
              <TouchableOpacity onPress={() => setShowNewPaymentForm(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Card Number"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={paymentForm.cardNumber}
              onChangeText={(text) => setPaymentForm({ ...paymentForm, cardNumber: text })}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="MM/YY"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={paymentForm.expiryDate}
              onChangeText={(text) => setPaymentForm({ ...paymentForm, expiryDate: text })}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="CVV"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={paymentForm.cvv}
              onChangeText={(text) => setPaymentForm({ ...paymentForm, cvv: text })}
              keyboardType="numeric"
              secureTextEntry
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Cardholder Name"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={paymentForm.cardholderName}
              onChangeText={(text) => setPaymentForm({ ...paymentForm, cardholderName: text })}
            />
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#007bff' }]}
              onPress={handleSavePaymentMethod}
            >
              <Text style={styles.modalButtonText}>Save Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addNewText: {
    color: '#007bff',
    fontSize: 14,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderItemDetails: {
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalBreakdown: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 10,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  promoButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedAddress: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPayment: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paymentExpiry: {
    fontSize: 14,
  },
  shippingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedShipping: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  shippingInfo: {
    flex: 1,
  },
  shippingName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shippingDays: {
    fontSize: 14,
  },
  shippingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  placeOrderButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
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

export default CheckoutScreen;
