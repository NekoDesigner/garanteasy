/**
 * Toast - Simple toast notification component
 */

import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  duration = 3000,
  type = 'success',
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, opacity, translateY, duration, onHide]);

  if (!visible) {
    return null;
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4CAF50' };
      case 'error':
        return { backgroundColor: '#F44336' };
      case 'info':
        return { backgroundColor: COLORS.primary };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getTypeStyles(),
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: SIZES.padding.m,
    right: SIZES.padding.m,
    paddingHorizontal: SIZES.padding.m,
    paddingVertical: SIZES.padding.s,
    borderRadius: SIZES.radius.m,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 9999,
  },
  message: {
    color: COLORS.light,
    fontSize: SIZES.font.m,
    fontWeight: SIZES.font.weight.medium,
    textAlign: 'center',
  },
});

export default Toast;