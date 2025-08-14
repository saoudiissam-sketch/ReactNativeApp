import React, { memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  size = 'large',
  color = '#3B82F6',
  text,
  fullScreen = false
}) => {
  const Container = fullScreen ? View : React.Fragment;
  const containerProps = fullScreen 
    ? { 
        className: "flex-1 justify-center items-center bg-white/80 absolute inset-0 z-50",
        style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
      } 
    : {};

  return (
    <Container {...containerProps}>
      <View className="items-center justify-center p-4">
        <ActivityIndicator 
          size={size} 
          color={color} 
        />
        {text && (
          <Text className="text-gray-600 mt-3 text-center text-base">
            {text}
          </Text>
        )}
      </View>
    </Container>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;