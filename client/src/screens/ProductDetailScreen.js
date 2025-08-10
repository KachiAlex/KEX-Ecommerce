import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator
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

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { addToCart, isInCart, getCartItemQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    fetchRelatedProducts();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products?category=${product?.category}&limit=4&exclude=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      Alert.alert('Select Color', 'Please select a color before adding to cart');
      return;
    }

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };

    addToCart(cartItem);
    Alert.alert('Success', 'Product added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to continue with purchase');
      navigation.navigate('Login');
      return;
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      Alert.alert('Select Size', 'Please select a size before purchasing');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      Alert.alert('Select Color', 'Please select a color before purchasing');
      return;
    }

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };

    addToCart(cartItem);
    navigation.navigate('Checkout');
  };

  const handleAddReview = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add a review');
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Review Required', 'Please write a review');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          rating,
          comment: reviewText
        })
      });

      if (response.ok) {
        setReviewText('');
        setRating(0);
        setShowReviewForm(false);
        fetchReviews();
        Alert.alert('Success', 'Review added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert('Error', 'Failed to add review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#ffd700"
      />
    ));
  };

  const renderImageGallery = () => {
    if (!product?.images || product.images.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.image || 'https://via.placeholder.com/300' }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>
      );
    }

    return (
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: product.images[selectedImage] }}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
          {product.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.thumbnail,
                selectedImage === index && styles.selectedThumbnail
              ]}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSizeSelector = () => {
    if (!product?.sizes || product.sizes.length === 0) return null;

    return (
      <View style={styles.selectorContainer}>
        <Text style={[styles.selectorTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
          Size
        </Text>
        <View style={styles.optionContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                selectedSize === size && styles.selectedOption
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.optionText,
                selectedSize === size && styles.selectedOptionText
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderColorSelector = () => {
    if (!product?.colors || product.colors.length === 0) return null;

    return (
      <View style={styles.selectorContainer}>
        <Text style={[styles.selectorTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
          Color
        </Text>
        <View style={styles.optionContainer}>
          {product.colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorOption
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderQuantitySelector = () => {
    return (
      <View style={styles.quantityContainer}>
        <Text style={[styles.selectorTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
          Quantity
        </Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: isDarkMode ? '#fff' : '#333' }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderReviews = () => {
    return (
      <View style={styles.reviewsContainer}>
        <View style={styles.reviewsHeader}>
          <Text style={[styles.reviewsTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Reviews ({reviews.length})
          </Text>
          <TouchableOpacity onPress={() => setShowReviewForm(true)}>
            <Text style={styles.addReviewText}>Add Review</Text>
          </TouchableOpacity>
        </View>
        
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={[styles.reviewerName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {review.user.name}
              </Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
            </View>
            <Text style={[styles.reviewText, { color: isDarkMode ? '#ccc' : '#666' }]}>
              {review.comment}
            </Text>
            <Text style={[styles.reviewDate, { color: isDarkMode ? '#999' : '#888' }]}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#333' }]}>
          Loading product details...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#333' }]}>
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <ScrollView>
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Product Info */}
        <View style={[styles.productInfo, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.productName, { color: isDarkMode ? '#fff' : '#333' }]}>
            {product.name}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: isDarkMode ? '#fff' : '#333' }]}>
              ${product.price.toFixed(2)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={[styles.originalPrice, { color: isDarkMode ? '#999' : '#888' }]}>
                ${product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(Math.round(product.averageRating || 0))}
            </View>
            <Text style={[styles.ratingText, { color: isDarkMode ? '#ccc' : '#666' }]}>
              ({product.reviewCount || 0} reviews)
            </Text>
          </View>

          <Text style={[styles.description, { color: isDarkMode ? '#ccc' : '#666' }]}>
            {product.description}
          </Text>

          {/* Size Selector */}
          {renderSizeSelector()}

          {/* Color Selector */}
          {renderColorSelector()}

          {/* Quantity Selector */}
          {renderQuantitySelector()}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <View style={styles.featuresContainer}>
              <Text style={[styles.featuresTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Features
              </Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                  <Text style={[styles.featureText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Reviews */}
        {renderReviews()}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <View style={[styles.relatedContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.relatedTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              Related Products
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((relatedProduct) => (
                <TouchableOpacity
                  key={relatedProduct._id}
                  style={styles.relatedProduct}
                  onPress={() => navigation.push('ProductDetail', { productId: relatedProduct._id })}
                >
                  <Image
                    source={{ uri: relatedProduct.image }}
                    style={styles.relatedProductImage}
                  />
                  <Text style={[styles.relatedProductName, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {relatedProduct.name}
                  </Text>
                  <Text style={[styles.relatedProductPrice, { color: isDarkMode ? '#ccc' : '#666' }]}>
                    ${relatedProduct.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={24} color="#007bff" />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Review Form Modal */}
      {showReviewForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Write a Review
              </Text>
              <TouchableOpacity onPress={() => setShowReviewForm(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingSelector}>
              <Text style={[styles.ratingLabel, { color: isDarkMode ? '#fff' : '#333' }]}>
                Rating:
              </Text>
              <View style={styles.starsSelector}>
                {Array.from({ length: 5 }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(index + 1)}
                  >
                    <Ionicons
                      name={index < rating ? 'star' : 'star-outline'}
                      size={24}
                      color="#ffd700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TextInput
              style={[styles.reviewInput, { 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#333',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }]}
              placeholder="Write your review..."
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#007bff' }]}
              onPress={handleAddReview}
            >
              <Text style={styles.modalButtonText}>Submit Review</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
  imageGallery: {
    marginBottom: 10,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: width,
    height: 300,
  },
  thumbnailContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#007bff',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  productInfo: {
    padding: 20,
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#007bff',
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 10,
  },
  reviewsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addReviewText: {
    color: '#007bff',
    fontSize: 14,
  },
  reviewItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
  },
  relatedContainer: {
    padding: 20,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  relatedProduct: {
    width: 120,
    marginRight: 15,
  },
  relatedProductImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  relatedProductPrice: {
    fontSize: 12,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cartButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#007bff',
    flexDirection: 'row',
  },
  cartButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buyButton: {
    backgroundColor: '#007bff',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
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
  ratingSelector: {
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  starsSelector: {
    flexDirection: 'row',
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
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

export default ProductDetailScreen;
