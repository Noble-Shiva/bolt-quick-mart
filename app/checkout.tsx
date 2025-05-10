import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CreditCard, MapPin, Truck, ShoppingBag, Check } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { Text, BackButton, Button } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sample addresses
const addresses = [
  {
    id: '1',
    name: 'Home',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Work',
    address: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10022',
    isDefault: false,
  }
];

// Sample payment methods
const paymentMethods = [
  {
    id: '1',
    type: 'visa',
    cardNumber: '**** **** **** 4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    cardNumber: '**** **** **** 5555',
    expiryDate: '10/24',
    isDefault: false,
  }
];

// Sample delivery options
const deliveryOptions = [
  {
    id: '1',
    name: 'Express Delivery',
    description: 'Delivery within 30 minutes',
    price: 2.99,
    estimatedTime: '30 min',
  },
  {
    id: '2',
    name: 'Standard Delivery',
    description: 'Delivery within 1 hour',
    price: 0,
    estimatedTime: '60 min',
  }
];

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, subtotal, discount, total, clearCart } = useCart();
  const { isDark } = useTheme();
  
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(addr => addr.isDefault)?.id || '');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods.find(pm => pm.isDefault)?.id || '');
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const deliveryFee = selectedDeliveryOption?.price || 0;
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderPlaced(true);
      
      // Simulate order confirmation and redirect
      setTimeout(() => {
        clearCart();
        router.replace('/order-tracking/1001');
      }, 2000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE',
          paddingTop: insets.top
        }
      ]}>
        <BackButton />
        <Text variant="h4" weight="semibold">Checkout</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isOrderPlaced ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Check size={40} color="#FFFFFF" />
          </View>
          <Text variant="h3" weight="bold" style={styles.successTitle}>
            Order Placed!
          </Text>
          <Text variant="body" color="secondary" style={styles.successText}>
            Your order has been placed successfully. You will be redirected to the order tracking page.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Delivery Address Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <MapPin size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Delivery Address
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
                  <Text variant="body-sm" weight="medium" color="accent">Add New</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressItem,
                      selectedAddress === address.id && { 
                        borderColor: colors.primary[700],
                        backgroundColor: isDark ? '#2A1A10' : '#FFF0EB' 
                      }
                    ]}
                    onPress={() => setSelectedAddress(address.id)}
                  >
                    <View style={styles.addressRadio}>
                      <View style={[
                        styles.radioOuter,
                        selectedAddress === address.id && { borderColor: colors.primary[700] }
                      ]}>
                        {selectedAddress === address.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.addressDetails}>
                      <View style={styles.addressHeader}>
                        <Text variant="body" weight="semibold">
                          {address.name}
                        </Text>
                        {address.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text variant="caption" weight="medium" color="accent">
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text variant="body-sm" color="secondary">
                        {address.address}
                      </Text>
                      <Text variant="body-sm" color="secondary">
                        {address.city}, {address.state} {address.zipCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Payment Method Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <CreditCard size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Payment Method
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile/payment-methods')}>
                  <Text variant="body-sm" weight="medium" color="accent">Add New</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {paymentMethods.map((payment) => (
                  <TouchableOpacity
                    key={payment.id}
                    style={[
                      styles.paymentItem,
                      selectedPayment === payment.id && { 
                        borderColor: colors.primary[700],
                        backgroundColor: isDark ? '#2A1A10' : '#FFF0EB' 
                      }
                    ]}
                    onPress={() => setSelectedPayment(payment.id)}
                  >
                    <View style={styles.paymentRadio}>
                      <View style={[
                        styles.radioOuter,
                        selectedPayment === payment.id && { borderColor: colors.primary[700] }
                      ]}>
                        {selectedPayment === payment.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.paymentDetails}>
                      <View style={styles.paymentHeader}>
                        <Text variant="body" weight="semibold">
                          {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                        </Text>
                        {payment.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text variant="caption" weight="medium" color="accent">
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text variant="body-sm" color="secondary">
                        {payment.cardNumber}
                      </Text>
                      <Text variant="body-sm" color="secondary">
                        Expires {payment.expiryDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Delivery Options Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Truck size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Delivery Options
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {deliveryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.deliveryItem,
                      selectedDelivery === option.id && { 
                        borderColor: colors.primary[700],
                        backgroundColor: isDark ? '#2A1A10' : '#FFF0EB' 
                      }
                    ]}
                    onPress={() => setSelectedDelivery(option.id)}
                  >
                    <View style={styles.deliveryRadio}>
                      <View style={[
                        styles.radioOuter,
                        selectedDelivery === option.id && { borderColor: colors.primary[700] }
                      ]}>
                        {selectedDelivery === option.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.deliveryDetails}>
                      <View style={styles.deliveryHeader}>
                        <Text variant="body" weight="semibold">
                          {option.name}
                        </Text>
                        <Text variant="body" weight="semibold" color={option.price === 0 ? 'success' : 'primary'}>
                          {option.price === 0 ? 'Free' : formatPrice(option.price)}
                        </Text>
                      </View>
                      
                      <View style={styles.deliveryInfo}>
                        <Text variant="body-sm" color="secondary">
                          {option.description}
                        </Text>
                        <Text variant="body-sm" color="secondary">
                          Est. {option.estimatedTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Order Summary Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <ShoppingBag size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Order Summary
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/cart')}>
                  <Text variant="body-sm" weight="medium" color="accent">Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {items.map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.orderItemQuantity}>
                      <Text variant="body" weight="semibold">
                        {item.quantity}x
                      </Text>
                    </View>
                    
                    <View style={styles.orderItemDetails}>
                      <Text variant="body" weight="medium">
                        {item.name}
                      </Text>
                    </View>
                    
                    <Text variant="body" weight="semibold">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}
                
                <View style={[
                  styles.divider, 
                  { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
                ]} />
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Subtotal
                  </Text>
                  <Text variant="body" weight="medium">
                    {formatPrice(subtotal)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Discount
                  </Text>
                  <Text variant="body" weight="medium" color="success">
                    -{formatPrice(discount)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Delivery Fee
                  </Text>
                  <Text variant="body" weight="medium" color={deliveryFee === 0 ? 'success' : 'primary'}>
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </Text>
                </View>
                
                <View style={[
                  styles.divider, 
                  { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
                ]} />
                
                <View style={styles.totalItem}>
                  <Text variant="body" weight="semibold">
                    Total
                  </Text>
                  <Text variant="h4" weight="bold" color="accent">
                    {formatPrice(finalTotal)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.spacer} />
          </ScrollView>
          
          <View style={[
            styles.footer, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderTopColor: isDark ? '#333333' : '#EEEEEE',
              paddingBottom: insets.bottom + 16
            }
          ]}>
            <View style={styles.footerContent}>
              <View style={styles.totalContainer}>
                <Text variant="body-sm" color="secondary">
                  Total
                </Text>
                <Text variant="h4" weight="bold" color="accent">
                  {formatPrice(finalTotal)}
                </Text>
              </View>
              
              <Button
                variant="primary"
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
                isLoading={isProcessing}
                disabled={isProcessing}
              >
                Place Order
              </Button>
            </View>
          </View>
        </>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 8,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  addressRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[700],
  },
  addressDetails: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  paymentRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  deliveryRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  orderItemQuantity: {
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  placeOrderButton: {
    width: 150,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
  },
});