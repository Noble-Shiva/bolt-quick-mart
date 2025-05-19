import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search as SearchIcon, X, History, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { searchProducts } from '@/api/products';
import { debounce } from '@/utils/helpers';
import SearchPredictionSkeleton from '@/components/search/SearchPredictionSkeleton';
import ProductPredictionSkeleton from '@/components/search/ProductPredictionSkeleton';
import ProductPredictionCard from '@/components/search/ProductPredictionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;
const MAX_TEXT_PREDICTIONS = 5;
const MAX_PRODUCT_PREDICTIONS = 8;

// Mock text predictions API
const getTextPredictions = async (query: string): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock predictions based on query
  const basePredictions = [
    'fresh vegetables',
    'fresh fruits',
    'fresh milk',
    'fresh bread',
    'fresh meat',
    'frozen pizza',
    'frozen vegetables',
    'frozen meals',
    'organic products',
    'organic vegetables'
  ];
  
  return basePredictions
    .filter(pred => pred.toLowerCase().includes(query.toLowerCase()))
    .slice(0, MAX_TEXT_PREDICTIONS);
};

export default function SearchScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const inputRef = useRef<TextInput>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [textPredictions, setTextPredictions] = useState<string[]>([]);
  const [productPredictions, setProductPredictions] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
    if (Platform.OS === 'web') {
      inputRef.current?.focus();
    }
  }, []);
  
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };
  
  const saveSearchHistory = async (query: string) => {
    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };
  
  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };
  
  const removeHistoryItem = async (query: string) => {
    try {
      const updatedHistory = searchHistory.filter(item => item !== query);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  };
  
  const fetchPredictions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setTextPredictions([]);
      setProductPredictions([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const [textResults, productResults] = await Promise.all([
        getTextPredictions(query),
        searchProducts(query)
      ]);
      
      setTextPredictions(textResults);
      setProductPredictions(productResults.slice(0, MAX_PRODUCT_PREDICTIONS));
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setTextPredictions([]);
      setProductPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const debouncedFetch = useCallback(
    debounce((query: string) => fetchPredictions(query), 300),
    [fetchPredictions]
  );
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedFetch(text);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setTextPredictions([]);
    setProductPredictions([]);
  };
  
  const handlePredictionPress = async (prediction: string) => {
    await saveSearchHistory(prediction);
    router.push({
      pathname: '/search',
      params: { query: prediction }
    });
  };
  
  const handleProductPress = async (product: any) => {
    await saveSearchHistory(product.name);
    router.push(`/product/${product.id}`);
  };
  
  const renderSearchHistory = () => {
    if (!searchHistory.length) return null;
    
    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <View style={styles.historyTitleContainer}>
            <History size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            <Text variant="body" weight="semibold" style={styles.historyTitle}>
              Recent Searches
            </Text>
          </View>
          
          <TouchableOpacity onPress={clearSearchHistory}>
            <Text variant="body-sm" weight="medium" color="accent">
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
        
        {searchHistory.map((query, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => handlePredictionPress(query)}
          >
            <History size={16} color={isDark ? '#999999' : '#666666'} />
            <Text variant="body" style={styles.historyText}>
              {query}
            </Text>
            <TouchableOpacity
              onPress={() => removeHistoryItem(query)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <X size={16} color={isDark ? '#999999' : '#666666'} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderPredictions = () => {
    if (isLoading) {
      return (
        <ScrollView style={styles.predictionsContainer}>
          <SearchPredictionSkeleton />
          <ProductPredictionSkeleton />
        </ScrollView>
      );
    }
    
    if (!searchQuery) {
      return renderSearchHistory();
    }
    
    return (
      <ScrollView style={styles.predictionsContainer}>
        {textPredictions.length > 0 && (
          <View style={styles.section}>
            <Text variant="body-sm" color="secondary" style={styles.sectionTitle}>
              Suggestions
            </Text>
            
            {textPredictions.map((prediction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.predictionItem}
                onPress={() => handlePredictionPress(prediction)}
              >
                <SearchIcon size={16} color={isDark ? '#999999' : '#666666'} />
                <Text variant="body" style={styles.predictionText}>
                  {prediction}
                </Text>
                <ArrowRight size={16} color={isDark ? '#999999' : '#666666'} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {productPredictions.length > 0 && (
          <View style={styles.section}>
            <Text variant="body-sm" color="secondary" style={styles.sectionTitle}>
              Products
            </Text>
            
            <View style={styles.productsGrid}>
              {productPredictions.map((product) => (
                <ProductPredictionCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
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
            ref={inputRef}
            style={[
              styles.searchInput,
              { color: isDark ? '#FFFFFF' : '#333333' }
            ]}
            placeholder="Search for products..."
            placeholderTextColor={isDark ? '#888888' : '#999999'}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            autoFocus={Platform.OS === 'web'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {renderPredictions()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  predictionsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  predictionText: {
    flex: 1,
    marginLeft: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  historyContainer: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
  },
});