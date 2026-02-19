import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { formatTime, convertSpeed } from '../utils/helpers';

const DETAIL_ITEMS = [
  { key: 'humidity', icon: 'droplet', label: 'Humidity' },
  { key: 'wind', icon: 'wind', label: 'Wind' },
  { key: 'pressure', icon: 'activity', label: 'Pressure' },
  { key: 'visibility', icon: 'eye', label: 'Visibility' },
  { key: 'uv', icon: 'sun', label: 'UV Index' },
  { key: 'sunrise', icon: 'sunrise', label: 'Sunrise' },
];

function getDetailValue(key, data, units) {
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  switch (key) {
    case 'humidity':
      return `${data.main.humidity}%`;
    case 'wind':
      return `${convertSpeed(data.wind.speed, units)} ${windUnit}`;
    case 'pressure':
      return `${data.main.pressure} hPa`;
    case 'visibility':
      return data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '--';
    case 'uv':
      return 'Moderate';
    case 'sunrise':
      return data.sys?.sunrise ? formatTime(data.sys.sunrise) : '--';
    default:
      return '--';
  }
}

function DetailItem({ icon, value, label, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.detailItem, { opacity: fadeAnim, transform: [{ translateY }] }]}
    >
      <View style={styles.iconCircle}>
        <Feather name={icon} size={18} color="rgba(255,255,255,0.8)" />
      </View>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function DetailGrid({ data, units }) {
  if (!data) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Details</Text>
      <View style={styles.grid}>
        {DETAIL_ITEMS.map((item, index) => (
          <DetailItem
            key={item.key}
            icon={item.icon}
            value={getDetailValue(item.key, data, units)}
            label={item.label}
            delay={index * 60}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 8,
  },
  detailItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
