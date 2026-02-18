import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
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
        {
          width,
          height,
          borderRadius,
          backgroundColor: 'rgba(255,255,255,0.15)',
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

export function WeatherSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {/* Search bar skeleton */}
      <View style={styles.searchSkeleton}>
        <SkeletonLoader width="100%" height={50} borderRadius={16} />
      </View>

      {/* City name skeleton */}
      <View style={styles.centerWrap}>
        <SkeletonLoader width={160} height={22} borderRadius={6} />
      </View>

      {/* Weather icon skeleton */}
      <View style={styles.centerWrap}>
        <SkeletonLoader
          width={90}
          height={90}
          borderRadius={45}
          style={{ marginTop: 12 }}
        />
      </View>

      {/* Temperature skeleton */}
      <View style={styles.centerWrap}>
        <SkeletonLoader
          width={140}
          height={60}
          borderRadius={10}
          style={{ marginTop: 12 }}
        />
      </View>

      {/* Description skeleton */}
      <View style={styles.centerWrap}>
        <SkeletonLoader
          width={120}
          height={18}
          borderRadius={6}
          style={{ marginTop: 10 }}
        />
      </View>

      {/* Feels like skeleton */}
      <View style={styles.centerWrap}>
        <SkeletonLoader
          width={100}
          height={14}
          borderRadius={6}
          style={{ marginTop: 8 }}
        />
      </View>

      {/* Detail grid skeleton */}
      <View style={styles.gridSkeleton}>
        <SkeletonLoader width="100%" height={130} borderRadius={20} />
      </View>

      {/* Hourly forecast skeleton */}
      <View style={styles.hourlySkeleton}>
        <SkeletonLoader width={100} height={18} borderRadius={6} />
        <View style={styles.hourlyCards}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonLoader
              key={`hourly-skel-${i}`}
              width={72}
              height={100}
              borderRadius={20}
              style={{ marginRight: 10 }}
            />
          ))}
        </View>
      </View>

      {/* Daily forecast skeleton */}
      <View style={styles.dailySkeleton}>
        <SkeletonLoader width="100%" height={180} borderRadius={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    paddingTop: 20,
  },
  searchSkeleton: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  centerWrap: {
    alignItems: 'center',
  },
  gridSkeleton: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  hourlySkeleton: {
    marginTop: 20,
    paddingLeft: 20,
  },
  hourlyCards: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dailySkeleton: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});
