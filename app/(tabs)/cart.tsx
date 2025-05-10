import { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import CartItem from '@/components/cart/CartItem';
import { formatPrice } from '@/utils/helpers';
import { Text, Button } from '@/components/ui';
import { colors } from '@/utils/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, totalItems, subtotal, discount, total } = useCart();
  const { isDark } = useTheme();
  
  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };
  
  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => removeFromCart(id),
          style: "destructive"
        }
      ]
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
        <Text variant="h3" weight="bold">Shopping Cart</Text>
        <Text variant="body-sm" color="secondary">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <CartItem 
                item={item} 
                onRemove={handleRemoveItem}
                onUpdateQuantity={updateQuantity}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={[
            styles.summaryContainer, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderTopColor: isDark ? '#333333' : '#EEEEEE' 
            }
          ]}>
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Subtotal</Text>
              <Text variant="body" weight="medium">
                {formatPrice(subtotal)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Discount</Text>
              <Text variant="body" weight="medium" color="success">
                -{formatPrice(discount)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Delivery Fee</Text>
              <Text variant="body" weight="medium">
                Free
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
            
            <View style={styles.summaryRow}>
              <Text variant="body" weight="semibold">Total</Text>
              <Text variant="h4" weight="bold" color="accent">
                {formatPrice(total)}
              </Text>
            </View>
            
            <Button
              variant="primary"
              style={styles.checkoutButton}
              onPress={handleCheckout}
              rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
            >
              Proceed to Checkout
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?q=80&w=300&auto=format&fit=crop' }}
            style={styles.emptyImage}
          />
          <Text variant="h3" weight="bold" style={styles.emptyTitle}>
            Your cart is empty
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <Button
            variant="primary"
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}
          >
            Start Shopping
          </Button>
        </View>
      )}
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
  cartList: {
    padding: 16,
  },
  summaryContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  checkoutButton: {
    height: 56,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    paddingHorizontal: 32,
    height: 56,
  },
});