import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon, capitalizeFirst } from '../utils/helpers';

export default function CurrentWeather({ data, units }) {
  if (!data) return null;

  const icon = getWeatherIcon(data.weather[0].icon);
  const description = capitalizeFirst(data.weather[0].description);
  const unitSymbol = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <View style={styles.container}>
      {/* City & Country */}
      <Text style={styles.city}>
        {data.name}, {data.sys.country}
      </Text>

      {/* Icon & Temp */}
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.temp}>
        {formatTemp(data.main.temp)}{unitSymbol}
      </Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.feelsLike}>
        Feels like {formatTemp(data.main.feels_like)}{unitSymbol}
      </Text>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <DetailItem label="Humidity" value={`${data.main.humidity}%`} emoji="💧" />
        <DetailItem label="Wind" value={`${data.wind.speed} ${windUnit}`} emoji="💨" />
        <DetailItem label="Pressure" value={`${data.main.pressure} hPa`} emoji="🔽" />
      </View>
    </View>
  );
}

function DetailItem({ label, value, emoji }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailEmoji}>{emoji}</Text>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  city: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  icon: {
    fontSize: 80,
    marginVertical: 8,
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
  },
  feelsLike: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
