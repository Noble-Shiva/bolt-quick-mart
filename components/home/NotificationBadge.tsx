import { StyleSheet } from 'react-native';
import { Badge } from '@/components/ui';

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <Badge count={count} variant="primary" size="small" style={styles.badge} />
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});