import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star, Minus, Plus, ShoppingCart, Heart, MessageSquare } from 'lucide-react-native';
import { fetchProductById } from '@/api/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { formatPrice, calculateDiscountedPrice } from '@/utils/helpers';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';

// Sample reviews data
const sampleReviews = [
  {
    id: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and it arrived earlier than expected.',
    date: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Very good product. The only reason I\'m not giving 5 stars is because the packaging was slightly damaged.',
    date: '2023-06-10T11:15:00Z',
  },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews] = useState(sampleReviews);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
        setIsFavorite(isInWishlist(id));
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadProduct();
    }
  }, [id, isInWishlist]);
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Show success message
      Alert.alert(
        "Added to Cart",
        `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
        [
          {
            text: "Continue Shopping",
            style: "cancel"
          },
          { 
            text: "View Cart", 
            onPress: () => router.push('/cart')
          }
        ]
      );
    }
  };
  
  const toggleFavorite = () => {
    if (product) {
      if (isFavorite) {
        removeFromWishlist(product.id);
        Alert.alert("Removed from Wishlist", `${product.name} has been removed from your wishlist.`);
      } else {
        addToWishlist(product);
        Alert.alert("Added to Wishlist", `${product.name} has been added to your wishlist.`);
      }
      setIsFavorite(!isFavorite);
    }
  };
  
  const navigateToReviews = () => {
    router.push('/product/reviews');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
        <Text variant="body" weight="medium">
          Loading product details...
        </Text>
      </View>
    );
  }
  
  if (error || !product) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
        <Text variant="body" color="error">
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: colors.primary[600] }]}
          onPress={() => router.back()}
        >
          <Text variant="body-sm" weight="semibold" color="inverse">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <BackButton />
        
        <TouchableOpacity 
          style={[
            styles.favoriteButton, 
            { backgroundColor: isFavorite ? colors.primary[700] : (isDark ? '#2A2A2A' : '#FFFFFF') }
          ]} 
          onPress={toggleFavorite}
        >
          <Heart 
            size={16} 
            color={isFavorite ? '#FFFFFF' : colors.primary[700]} 
            fill={isFavorite ? '#FFFFFF' : 'none'} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage} 
            resizeMode="cover" 
          />
          
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>
        
        <View style={[
          styles.detailsContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <Text variant="h3" weight="bold">
            {product.name}
          </Text>
          
          <TouchableOpacity 
            style={styles.ratingContainer}
            onPress={navigateToReviews}
          >
            <Star size={18} color="#FFB800" fill="#FFB800" />
            <Text variant="body-sm" color="secondary" style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.ratingCount} reviews)
            </Text>
            <ChevronRight size={16} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          <View style={styles.priceContainer}>
            <Text variant="h4" weight="bold" color="accent">
              {formatPrice(discountedPrice)}
            </Text>
            
            {product.discount > 0 && (
              <Text variant="body" color="tertiary" style={styles.originalPrice}>
                {formatPrice(product.price)}
              </Text>
            )}
          </View>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          <Text variant="h4" weight="semibold">
            Description
          </Text>
          
          <Text variant="body" color="secondary" style={styles.description}>
            {product.description}
          </Text>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text variant="h4" weight="semibold">
                Reviews
              </Text>
              <TouchableOpacity onPress={navigateToReviews}>
                <Text variant="body-sm" weight="medium" color="accent">See All</Text>
              </TouchableOpacity>
            </View>
            
            {reviews.length > 0 ? (
              reviews.slice(0, 2).map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text variant="body" weight="semibold">
                      {review.userName}
                    </Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={12} 
                          color="#FFB800" 
                          fill={i < review.rating ? "#FFB800" : "none"}
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                  <Text variant="body-sm" color="secondary" numberOfLines={2}>
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              <Text variant="body" color="secondary" style={styles.noReviewsText}>
                No reviews yet. Be the first to review this product!
              </Text>
            )}
            
            <TouchableOpacity 
              style={[styles.writeReviewButton, { backgroundColor: colors.primary[600] }]}
              onPress={navigateToReviews}
            >
              <MessageSquare size={16} color="#FFFFFF" />
              <Text variant="body-sm" weight="semibold" color="inverse" style={styles.writeReviewText}>
                Write a Review
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          <View style={styles.quantityContainer}>
            <Text variant="body" weight="semibold">
              Quantity
            </Text>
            
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[
                  styles.quantityButton,
                  { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
                ]} 
                onPress={() => handleQuantityChange(-1)}
              >
                <Minus size={20} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
              
              <Text variant="body" weight="semibold" style={styles.quantityValue}>
                {quantity}
              </Text>
              
              <TouchableOpacity 
                style={[
                  styles.quantityButton,
                  { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
                ]} 
                onPress={() => handleQuantityChange(1)}
              >
                <Plus size={20} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={[
        styles.footer, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <View style={styles.totalContainer}>
          <Text variant="body-sm" color="secondary">
            Total Price
          </Text>
          <Text variant="h4" weight="bold" color="accent">
            {formatPrice(discountedPrice * quantity)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary[600] }]} 
          onPress={handleAddToCart}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text variant="body" weight="semibold" color="inverse" style={styles.addToCartButtonText}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ChevronRight = ({ size, color }) => (
  <Text style={{ fontSize: size, color, marginLeft: 4 }}>›</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    zIndex: 10,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF4500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  detailsContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 24,
  },
  reviewsSection: {
    marginVertical: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  noReviewsText: {
    fontStyle: 'italic',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  writeReviewText: {
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  totalContainer: {
    flex: 1,
  },
  addToCartButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    marginLeft: 8,
  },
});