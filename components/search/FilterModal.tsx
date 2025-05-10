import { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/context/ThemeContext';
import { Text, Button } from '@/components/ui';
import { colors } from '@/utils/theme';

interface FilterModalProps {
  visible: boolean;
  filters: {
    priceRange: [number, number];
    sortBy: string;
    inStock: boolean;
  };
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterModal({ visible, filters, onClose, onApply }: FilterModalProps) {
  const { isDark } = useTheme();
  
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);
  
  const handleSortSelect = (sortBy: string) => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };
  
  const handleInStockToggle = () => {
    setLocalFilters(prev => ({ ...prev, inStock: !prev.inStock }));
  };
  
  const handlePriceChange = (value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }));
  };
  
  const handleReset = () => {
    setLocalFilters({
      priceRange: [0, 100],
      sortBy: 'popularity',
      inStock: true,
    });
  };
  
  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <View style={[
            styles.modalHeader, 
            { borderBottomColor: isDark ? '#333333' : '#EEEEEE' }
          ]}>
            <Text variant="h4" weight="semibold">Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>Sort By</Text>
              
              <View style={styles.sortOptions}>
                {[
                  { id: 'popularity', label: 'Popularity' },
                  { id: 'price_low', label: 'Price: Low to High' },
                  { id: 'price_high', label: 'Price: High to Low' },
                  { id: 'newest', label: 'Newest First' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                      localFilters.sortBy === option.id && { backgroundColor: colors.primary[700] }
                    ]}
                    onPress={() => handleSortSelect(option.id)}
                  >
                    <Text
                      variant="body-sm"
                      weight="medium"
                      color={localFilters.sortBy === option.id ? 'inverse' : 'secondary'}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>Price Range</Text>
              
              <View style={styles.priceRangeContainer}>
                <Text variant="body" weight="medium">
                  ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                </Text>
                
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={localFilters.priceRange[1]}
                  onValueChange={handlePriceChange}
                  minimumTrackTintColor={colors.primary[700]}
                  maximumTrackTintColor={isDark ? '#444444' : '#DDDDDD'}
                  thumbTintColor={colors.primary[700]}
                  step={1}
                />
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <View style={styles.switchRow}>
                <Text variant="body" weight="medium">
                  In Stock Only
                </Text>
                <Switch
                  value={localFilters.inStock}
                  onValueChange={handleInStockToggle}
                  trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </ScrollView>
          
          <View style={[
            styles.modalFooter, 
            { borderTopColor: isDark ? '#333333' : '#EEEEEE' }
          ]}>
            <Button
              variant="secondary"
              style={styles.resetButton}
              onPress={handleReset}
            >
              Reset
            </Button>
            
            <Button
              variant="primary"
              style={styles.applyButton}
              onPress={handleApply}
            >
              Apply Filters
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});