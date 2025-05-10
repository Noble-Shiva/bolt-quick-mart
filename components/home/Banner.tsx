// components/home/Banner.tsx
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BannerProps {
  image: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: any;
}

export default function Banner({ image, title, subtitle, onPress, style }: BannerProps) {
  const { isDark } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Gradient overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      {(title || subtitle) && (
        <View style={styles.content}>
          {title && (
            <Text variant="h3" weight="bold" color="inverse" style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color="inverse" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 32,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    margin: 5
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
