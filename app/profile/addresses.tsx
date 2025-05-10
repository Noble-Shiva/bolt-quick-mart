import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, MapPin, CreditCard as Edit, Trash, Check } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';

// Sample addresses data
const sampleAddresses = [
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
  },
  {
    id: '3',
    name: 'Parent\'s House',
    address: '789 Family Road',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    isDefault: false,
  }
];

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  
  const setDefaultAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(address => ({
        ...address,
        isDefault: address.id === id
      }))
    );
  };
  
  const deleteAddress = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            setAddresses(prev => {
              const filteredAddresses = prev.filter(address => address.id !== id);
              
              // If we deleted the default address, set a new default
              if (prev.find(address => address.id === id)?.isDefault && filteredAddresses.length > 0) {
                filteredAddresses[0].isDefault = true;
              }
              
              return filteredAddresses;
            });
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const editAddress = (id: string) => {
    // In a real app, this would navigate to an edit address form
    Alert.alert("Edit Address", "This would open an edit address form in a real app.");
  };
  
  const addNewAddress = () => {
    // In a real app, this would navigate to an add address form
    Alert.alert("Add Address", "This would open an add address form in a real app.");
  };
  
  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[
      styles.addressCard, 
      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
    ]}>
      <View style={styles.addressHeader}>
        <View style={styles.addressNameContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={20} color={colors.primary[700]} />
          </View>
          <Text variant="body" weight="semibold">
            {item.name}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text variant="caption" weight="medium" color="accent">Default</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => editAddress(item.id)}
          >
            <Edit size={16} color={colors.primary[600]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => deleteAddress(item.id)}
          >
            <Trash size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.addressDetails}>
        <Text variant="body-sm" color="secondary">
          {item.address}
        </Text>
        <Text variant="body-sm" color="secondary">
          {item.city}, {item.state} {item.zipCode}
        </Text>
      </View>
      
      {!item.isDefault && (
        <TouchableOpacity 
          style={styles.setDefaultButton}
          onPress={() => setDefaultAddress(item.id)}
        >
          <Check size={16} color={colors.primary[600]} />
          <Text variant="body-sm" weight="medium" color="accent" style={styles.setDefaultText}>
            Set as Default
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
        <Text variant="h4" weight="semibold">My Addresses</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.addressesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MapPin size={80} color={isDark ? '#333333' : '#EEEEEE'} />
            <Text variant="h3" weight="bold" style={styles.emptyTitle}>
              No addresses found
            </Text>
            <Text variant="body" color="secondary" style={styles.emptyText}>
              You haven't added any addresses yet.
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary[600] }]}
        onPress={addNewAddress}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text variant="body" weight="semibold" color="inverse" style={styles.addButtonText}>
          Add New Address
        </Text>
      </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  addressesList: {
    padding: 16,
    paddingBottom: 80,
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addressDetails: {
    marginBottom: 12,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: 8,
  },
});