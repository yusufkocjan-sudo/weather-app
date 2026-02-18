import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon, capitalizeFirst } from '../utils/helpers';
import AnimatedNumber from './AnimatedNumber';

export default function CurrentWeather({ data, units }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!data) return;

    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data]);

  if (!data) return null;

  const icon = getWeatherIcon(data.weather[0].icon);
  const description = capitalizeFirst(data.weather[0].description);
  const unitSymbol = units === 'metric' ? '\u00B0' : '\u00B0';
  const feelsLikeTemp = formatTemp(data.main.feels_like);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.city}>
        {data.name}, {data.sys.country}
      </Text>

      <Text style={styles.icon}>{icon}</Text>

      <View style={styles.tempRow}>
        <AnimatedNumber
          value={data.main.temp}
          suffix={unitSymbol}
          style={styles.temp}
        />
      </View>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.feelsLike}>
        Feels like {feelsLikeTemp}{unitSymbol}
      </Text>

      <View style={styles.minMaxRow}>
        <Feather name="arrow-down" size={14} color="rgba(255,255,255,0.5)" />
        <Text style={styles.minMaxText}>
          {formatTemp(data.main.temp_min)}{unitSymbol}
        </Text>
        <View style={styles.minMaxDot} />
        <Feather name="arrow-up" size={14} color="rgba(255,255,255,0.5)" />
        <Text style={styles.minMaxText}>
          {formatTemp(data.main.temp_max)}{unitSymbol}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  city: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: 72,
    marginVertical: 0,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  temp: {
    fontSize: 76,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -3,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 0,
  },
  feelsLike: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  minMaxText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  minMaxDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 8,
  },
});
