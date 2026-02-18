import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function RainDrop({ index }) {
  const translateY = useRef(new Animated.Value(-10)).current;
  const xPos = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const delay = useMemo(() => Math.random() * 2000, []);
  const duration = useMemo(() => 800 + Math.random() * 600, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 10,
          duration,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[styles.rainDrop, { left: xPos, transform: [{ translateY }] }]}
    />
  );
}

function SnowFlake({ index }) {
  const translateY = useRef(new Animated.Value(-10)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const xPos = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const delay = useMemo(() => Math.random() * 4000, []);
  const duration = useMemo(() => 4000 + Math.random() * 3000, []);
  const size = useMemo(() => 2 + Math.random() * 3, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: 15, duration: 2000, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -15, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
    return () => { translateY.stopAnimation(); translateX.stopAnimation(); };
  }, []);

  return (
    <Animated.View
      style={[
        styles.snowFlake,
        { left: xPos, width: size, height: size, borderRadius: size / 2,
          transform: [{ translateY }, { translateX }] },
      ]}
    />
  );
}

export default function WeatherParticles({ weatherMain }) {
  const condition = (weatherMain || '').toLowerCase();

  if (condition.includes('rain') || condition.includes('drizzle')) {
    return (
      <View style={styles.container} pointerEvents="none">
        {Array.from({ length: 8 }, (_, i) => <RainDrop key={`r-${i}`} index={i} />)}
      </View>
    );
  }

  if (condition.includes('snow')) {
    return (
      <View style={styles.container} pointerEvents="none">
        {Array.from({ length: 6 }, (_, i) => <SnowFlake key={`s-${i}`} index={i} />)}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  rainDrop: {
    position: 'absolute',
    width: 1,
    height: 12,
    backgroundColor: 'rgba(174, 214, 241, 0.2)',
    borderRadius: 1,
  },
  snowFlake: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
