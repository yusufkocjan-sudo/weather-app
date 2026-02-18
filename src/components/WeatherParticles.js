import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function RainParticle({ index, total }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const xPos = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const delay = useMemo(() => Math.random() * 1500, []);
  const duration = useMemo(() => 600 + Math.random() * 400, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 20,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        {
          left: xPos,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

function SnowParticle({ index }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const xPos = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const delay = useMemo(() => Math.random() * 3000, []);
  const duration = useMemo(() => 3000 + Math.random() * 2000, []);
  const swayAmount = useMemo(() => 20 + Math.random() * 30, []);
  const size = useMemo(() => 4 + Math.random() * 6, []);

  useEffect(() => {
    const fallAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 20,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );

    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: swayAmount,
          duration: 1500 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -swayAmount,
          duration: 1500 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    );

    fallAnimation.start();
    swayAnimation.start();

    return () => {
      fallAnimation.stop();
      swayAnimation.stop();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.snowFlake,
        {
          left: xPos,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

function SunPulse() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const scaleAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const opacityAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnim.start();
    opacityAnim.start();

    return () => {
      scaleAnim.stop();
      opacityAnim.stop();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.sunCircle,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

function CloudShape({ index }) {
  const translateX = useRef(new Animated.Value(-120)).current;
  const yPos = useMemo(() => 60 + index * 120 + Math.random() * 60, []);
  const duration = useMemo(() => 12000 + Math.random() * 8000, []);
  const delay = useMemo(() => index * 2000, []);
  const cloudWidth = useMemo(() => 80 + Math.random() * 40, []);
  const cloudOpacity = useMemo(() => 0.15 + Math.random() * 0.15, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH + 120,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top: yPos,
          width: cloudWidth,
          height: cloudWidth * 0.5,
          borderRadius: cloudWidth * 0.25,
          opacity: cloudOpacity,
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

export default function WeatherParticles({ weatherMain }) {
  const condition = (weatherMain || '').toLowerCase();

  const renderParticles = () => {
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return Array.from({ length: 20 }, (_, i) => (
        <RainParticle key={`rain-${i}`} index={i} total={20} />
      ));
    }

    if (condition.includes('snow')) {
      return Array.from({ length: 15 }, (_, i) => (
        <SnowParticle key={`snow-${i}`} index={i} />
      ));
    }

    if (condition.includes('clear')) {
      return <SunPulse />;
    }

    if (condition.includes('cloud')) {
      return Array.from({ length: 3 }, (_, i) => (
        <CloudShape key={`cloud-${i}`} index={i} />
      ));
    }

    return null;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {renderParticles()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: 'rgba(174, 214, 241, 0.5)',
    borderRadius: 1,
  },
  snowFlake: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  sunCircle: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    alignSelf: 'center',
    left: SCREEN_WIDTH / 2 - 60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 223, 100, 0.25)',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
