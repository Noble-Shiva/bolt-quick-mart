import { Tabs } from 'expo-router';
import { useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import { useCart } from '@/context/CartContext';
import CartBadge from '@/components/cart/CartBadge';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/utils/theme';

// Import icons from lucide-react-native
import { Chrome as Home, Search, ShoppingBag, MessageCircle, User, Settings, Tag } from 'lucide-react-native';

// Custom animated icon component
const AnimatedIcon = ({ 
  focused, 
  Icon, 
  color, 
  size 
}: { 
  focused: boolean; 
  Icon: any; 
  color: string; 
  size: number 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [focused, scaleAnim, opacityAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View 
      style={{ 
        transform: [
          { scale: scaleAnim },
          { rotate }
        ],
        opacity: opacityAnim
      }}
    >
      <Icon 
        size={size} 
        color={color} 
        strokeWidth={focused ? 2.5 : 1.8} 
      />
    </Animated.View>
  );
};

export default function TabLayout() {
  const { isDark } = useTheme();
  const { totalItems } = useCart();
  
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: isDark ? colors.neutral[400] : colors.neutral[500],
        tabBarStyle: {
          backgroundColor: isDark ? colors.neutral[900] : '#FFFFFF',
          borderTopColor: isDark ? colors.neutral[800] : colors.neutral[200],
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          marginTop: 0,
          paddingTop: 0,
        },
        headerShown: false, // Remove headers from all tab screens
        tabBarIcon: ({ color, size, focused }) => {
          let Icon;
          
          if (route.name === 'index') {
            Icon = Home;
          } else if (route.name === 'search') {
            Icon = Search;
          } else if (route.name === 'cart') {
            Icon = ShoppingBag;
          } else if (route.name === 'offers') {
            Icon = Tag;
          } else if (route.name === 'support') {
            Icon = MessageCircle;
          } else if (route.name === 'profile') {
            Icon = User;
          } else if (route.name === 'settings') {
            Icon = Settings;
          }
          
          return (
            <AnimatedIcon 
              focused={focused} 
              Icon={Icon} 
              color={color} 
              size={size} 
            />
          );
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <AnimatedIcon 
                focused={focused} 
                Icon={ShoppingBag} 
                color={color} 
                size={size} 
              />
              {totalItems > 0 && <CartBadge count={totalItems} />}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Offers',
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}