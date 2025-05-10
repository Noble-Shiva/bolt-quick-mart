import { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { User, MapPin, CreditCard, Bell, ShieldCheck, CircleHelp as HelpCircle, LogOut, ChevronRight, ShoppingBag, Heart } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDark, setTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const navigateToOrders = () => {
    router.push('/profile/orders');
  };
  
  const navigateToAddresses = () => {
    router.push('/profile/addresses');
  };
  
  const navigateToPaymentMethods = () => {
    router.push('/profile/payment-methods');
  };
  
  const navigateToWishlist = () => {
    router.push('/profile/wishlist');
  };
  
  const toggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text variant="h3" weight="bold">Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&auto=format&fit=crop' }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text variant="h4" weight="semibold" style={styles.profileName}>
              {user?.name || 'Guest User'}
            </Text>
            <Text variant="body-sm" color="secondary" style={styles.profileEmail}>
              {user?.email || 'guest@example.com'}
            </Text>
            
            <TouchableOpacity style={styles.editButton}>
              <Text variant="body-sm" weight="medium" color="accent">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            My Account
          </Text>
          
          <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={navigateToOrders}
            >
              <View style={styles.optionIconContainer}>
                <ShoppingBag size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                My Orders
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={navigateToWishlist}
            >
              <View style={styles.optionIconContainer}>
                <Heart size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                My Wishlist
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={navigateToAddresses}
            >
              <View style={styles.optionIconContainer}>
                <MapPin size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                My Addresses
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={navigateToPaymentMethods}
            >
              <View style={styles.optionIconContainer}>
                <CreditCard size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                Payment Methods
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Preferences
          </Text>
          
          <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Bell size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <ShieldCheck size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                Dark Mode
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Support
          </Text>
          
          <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => router.push('/support')}
            >
              <View style={styles.optionIconContainer}>
                <HelpCircle size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.optionText}>
                Help Center
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={isDark ? '#FFFFFF' : colors.primary[700]} />
          <Text 
            variant="body" 
            weight="medium" 
            color={isDark ? 'inverse' : 'accent'} 
            style={styles.logoutText}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text variant="caption" color="tertiary">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333333',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCardDark: {
    backgroundColor: '#1E1E1E',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    marginBottom: 4,
  },
  profileEmail: {
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#FFF0EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 12,
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionsCardDark: {
    backgroundColor: '#1E1E1E',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 56,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButtonDark: {
    backgroundColor: colors.primary[700],
  },
  logoutText: {
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
});