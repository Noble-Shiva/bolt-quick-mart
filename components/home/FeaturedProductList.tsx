import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import ProductCard from '@/components/home/ProductCard';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    discountedPrice: number;
    originalPrice: number;
    discount: number;
    quantity: string;
    inStock: boolean;
  }>;
  hasOptions?: boolean;
}

interface FeaturedProductListProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export default function FeaturedProductList({ products, onProductPress, onAddToCart }: FeaturedProductListProps) {
  const { isDark } = useTheme();
  
  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Featured Products</Text>
        <TouchableOpacity onPress={() => onProductPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCardContainer}>
            <ProductCard 
              product={item} 
              onPress={() => onProductPress(item.id)}
              onAddToCart={() => onAddToCart(item)}
            />
          </View>
        )}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productsList: {
    paddingLeft: 10,
    paddingRight: 4,
  },
  productCardContainer: {
    width: 160,
    marginRight: 0,
  },
});