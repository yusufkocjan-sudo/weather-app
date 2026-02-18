import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTime } from '../utils/helpers';

const DETAIL_ITEMS = [
  { key: 'humidity', emoji: '\uD83D\uDCA7', label: 'Humidity' },
  { key: 'wind', emoji: '\uD83D\uDCA8', label: 'Wind' },
  { key: 'pressure', emoji: '\uD83D\uDCCA', label: 'Pressure' },
  { key: 'visibility', emoji: '\uD83D\uDC41', label: 'Visibility' },
  { key: 'uv', emoji: '\u2600\uFE0F', label: 'UV Index' },
  { key: 'sunrise', emoji: '\uD83C\uDF05', label: 'Sunrise' },
];

function getDetailValue(key, data, units) {
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  switch (key) {
    case 'humidity':
      return `${data.main.humidity}%`;
    case 'wind':
      return `${data.wind.speed} ${windUnit}`;
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

function DetailItem({ emoji, value, label, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.detailItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.detailEmoji}>{emoji}</Text>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function DetailGrid({ data, units }) {
  if (!data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {DETAIL_ITEMS.map((item, index) => (
          <DetailItem
            key={item.key}
            emoji={item.emoji}
            value={getDetailValue(item.key, data, units)}
            label={item.label}
            delay={index * 80}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
