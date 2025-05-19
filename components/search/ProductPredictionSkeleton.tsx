import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function ProductPredictionSkeleton() {
  const { isDark } = useTheme();
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  opacity.value = withRepeat(
    withSequence(
      withDelay(500, withTiming(1, { duration: 1000 })),
      withTiming(0.5, { duration: 1000 })
    ),
    -1,
    true
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {[...Array(8)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
              animatedStyle,
            ]}
          >
            <View 
              style={[
                styles.image,
                { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
              ]} 
            />
            <View 
              style={[
                styles.title,
                { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
              ]} 
            />
            <View 
              style={[
                styles.price,
                { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
              ]} 
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  card: {
    width: CARD_WIDTH,
    margin: 8,
    padding: 12,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH - 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    height: 16,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  price: {
    height: 16,
    width: '40%',
    borderRadius: 4,
  },
});