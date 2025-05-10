import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Moon, Bell, Globe, Lock, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Smartphone, Zap, Upload } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { theme, isDark, setTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleDeploy = () => {
    router.push('/deploy');
  };
  
  const toggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };
  
  const toggleSystemTheme = (value: boolean) => {
    if (value) {
      setTheme('system');
    } else {
      setTheme(isDark ? 'dark' : 'light');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text variant="h3" weight="bold">Settings</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Preferences
          </Text>
          
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
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
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Moon size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Dark Mode
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                thumbColor="#FFFFFF"
                disabled={theme === 'system'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Globe size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Use System Theme
              </Text>
              <Switch
                value={theme === 'system'}
                onValueChange={toggleSystemTheme}
                trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Globe size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Location Services
              </Text>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            App
          </Text>
          
          <View style={[styles.card, isDark && styles.cardDark]}>
            <TouchableOpacity style={styles.settingItem} onPress={handleDeploy}>
              <View style={styles.settingIconContainer}>
                <Upload size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Deploy App
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Performance Mode', 'This feature optimizes the app for better performance.')}
            >
              <View style={styles.settingIconContainer}>
                <Zap size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Performance Mode
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('App Version', 'QuickMart v1.0.0')}
            >
              <View style={styles.settingIconContainer}>
                <Smartphone size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                App Version
              </Text>
              <Text variant="body-sm" color="tertiary" style={styles.versionText}>1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Security & Privacy
          </Text>
          
          <View style={[styles.card, isDark && styles.cardDark]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Change Password', 'This would allow you to change your password in a real app.')}
            >
              <View style={styles.settingIconContainer}>
                <Lock size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Change Password
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Privacy Policy', 'This would show the privacy policy in a real app.')}
            >
              <View style={styles.settingIconContainer}>
                <Info size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Privacy Policy
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Support
          </Text>
          
          <View style={[styles.card, isDark && styles.cardDark]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/support')}
            >
              <View style={styles.settingIconContainer}>
                <HelpCircle size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                Help Center
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('About Us', 'This would show information about the company in a real app.')}
            >
              <View style={styles.settingIconContainer}>
                <Info size={20} color={colors.primary[700]} />
              </View>
              <Text variant="body" weight="medium" style={styles.settingText}>
                About Us
              </Text>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.signOutButton, isDark && styles.signOutButtonDark]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={isDark ? '#FFFFFF' : colors.primary[700]} />
          <Text 
            variant="body" 
            weight="medium" 
            color={isDark ? 'inverse' : 'accent'} 
            style={styles.signOutText}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text variant="caption" color="tertiary">
            © 2025 QuickMart. All rights reserved.
          </Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 12,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 56,
  },
  versionText: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  signOutButtonDark: {
    backgroundColor: colors.primary[700],
  },
  signOutText: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
});