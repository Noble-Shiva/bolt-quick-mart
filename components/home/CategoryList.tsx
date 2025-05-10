import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import CategoryCard from '@/components/home/CategoryCard';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategoryPress: (categoryId: string) => void;
  isLoading?: boolean;
}

export default function CategoryList({ categories, onCategoryPress, isLoading = false }: CategoryListProps) {
  const { isDark } = useTheme();
  
  if (isLoading) {
    return (
      <View style={styles.categoriesSection}>
        <SectionHeaderSkeleton />
        <CategorySkeleton />
      </View>
    );
  }

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Categories</Text>
        <TouchableOpacity onPress={() => onCategoryPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard 
            category={item} 
            onPress={() => onCategoryPress(item.id)}
          />
        )}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});