import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  FlatList,
  ImageBackground
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2; // Two cards with spacing

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
}

interface MultiBannerProps {
  title: string;
  onItemPress?: (item: BannerItem) => void;
}

const bannerItems = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500',
    title: 'Fresh Fruits'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=500',
    title: 'Vegetables'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?q=80&w=500',
    title: 'Dairy'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=500',
    title: 'Bakery'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1628689469738-3535dac9e2f9?q=80&w=500',
    title: 'Meat'
  }
];

export default function MultiBanner({ title, onItemPress }: MultiBannerProps) {
  const { isDark } = useTheme();
  
  const renderItem = ({ item }: { item: BannerItem }) => {
    return (
      <TouchableOpacity 
        style={styles.bannerItem}
        activeOpacity={0.8}
        onPress={() => onItemPress?.(item)}
      >
        <ImageBackground 
          source={{ uri: item.imageUrl }}
          style={styles.bannerImage}
          imageStyle={styles.bannerImageStyle}
        >
          <View style={styles.overlay}>
            <Text variant="body" weight="semibold" style={styles.title}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">{title}</Text>
      </View>
      
      <FlatList
        data={bannerItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  bannerItem: {
    width: CARD_WIDTH,
    height: 120,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bannerImageStyle: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
  },
  title: {
    marginBottom: 4,
    color: 'white',
  },
});
