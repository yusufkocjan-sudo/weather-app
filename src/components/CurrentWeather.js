import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon, capitalizeFirst } from '../utils/helpers';
import AnimatedNumber from './AnimatedNumber';

export default function CurrentWeather({ data, units }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!data) return;

    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    iconScale.setValue(0.5);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [data]);

  if (!data) return null;

  const icon = getWeatherIcon(data.weather[0].icon);
  const description = capitalizeFirst(data.weather[0].description);
  const unitSymbol = units === 'metric' ? '\u00B0C' : '\u00B0F';
  const feelsLikeTemp = formatTemp(data.main.feels_like);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* City & Country */}
      <Animated.Text style={[styles.city, { opacity: fadeAnim }]}>
        {data.name}, {data.sys.country}
      </Animated.Text>

      {/* Large Weather Icon with Pulse */}
      <Animated.View
        style={[
          styles.iconWrap,
          {
            transform: [{ scale: Animated.multiply(iconScale, iconPulse) }],
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>

      {/* Animated Temperature */}
      <View style={styles.tempRow}>
        <AnimatedNumber
          value={data.main.temp}
          suffix={unitSymbol}
          style={styles.temp}
        />
      </View>

      {/* Description */}
      <Animated.Text style={[styles.description, { opacity: fadeAnim }]}>
        {description}
      </Animated.Text>

      {/* Feels Like */}
      <Animated.Text style={[styles.feelsLike, { opacity: fadeAnim }]}>
        Feels like {feelsLikeTemp}{unitSymbol}
      </Animated.Text>

      {/* Min / Max */}
      <Animated.View style={[styles.minMaxRow, { opacity: fadeAnim }]}>
        <Text style={styles.minMaxText}>
          {'\u2B07\uFE0F'} {formatTemp(data.main.temp_min)}{'\u00B0'}
        </Text>
        <View style={styles.minMaxDivider} />
        <Text style={styles.minMaxText}>
          {'\u2B06\uFE0F'} {formatTemp(data.main.temp_max)}{'\u00B0'}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  city: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  iconWrap: {
    marginVertical: 4,
  },
  icon: {
    fontSize: 100,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  temp: {
    fontSize: SIZES.huge,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -2,
  },
  description: {
    fontSize: SIZES.lg,
    fontWeight: '500',
    color: COLORS.textWhite,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  feelsLike: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: 4,
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  minMaxText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  minMaxDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
});
