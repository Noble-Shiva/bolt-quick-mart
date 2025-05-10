import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text, BackButton, Button } from '@/components/ui';
import OrderItem from '@/components/profile/OrderItem';
import { colors } from '@/utils/theme';

// Sample order data
const sampleOrders = [
  {
    id: '1001',
    date: '2023-06-15T14:30:00Z',
    status: 'delivered',
    total: 35.97,
    items: [
      { id: '1', name: 'Organic Avocado', quantity: 2, price: 2.99 },
      { id: '7', name: 'Potato Chips Variety Pack', quantity: 1, price: 8.99 },
      { id: '8', name: 'Sparkling Water 12-Pack', quantity: 2, price: 9.99 }
    ]
  },
  {
    id: '1002',
    date: '2023-06-10T11:15:00Z',
    status: 'delivered',
    total: 89.99,
    items: [
      { id: '3', name: 'Wireless Earbuds', quantity: 1, price: 89.99 }
    ]
  },
  {
    id: '1003',
    date: '2023-06-05T09:45:00Z',
    status: 'delivered',
    total: 42.96,
    items: [
      { id: '5', name: 'Facial Moisturizer', quantity: 1, price: 18.99 },
      { id: '9', name: 'Fresh Strawberries', quantity: 2, price: 4.99 },
      { id: '1', name: 'Organic Avocado', quantity: 1, price: 2.99 },
      { id: '10', name: 'Pain Relief Tablets', quantity: 1, price: 7.99 }
    ]
  },
  {
    id: '1004',
    date: '2023-06-01T16:20:00Z',
    status: 'cancelled',
    total: 32.99,
    items: [
      { id: '6', name: 'Premium Dog Food', quantity: 1, price: 32.99 }
    ]
  },
  {
    id: '1005',
    date: '2023-05-28T13:10:00Z',
    status: 'delivered',
    total: 27.97,
    items: [
      { id: '7', name: 'Potato Chips Variety Pack', quantity: 1, price: 8.99 },
      { id: '9', name: 'Fresh Strawberries', quantity: 2, price: 4.99 },
      { id: '10', name: 'Pain Relief Tablets', quantity: 1, price: 7.99 }
    ]
  }
];

type FilterType = 'all' | 'delivered' | 'processing' | 'cancelled';

export default function OrdersScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [orders, setOrders] = useState(sampleOrders);
  
  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order-tracking/${orderId}`);
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
        <BackButton />
        <Text variant="h4" weight="semibold">My Orders</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={[
        styles.filtersContainer, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <ScrollableFilter 
          options={[
            { value: 'all', label: 'All Orders' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'processing', label: 'Processing' },
            { value: 'cancelled', label: 'Cancelled' }
          ]}
          activeValue={activeFilter}
          onChange={(value) => setActiveFilter(value as FilterType)}
          isDark={isDark}
        />
      </View>
      
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderItem 
              order={item} 
              onPress={() => handleOrderPress(item.id)}
              isDark={isDark}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Filter size={80} color={isDark ? '#333333' : '#EEEEEE'} />
          <Text variant="h3" weight="bold" style={styles.emptyTitle}>
            No {activeFilter !== 'all' ? activeFilter : ''} orders found
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            {activeFilter !== 'all' 
              ? `You don't have any ${activeFilter} orders yet.`
              : 'You haven\'t placed any orders yet. Start shopping to see your orders here.'}
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

interface FilterOption {
  value: string;
  label: string;
}

interface ScrollableFilterProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

function ScrollableFilter({ options, activeValue, onChange, isDark }: ScrollableFilterProps) {
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterScrollContainer}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.filterOption,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
            activeValue === option.value && { backgroundColor: colors.primary[600] }
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text
            variant="body-sm"
            weight="medium"
            color={activeValue === option.value ? 'inverse' : 'secondary'}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  placeholder: {
    width: 40,
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  ordersList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 24,
    height: 48,
  },
});