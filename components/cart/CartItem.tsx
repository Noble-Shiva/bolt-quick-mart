import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { formatPrice, calculateDiscountedPrice } from '@/utils/helpers';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    discount?: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { isDark } = useTheme();
  
  const discountedPrice = calculateDiscountedPrice(item.price, item.discount || 0);
  const totalPrice = discountedPrice * item.quantity;
  
  return (
    <View style={[
      styles.cartItem, 
      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
    ]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text variant="body" weight="medium" numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text variant="body" weight="semibold">
            {formatPrice(discountedPrice)}
          </Text>
          
          {item.discount > 0 && (
            <Text variant="body-sm" color="tertiary" style={styles.originalPrice}>
              {formatPrice(item.price)}
            </Text>
          )}
        </View>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
          
          <Text variant="body" weight="medium" style={styles.quantityText}>
            {item.quantity}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={20} color={colors.primary[700]} />
        </TouchableOpacity>
        
        <Text variant="body" weight="semibold" color="accent">
          {formatPrice(totalPrice)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
  },
  rightContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 8,
  },
});