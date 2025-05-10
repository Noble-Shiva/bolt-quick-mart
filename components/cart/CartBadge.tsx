import { StyleSheet } from 'react-native';
import { Badge } from '@/components/ui';

interface CartBadgeProps {
  count: number;
}

export default function CartBadge({ count }: CartBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <Badge count={count} variant="primary" size="small" style={styles.badge} />
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
  },
});