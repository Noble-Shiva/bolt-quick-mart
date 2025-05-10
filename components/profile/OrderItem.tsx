import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Package } from 'lucide-react-native';

interface OrderItemProps {
  order: {
    id: string;
    date: string;
    status: string;
    total: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  onPress: () => void;
  isDark: boolean;
}

export default function OrderItem({ order, onPress, isDark }: OrderItemProps) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'processing':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666666';
    }
  };
  
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <TouchableOpacity 
      style={[styles.container, isDark && styles.containerDark]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, isDark && styles.orderIdDark]}>
            Order #{order.id}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) + '20' }
          ]}
        >
          <Text 
            style={[
              styles.statusText, 
              { color: getStatusColor(order.status) }
            ]}
          >
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemsContainer}>
        <Package size={16} color={isDark ? '#BBBBBB' : '#666666'} />
        <Text style={[styles.itemsText, isDark && styles.itemsTextDark]}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.totalLabel, isDark && styles.totalLabelDark]}>
          Total:
        </Text>
        <Text style={[styles.totalValue, isDark && styles.totalValueDark]}>
          ${order.total.toFixed(2)}
        </Text>
        <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  orderIdDark: {
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginLeft: 8,
  },
  itemsTextDark: {
    color: '#BBBBBB',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginRight: 8,
  },
  totalLabelDark: {
    color: '#BBBBBB',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginRight: 8,
  },
  totalValueDark: {
    color: '#FFFFFF',
  },
});