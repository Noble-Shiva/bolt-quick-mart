import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { searchProducts, fetchCategories } from '@/api/products';
import ProductCard from '@/components/search/ProductCard';
import FilterModal from '@/components/search/FilterModal';
import { debounce } from '@/utils/helpers';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

// Get screen width to calculate sidebar width (20% of screen)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.2; // 20% of screen width

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(params.category || null);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    sortBy: 'popularity',
    inStock: true,
  });
  
  useEffect(() => {
    loadCategories();
    
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);
  
  useEffect(() => {
    performSearch();
  }, [selectedCategory, filters]);
  
  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };
  
  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchProducts(searchQuery, selectedCategory, filters);
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const debouncedSearch = useCallback(
    debounce(() => {
      performSearch();
    }, 500),
    [searchQuery, selectedCategory, filters]
  );
  
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch();
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    performSearch();
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };
  
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <View style={[
          styles.searchContainer, 
          { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
        ]}>
          <SearchIcon size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          <TextInput
            style={[
              styles.searchInput, 
              { color: isDark ? '#FFFFFF' : '#333333' }
            ]}
            placeholder="Search for products..."
            placeholderTextColor={isDark ? '#888888' : '#999999'}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal size={20} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {/* Categories Sidebar - 20% width */}
        <View style={[
          styles.categoriesSidebar,
          {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRightColor: isDark ? '#333333' : '#EEEEEE',
            width: SIDEBAR_WIDTH,
          }
        ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.selectedCategoryItem,
                  selectedCategory === item.id && { backgroundColor: isDark ? '#2A1A10' : colors.primary[50] }
                ]}
                onPress={() => handleCategorySelect(item.id)}
              >
                <View style={[
                  styles.categoryIconContainer,
                  { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                ]}>
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                </View>
                <Text
                  variant="body-sm"
                  weight={selectedCategory === item.id ? "semibold" : "regular"}
                  color={selectedCategory === item.id ? 'accent' : 'primary'}
                  style={styles.categoryName}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Products Grid - 80% width */}
        <View style={styles.productsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[700]} />
            </View>
          ) : (
            <FlatList
              data={products}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => handleProductPress(item.id)}
                  onAddToCart={() => addToCart(item)}
                />
              )}
              contentContainerStyle={styles.productsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text variant="body" color="secondary" style={styles.emptyText}>
                    {searchQuery.length > 0
                      ? 'No products found. Try a different search term or category.'
                      : 'Search for products by name, category, or description.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
      
      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={applyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  categoriesSidebar: {
    borderRightWidth: 1,
    height: '100%',
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 10,
  },
  selectedCategoryItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
  },
  productsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    // padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
});