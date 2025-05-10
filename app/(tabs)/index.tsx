import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { fetchCategories, fetchFeaturedProducts, fetchRecentOrders } from '@/api/products';
import CategoryList from '@/components/home/CategoryList';
import FeaturedProductList from '@/components/home/FeaturedProductList';
import OrderCard from '@/components/home/OrderCard';
import NotificationBadge from '@/components/home/NotificationBadge';
import LocationHeader from '@/components/home/LocationHeader';
import BannerCarousel from '@/components/home/BannerCarousel';
import MultiBanner from '@/components/home/MultiBannerCarousel';
import MultiBannerSkeleton from '@/components/skeletons/MultiBannerSkeleton';
import { Text } from '@/components/ui';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  const topBanners = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Fresh Groceries',
      subtitle: 'Get 20% off on your first order'
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Organic Produce',
      subtitle: 'Farm fresh vegetables delivered daily'
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Premium Meats',
      subtitle: 'Quality cuts at great prices'
    }
  ];

  const middleBanners = [
    {
      id: '4',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Healthy Snacks',
      subtitle: 'Buy 2 Get 1 Free'
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Dairy Products',
      subtitle: 'Fresh from local farms'
    }
  ];

  const bottomBanners = [
    {
      id: '6',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Weekend Special',
      subtitle: 'Up to 40% off on fresh fruits'
    },
    {
      id: '7',
      image: 'https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Bakery Items',
      subtitle: 'Freshly baked everyday'
    }
  ];
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, productsData, ordersData] = await Promise.all([
        fetchCategories(),
        fetchFeaturedProducts(),
        fetchRecentOrders()
      ]);
      
      setCategories(categoriesData);
      setFeaturedProducts(productsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };
  
  const handleOrderPress = (orderId) => {
    router.push(`/order-tracking/${orderId}`);
  };
  
  const handleNotificationPress = () => {
    router.push('/notifications');
  };
  
  const handleCategoryPress = (categoryId) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <LocationHeader currentAddress="123 Main Street, Apt 4B" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BannerCarousel 
          data={topBanners} 
          style={styles.topBanner}
          isLoading={isLoading}
        />
        
        <CategoryList 
          categories={categories} 
          onCategoryPress={handleCategoryPress}
          isLoading={isLoading}
        />

        {/* <BannerCarousel 
          data={middleBanners} 
          style={styles.middleBanner}
          isLoading={isLoading}
        /> */}

        {/* Multi Banner below categories */}
        {isLoading ? (
          <MultiBannerSkeleton />
        ) : (
          <MultiBanner 
            title="Seasonal Promotions" 
          />
        )}
        
        <FeaturedProductList 
          products={featuredProducts} 
          onProductPress={handleProductPress}
          onAddToCart={addToCart}
          isLoading={isLoading}
        />

        <BannerCarousel 
          data={bottomBanners} 
          style={styles.bottomBanner}
          isLoading={isLoading}
        />
        
        {recentOrders.length > 0 && (
          <View style={styles.recentOrdersSection}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semibold">Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push('/profile/orders')}>
                <Text variant="body-sm" weight="medium" color="accent">See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onPress={() => handleOrderPress(order.id)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentOrdersSection: {
    marginBottom: 24,
  },
  spacer: {
    height: 100,
  },
});