import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShoppingBag, Tag, Info } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'info';
  read: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order #1002 has been delivered successfully.',
      time: '10 min ago',
      type: 'order',
      read: false,
    },
    {
      id: '2',
      title: 'Special Offer',
      message: 'Get 20% off on all grocery items this weekend!',
      time: '2 hours ago',
      type: 'promo',
      read: false,
    },
    {
      id: '3',
      title: 'New Payment Method',
      message: 'You can now pay using Apple Pay on our platform.',
      time: '1 day ago',
      type: 'info',
      read: true,
    },
    {
      id: '4',
      title: 'Order Confirmed',
      message: 'Your order #1001 has been confirmed and is being prepared.',
      time: '2 days ago',
      type: 'order',
      read: true,
    },
    {
      id: '5',
      title: 'Weekend Flash Sale',
      message: 'Don\'t miss our flash sale this weekend! Up to 50% off on selected items.',
      time: '3 days ago',
      type: 'promo',
      read: true,
    },
  ]);
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={24} color={colors.primary[600]} />;
      case 'promo':
        return <Tag size={24} color="#4CAF50" />;
      case 'info':
        return <Info size={24} color="#2196F3" />;
      default:
        return <Info size={24} color={colors.primary[600]} />;
    }
  };
  
  const getIconContainerStyle = (type: string) => {
    switch (type) {
      case 'order':
        return styles.iconContainer;
      case 'promo':
        return [styles.iconContainer, styles.promoIconContainer];
      case 'info':
        return [styles.iconContainer, styles.infoIconContainer];
      default:
        return styles.iconContainer;
    }
  };
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
        !item.read && { 
          backgroundColor: isDark ? '#2A1A10' : '#FFF0EB' 
        }
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={getIconContainerStyle(item.type)}>
        {getIconForType(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <Text variant="body" weight="semibold">
          {item.title}
        </Text>
        <Text variant="body-sm" color="secondary" style={styles.notificationMessage}>
          {item.message}
        </Text>
        <Text variant="caption" color="tertiary">
          {item.time}
        </Text>
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
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
        <BackButton />
        <Text variant="h4" weight="semibold">Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text variant="body-sm" weight="medium" color="accent">Mark all as read</Text>
        </TouchableOpacity>
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyImagePlaceholder}>
            <Text variant="body" color="tertiary">No Notifications</Text>
          </View>
          <Text variant="h3" weight="bold" style={styles.emptyTitle}>
            No notifications yet
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            We'll notify you when there are new messages or updates.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promoIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  infoIconContainer: {
    backgroundColor: '#E3F2FD',
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    marginVertical: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[600],
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
});