import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text, Card } from '@/components/ui';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { isDark, colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.container}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: isDark ? colors.primary[900] : colors.primary[50] }
        ]}>
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
        <Text 
          variant="body-sm" 
          weight="medium" 
          style={styles.name}
          numberOfLines={1}
        >
          {category.name}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    textAlign: 'center',
    width: '100%',
  },
});