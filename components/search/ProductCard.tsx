import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, Star, Heart, Plus, Minus } from 'lucide-react-native';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { Text, Badge } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';
import ProductOptionsSheet from '../home/ProductOptionsSheet';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  quantity: string;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity?: string;
  variants?: ProductVariant[];
  hasOptions?: boolean;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const { isDark } = useTheme();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [optionsVisible, setOptionsVisible] = useState(false);
  
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;
  
  const isFavorite = isInWishlist(product.id);
  
  // Check if product is in cart and get its quantity
  const cartItem = items.find(item => item.id === product.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  
  // Sample variants for demonstration
  const productVariants: ProductVariant[] = product.variants || [
    {
      id: `${product.id}-1`,
      name: "1 pack (6 x 50 g)",
      price: product.price,
      discountedPrice: discountedPrice,
      originalPrice: product.price,
      discount: product.discount || 0,
      quantity: "300g",
      inStock: true
    },
    {
      id: `${product.id}-2`,
      name: "2 x 6 x 50 g",
      price: product.price * 1.9,
      discountedPrice: (product.price * 1.9) * (1 - (product.discount || 0) / 100),
      originalPrice: product.price * 2,
      discount: product.discount ? product.discount + 1 : 5,
      quantity: "600g",
      inStock: true
    },
    {
      id: `${product.id}-3`,
      name: "3 x 6 x 50 g",
      price: product.price * 2.8,
      discountedPrice: (product.price * 2.8) * (1 - (product.discount || 0) / 100),
      originalPrice: product.price * 3,
      discount: product.discount ? product.discount + 2 : 7,
      quantity: "900g",
      inStock: true
    }
  ];
  
  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (product.hasOptions) {
      setOptionsVisible(true);
    } else {
      onAddToCart();
    }
  };
  
  const handleIncrement = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (itemQuantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, itemQuantity - 1);
    }
  };
  
  const handleSelectVariant = (variant: ProductVariant) => {
    // In a real app, you would add the selected variant to the cart
    // For now, we'll just close the modal
    setOptionsVisible(false);
  };
  
  // Display weight/volume/quantity info
  const displayInfo = product.weight || product.volume || product.quantity || '';
  
  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Paper tear discount badge */}
        {product.discount > 0 && (
          <View style={styles.discountBadgeContainer}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
            <View style={styles.discountBadgeTear} />
          </View>
        )}
        
        {/* Delivery time indicator */}
        <View style={styles.deliveryTimeContainer}>
          <View style={styles.deliveryTimeIcon}>
            <Text style={styles.clockIcon}>🕒</Text>
          </View>
          <Text variant="caption" color="tertiary" style={styles.deliveryTime}>
            30 MINS
          </Text>
        </View>
        
        {/* Product image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>
        
        {/* Product details */}
        <View style={styles.contentContainer}>
          {/* Product name */}
          <Text 
            variant="body-sm" 
            weight="medium" 
            numberOfLines={2}
            style={styles.name}
          >
            {product.name}
          </Text>
          
          {/* Weight/volume info */}
          {displayInfo && (
            <Text variant="caption" color="tertiary" style={styles.weightInfo}>
              {displayInfo}
            </Text>
          )}
          
          {/* Price section */}
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text variant="body" weight="semibold">
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
            
            {/* Add button or quantity controls */}
            {itemQuantity > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={handleDecrement}
                >
                  <Minus size={14} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text variant="body-sm" weight="semibold" style={styles.quantityText}>
                  {itemQuantity}
                </Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={handleIncrement}
                >
                  <Plus size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddToCart}
              >
                <Text variant="body-sm" weight="semibold" color="inverse">
                  {product.hasOptions ? "ADD" : "ADD"}
                </Text>
                {product.hasOptions && (
                  <Text variant="caption" color="inverse" style={styles.optionsText}>
                    {productVariants.length} options
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Wishlist button */}
        <TouchableOpacity 
          style={[
            styles.wishlistButton, 
            isFavorite && { backgroundColor: colors.primary[700] }
          ]}
          onPress={handleToggleWishlist}
        >
          <Heart 
            size={16} 
            color={isFavorite ? '#FFFFFF' : colors.primary[700]} 
            fill={isFavorite ? '#FFFFFF' : 'none'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Product Options Bottom Sheet */}
      <ProductOptionsSheet
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        product={product}
        variants={productVariants}
        onSelectVariant={handleSelectVariant}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  discountBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  discountBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  discountBadgeTear: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    width: 10,
    height: 5,
    backgroundColor: '#0055CC', // Darker shade for the tear effect
    borderBottomLeftRadius: 5,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  deliveryTimeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  deliveryTimeIcon: {
    marginRight: 2,
  },
  clockIcon: {
    fontSize: 10,
  },
  deliveryTime: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  name: {
    height: 36,
    marginBottom: 4,
  },
  weightInfo: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  optionsText: {
    fontSize: 8,
    marginTop: -2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingHorizontal: 2,
    height: 28,
  },
  quantityButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 2,
    minWidth: 16,
    textAlign: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
});