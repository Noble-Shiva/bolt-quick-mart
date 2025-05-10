import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { isDark } = useTheme();
  
  const isUser = message.sender === 'user';
  
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.agentContainer,
      isUser ? { backgroundColor: colors.primary[700] } : { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
    ]}>
      <Text 
        variant="body"
        color={isUser ? 'inverse' : 'primary'}
        style={styles.messageText}
      >
        {message.text}
      </Text>
      <Text 
        variant="caption"
        style={[
          styles.timestamp,
          { color: isUser ? 'rgba(255, 255, 255, 0.7)' : isDark ? '#999999' : '#666666' }
        ]}
      >
        {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  userContainer: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  agentContainer: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    marginBottom: 4,
  },
  timestamp: {
    alignSelf: 'flex-end',
  },
});