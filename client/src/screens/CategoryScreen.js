import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const slideAnim = new Animated.Value(0);

  const filters = [
    { id: 'newest', label: 'Newest', icon: 'time-outline' },
    { id: 'popular', label: 'Popular', icon: 'trending-up-outline' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'arrow-up-outline' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'arrow-down-outline' },
    { id: 'rating', label: 'Highest Rated', icon: 'star-outline' }
  ];

  const categories = [
    { id: 'smartwatches', name: 'Smartwatches', icon: 'watch' },
    { id: 'smart-lights', name: 'Smart Lights', icon: 'bulb' },
    { id: 'spy-glasses', name: 'Spy Glasses', icon: 'eye' },
    { id: 'gadgets', name: 'Gadgets', icon: 'phone-portrait' },
    { id: 'gifts', name: 'Gifts', icon: 'gift' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedFilter, priceRange, selectedCategories]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Sort filter
    switch (selectedFilter) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleFilters = () => {
    Animated.timing(slideAnim, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowFilters(!showFilters);
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
          {item.name}
        </Text>
        
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
              {item.averageRating?.toFixed(1) || '4.5'}
            </Text>
          </View>
          
          <Text style={[styles.productPrice, { color: isDarkMode ? '#FFD700' : '#007bff' }]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>
        
        {item.originalPrice && item.originalPrice > item.price && (
          <Text style={[styles.originalPrice, { color: isDarkMode ? '#999999' : '#888888' }]}>
            ${item.originalPrice.toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        selectedFilter === item.id && styles.selectedFilterItem
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={selectedFilter === item.id ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666')} 
      />
      <Text style={[
        styles.filterText,
        { color: selectedFilter === item.id ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666') }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategories.includes(item.id) && styles.selectedCategoryItem
      ]}
      onPress={() => {
        if (selectedCategories.includes(item.id)) {
          setSelectedCategories(selectedCategories.filter(cat => cat !== item.id));
        } else {
          setSelectedCategories([...selectedCategories, item.id]);
        }
      }}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategories.includes(item.id) ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666')} 
      />
      <Text style={[
        styles.categoryText,
        { color: selectedCategories.includes(item.id) ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666') }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#ffffff' : '#333333'} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        
        <TouchableOpacity onPress={toggleFilters}>
          <Ionicons name="filter" size={24} color={isDarkMode ? '#ffffff' : '#333333'} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }]}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#999999' : '#666666'} />
          <TextInput
            style={[styles.searchInput, { color: isDarkMode ? '#ffffff' : '#333333' }]}
            placeholder="Search products..."
            placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters Panel */}
      <Animated.View
        style={[
          styles.filtersPanel,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200]
            }),
            opacity: slideAnim
          }
        ]}
      >
        {showFilters && (
          <View style={styles.filtersContent}>
            {/* Sort Filters */}
            <Text style={[styles.filterSectionTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              Sort By
            </Text>
            <FlatList
              data={filters}
              renderItem={renderFilterItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
            />

            {/* Categories */}
            <Text style={[styles.filterSectionTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              Categories
            </Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
            />
          </View>
        )}
      </Animated.View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={isDarkMode ? '#666666' : '#cccccc'} />
            <Text style={[styles.emptyText, { color: isDarkMode ? '#666666' : '#999999' }]}>
              No products found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersPanel: {
    overflow: 'hidden',
  },
  filtersContent: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filtersList: {
    marginBottom: 20,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedFilterItem: {
    backgroundColor: '#007bff',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
  },
  selectedCategoryItem: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  productsContainer: {
    padding: 10,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 30) / 2,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default CategoryScreen;
