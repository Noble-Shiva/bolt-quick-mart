import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

export default function SearchPredictionSkeleton() {
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
      {[...Array(5)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.predictionItem,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
            { width: `${Math.random() * 30 + 60}%` },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  predictionItem: {
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
});