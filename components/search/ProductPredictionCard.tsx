import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface ProductPredictionCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    ratingCount: number;
    discount?: number;
  };
  onPress: () => void;
}

export default function ProductPredictionCard({ product, onPress }: ProductPredictionCardProps) {
  const { isDark } = useTheme();
  
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text variant="body-sm" weight="medium" numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFB800" fill="#FFB800" />
          <Text variant="caption" color="secondary" style={styles.rating}>
            {product.rating} ({product.ratingCount})
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text variant="body-sm" weight="semibold">
            {formatPrice(discountedPrice)}
          </Text>
          
          {product.discount > 0 && (
            <Text 
              variant="caption" 
              color="tertiary" 
              style={styles.originalPrice}
            >
              {formatPrice(product.price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH - 24,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    marginBottom: 4,
    height: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
});