import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTime } from '../utils/helpers';

export default function SunTimeline({ sunrise, sunset }) {
  if (!sunrise || !sunset) return null;

  const sunriseTime = formatTime(sunrise);
  const sunsetTime = formatTime(sunset);

  const sunriseMs = sunrise * 1000;
  const sunsetMs = sunset * 1000;
  const nowMs = Date.now();

  const totalDaylight = sunsetMs - sunriseMs;
  const elapsed = nowMs - sunriseMs;

  let sunPosition = 0;
  if (nowMs < sunriseMs) {
    sunPosition = 0;
  } else if (nowMs > sunsetMs) {
    sunPosition = 1;
  } else {
    sunPosition = elapsed / totalDaylight;
  }

  const daylightHours = Math.floor(totalDaylight / 3600000);
  const daylightMinutes = Math.floor((totalDaylight % 3600000) / 60000);

  const isDaytime = nowMs >= sunriseMs && nowMs <= sunsetMs;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sunrise & Sunset</Text>
      <View style={styles.card}>
        <View style={styles.labelsRow}>
          <View style={styles.labelWrap}>
            <Text style={styles.labelEmoji}>{'\uD83C\uDF05'}</Text>
            <Text style={styles.labelText}>{sunriseTime}</Text>
          </View>
          <View style={styles.centerLabel}>
            <Text style={styles.daylightText}>
              {daylightHours}h {daylightMinutes}m daylight
            </Text>
          </View>
          <View style={[styles.labelWrap, styles.labelRight]}>
            <Text style={styles.labelEmoji}>{'\uD83C\uDF07'}</Text>
            <Text style={styles.labelText}>{sunsetTime}</Text>
          </View>
        </View>

        <View style={styles.trackContainer}>
          <View style={styles.track}>
            <View
              style={[
                styles.trackFill,
                { width: `${Math.min(sunPosition * 100, 100)}%` },
              ]}
            />
          </View>
          <View
            style={[
              styles.sunDot,
              {
                left: `${Math.min(Math.max(sunPosition * 100, 2), 98)}%`,
              },
            ]}
          >
            <View style={[styles.sunDotInner, !isDaytime && styles.sunDotNight]} />
          </View>
        </View>

        <Text style={styles.statusText}>
          {isDaytime
            ? '\u2600\uFE0F Sun is currently up'
            : '\uD83C\uDF19 Sun has set'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  labelWrap: {
    alignItems: 'center',
  },
  labelRight: {
    alignItems: 'center',
  },
  labelEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  labelText: {
    fontSize: SIZES.sm,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  centerLabel: {
    flex: 1,
    alignItems: 'center',
  },
  daylightText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  trackContainer: {
    height: 24,
    justifyContent: 'center',
    marginBottom: 10,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: 6,
    backgroundColor: 'rgba(255, 200, 50, 0.6)',
    borderRadius: 3,
  },
  sunDot: {
    position: 'absolute',
    top: 0,
    marginLeft: -12,
  },
  sunDotInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD93D',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  sunDotNight: {
    backgroundColor: '#A0A0A0',
    borderColor: 'rgba(255,255,255,0.3)',
    shadowOpacity: 0,
  },
  statusText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
