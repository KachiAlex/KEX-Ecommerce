import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { addToCart, getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    // Mock data - replace with API calls
    setTimeout(() => {
      setFeaturedProducts([
      {
        _id: '1',
        name: 'Smart Watch Pro',
        price: 299.99,
        discountPrice: 249.99,
        image: 'https://via.placeholder.com/300x300/2E7D32/FFFFFF?text=Smart+Watch',
        category: 'Smartwatches',
        rating: 4.5,
        reviews: 128,
      },
      {
        _id: '2',
        name: 'LED Smart Bulb',
        price: 49.99,
        discountPrice: 39.99,
        image: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Smart+Bulb',
        category: 'Smart Lights',
        rating: 4.2,
        reviews: 89,
      },
      {
        _id: '3',
        name: 'Spy Camera Glasses',
        price: 199.99,
        discountPrice: 179.99,
        image: 'https://via.placeholder.com/300x300/FFC107/FFFFFF?text=Spy+Glasses',
        category: 'Spy Gadgets',
        rating: 4.7,
        reviews: 156,
      },
    ]);

    setCategories([
      { id: '1', name: 'Smartwatches', icon: 'watch', color: '#2E7D32' },
      { id: '2', name: 'Smart Lights', icon: 'lightbulb', color: '#FF6B35' },
      { id: '3', name: 'Spy Gadgets', icon: 'visibility', color: '#FFC107' },
      { id: '4', name: 'Gift Items', icon: 'card-giftcard', color: '#9C27B0' },
    ]);

    setBanners([
      { id: '1', image: 'https://via.placeholder.com/400x200/2E7D32/FFFFFF?text=Special+Offer', title: 'Special Offer' },
      { id: '2', image: 'https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=New+Arrivals', title: 'New Arrivals' },
    ]);
    setLoading(false);
  }, 1500);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductSkeleton = () => (
    <SkeletonPlaceholder>
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <View style={styles.productImage} />
        </View>
        <View style={styles.productInfo}>
          <View style={{ height: 16, width: '80%', marginBottom: 8 }} />
          <View style={{ height: 12, width: '60%', marginBottom: 8 }} />
          <View style={{ height: 20, width: '40%', marginBottom: 12 }} />
          <View style={{ height: 40, width: '100%' }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  const renderProduct = ({ item }) => (
    <Animatable.View animation="fadeInUp" delay={100} style={styles.productCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        style={styles.productImageContainer}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discountPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.productRating}>
          <Icon name="star" size={14} color={theme.colors.accent} />
          <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
            {item.rating} ({item.reviews})
          </Text>
        </View>
        
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
        
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => addToCart(item)}
        >
          <Icon name="add-shopping-cart" size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('Categories', { category: item })}
    >
      <Icon name={item.icon} size={32} color="#FFFFFF" />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>
              {isAuthenticated ? `Hello, ${user?.name || 'User'}!` : 'Welcome to KEX!'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Discover amazing products
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Icon name="search" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Icon name="shopping-cart" size={24} color={theme.colors.primary} />
              {getCartCount() > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: theme.colors.secondary }]}>
                  <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.searchPlaceholder, { color: theme.colors.textSecondary }]}>
            Search products, categories...
          </Text>
        </TouchableOpacity>

        {/* Banner Carousel */}
        <View style={styles.bannerSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Special Offers
          </Text>
          <Carousel
            data={banners}
            renderItem={renderBanner}
            sliderWidth={width - 32}
            itemWidth={width - 32}
            loop
            autoplay
            autoplayInterval={5000}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Shop by Category
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animatable.View
                key={category.id}
                animation="fadeInUp"
                delay={index * 100}
              >
                {renderCategory({ item: category })}
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Featured Products
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {loading ? (
              // Show skeleton loading
              Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={styles.productWrapper}>
                  {renderProductSkeleton()}
                </View>
              ))
            ) : (
              // Show actual products
              featuredProducts.map((product, index) => (
                <Animatable.View
                  key={product._id}
                  animation="fadeInUp"
                  delay={index * 100}
                  style={styles.productWrapper}
                >
                  {renderProduct({ item: product })}
                </Animatable.View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
  },
  bannerSection: {
    marginBottom: 24,
  },
  bannerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  productsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  productWrapper: {
    width: (width - 44) / 2,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
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
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
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
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default HomeScreen; 