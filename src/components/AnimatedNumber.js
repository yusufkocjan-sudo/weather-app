import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function AnimatedNumber({ value, suffix = '', style }) {
  const animatedValue = useRef(new Animated.Value(value || 0)).current;
  const [displayValue, setDisplayValue] = useState(Math.round(value || 0));
  const previousValue = useRef(value || 0);

  useEffect(() => {
    if (value === undefined || value === null) return;

    const from = previousValue.current;
    const to = value;
    previousValue.current = to;

    animatedValue.setValue(from);

    const listenerId = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.timing(animatedValue, {
      toValue: to,
      duration: 800,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [value]);

  return (
    <Text style={[styles.defaultText, style]}>
      {displayValue}{suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: SIZES.huge,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -2,
  },
});
