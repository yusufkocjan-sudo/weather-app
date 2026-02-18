import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

function hashCity(city) {
  let hash = 0;
  const str = (city || 'default').toLowerCase();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getMockAQI(city) {
  const hash = hashCity(city);
  return (hash % 180) + 10;
}

function getAQIInfo(aqi) {
  if (aqi <= 50) {
    return {
      status: 'Good',
      color: '#4CAF50',
      description: 'Air quality is satisfactory',
    };
  }
  if (aqi <= 100) {
    return {
      status: 'Moderate',
      color: '#FFC107',
      description: 'Acceptable air quality',
    };
  }
  if (aqi <= 150) {
    return {
      status: 'Unhealthy for Sensitive Groups',
      color: '#FF9800',
      description: 'Some people may be affected',
    };
  }
  return {
    status: 'Unhealthy',
    color: '#F44336',
    description: 'Everyone may experience effects',
  };
}

export default function AirQuality({ city }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const aqi = getMockAQI(city);
  const { status, color, description } = getAQIInfo(aqi);

  const barPosition = Math.min((aqi / 200) * 100, 100);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Air Quality</Text>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.aqiCircle}>
            <Text style={[styles.aqiNumber, { color }]}>{aqi}</Text>
            <Text style={styles.aqiLabel}>AQI</Text>
          </View>
          <View style={styles.infoWrap}>
            <Text style={[styles.statusText, { color }]}>{status}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        <View style={styles.barTrack}>
          <View style={[styles.barSegment, { flex: 50, backgroundColor: '#4CAF50' }]} />
          <View style={[styles.barSegment, { flex: 50, backgroundColor: '#FFC107' }]} />
          <View style={[styles.barSegment, { flex: 50, backgroundColor: '#FF9800' }]} />
          <View style={[styles.barSegment, { flex: 50, backgroundColor: '#F44336' }]} />
        </View>
        <View style={styles.indicatorRow}>
          <View
            style={[
              styles.indicator,
              {
                left: `${barPosition}%`,
              },
            ]}
          >
            <View style={[styles.indicatorDot, { backgroundColor: color }]} />
          </View>
        </View>

        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>0</Text>
          <Text style={styles.scaleLabel}>50</Text>
          <Text style={styles.scaleLabel}>100</Text>
          <Text style={styles.scaleLabel}>150</Text>
          <Text style={styles.scaleLabel}>200</Text>
        </View>
      </View>
    </Animated.View>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  aqiCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  aqiNumber: {
    fontSize: SIZES.xl,
    fontWeight: '800',
  },
  aqiLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoWrap: {
    flex: 1,
  },
  statusText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barSegment: {
    height: 8,
  },
  indicatorRow: {
    height: 16,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    marginLeft: -6,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textWhite,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
  },
});
