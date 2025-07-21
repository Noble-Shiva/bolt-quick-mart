import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Tag, Clock, Star, ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { Text, Card } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';

// Sample offers data
const sampleOffers = [
  {
    id: '1',
    title: 'Flash Sale',
    description: 'Up to 50% off on selected items',
    discount: '50% OFF',
    validUntil: '2025-01-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    products: [
      {
        id: '1',
        name: 'Fresh Spinach',
        price: 1.99,
        discountedPrice: 0.99,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300&auto=format&fit=crop',
        discount: 50
      },
      {
        id: '3',
        name: 'Red Apples',
        price: 3.99,
        discountedPrice: 1.99,
        image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=300&auto=format&fit=crop',
        discount: 50
      }
    ]
  },
  {
    id: '2',
    title: 'Weekend Special',
    description: 'Buy 2 Get 1 Free on dairy products',
    discount: 'Buy 2 Get 1',
    validUntil: '2025-01-26T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop',
    products: [
      {
        id: '5',
        name: 'Whole Milk',
        price: 2.99,
        discountedPrice: 2.99,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300&auto=format&fit=crop',
        discount: 0
      },
      {
        id: '6',
        name: 'Greek Yogurt',
        price: 4.49,
        discountedPrice: 4.49,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=300&auto=format&fit=crop',
        discount: 0
      }
    ]
  },
  {
    id: '3',
    title: 'New Year Deal',
    description: '25% off on all bakery items',
    discount: '25% OFF',
    validUntil: '2025-01-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1585478259715-4d3a5f4a8b71?q=80&w=800&auto=format&fit=crop',
    products: [
      {
        id: '7',
        name: 'Sourdough Bread',
        price: 4.99,
        discountedPrice: 3.74,
        image: 'https://images.unsplash.com/photo-1585478259715-4d3a5f4a8b71?q=80&w=300&auto=format&fit=crop',
        discount: 25
      },
      {
        id: '8',
        name: 'Chocolate Croissants',
        price: 6.99,
        discountedPrice: 5.24,
        image: 'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=300&auto=format&fit=crop',
        discount: 25
      }
    ]
  }
];

export default function OffersScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  
  const [offers, setOffers] = useState(sampleOffers);
  
  const getTimeRemaining = (validUntil: string) => {
    const now = new Date().getTime();
    const endTime = new Date(validUntil).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };
  
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };
  
  const handleAddToCart = (product: any) => {
    addToCart(product);
  };
  
  const renderOfferCard = ({ item }: { item: any }) => (
    <Card style={[styles.offerCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.offerHeader}>
        <Image source={{ uri: item.image }} style={styles.offerImage} />
        <View style={styles.discountBadge}>
          <Text variant="body-sm" weight="bold" color="inverse">
            {item.discount}
          </Text>
        </View>
      </View>
      
      <View style={styles.offerContent}>
        <Text variant="h4" weight="semibold" style={styles.offerTitle}>
          {item.title}
        </Text>
        <Text variant="body-sm" color="secondary" style={styles.offerDescription}>
          {item.description}
        </Text>
        
        <View style={styles.timeContainer}>
          <Clock size={16} color={colors.primary[600]} />
          <Text variant="body-sm" weight="medium" color="accent" style={styles.timeText}>
            {getTimeRemaining(item.validUntil)}
          </Text>
        </View>
        
        <Text variant="body" weight="semibold" style={styles.productsTitle}>
          Featured Products
        </Text>
        
        <FlatList
          data={item.products}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(product) => product.id}
          renderItem={({ item: product }) => (
            <TouchableOpacity 
              style={styles.productItem}
              onPress={() => handleProductPress(product.id)}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text variant="body-sm" weight="medium" numberOfLines={2} style={styles.productName}>
                {product.name}
              </Text>
              <View style={styles.productPriceContainer}>
                <Text variant="body-sm" weight="semibold" color="accent">
                  {formatPrice(product.discountedPrice)}
                </Text>
                {product.discount > 0 && (
                  <Text variant="caption" color="tertiary" style={styles.originalPrice}>
                    {formatPrice(product.price)}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddToCart(product)}
              >
                <ShoppingCart size={14} color="#FFFFFF" />
                <Text variant="caption" weight="semibold" color="inverse" style={styles.addButtonText}>
                  ADD
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.productsList}
        />
      </View>
    </Card>
  );

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
        <View style={styles.headerContent}>
          <Tag size={24} color={colors.primary[600]} />
          <Text variant="h3" weight="bold" style={styles.headerTitle}>
            Special Offers
          </Text>
        </View>
        <Text variant="body-sm" color="secondary">
          Limited time deals just for you
        </Text>
      </View>
      
      <FlatList
        data={offers}
        renderItem={renderOfferCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.offersList}
        showsVerticalScrollIndicator={false}
      />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    marginLeft: 8,
  },
  offersList: {
    padding: 16,
  },
  offerCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  offerHeader: {
    position: 'relative',
    height: 150,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary[600],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    marginBottom: 4,
  },
  offerDescription: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    marginLeft: 6,
  },
  productsTitle: {
    marginBottom: 12,
  },
  productsList: {
    paddingRight: 8,
  },
  productItem: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  productName: {
    height: 32,
    marginBottom: 4,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addButtonText: {
    marginLeft: 4,
  },
});