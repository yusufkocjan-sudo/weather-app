import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon } from '../utils/helpers';

function generateMockHourlyData(currentWeather) {
  if (!currentWeather) return [];

  const now = new Date();
  const baseTemp = currentWeather.main.temp;
  const iconCode = currentWeather.weather[0].icon;

  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() + i * 3600000);
    const variation = (Math.sin((i * Math.PI) / 12) * 3) + (Math.random() * 2 - 1);
    const temp = baseTemp + variation;

    return {
      id: `hour-${i}`,
      time: i === 0
        ? 'Now'
        : hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: temp,
      icon: iconCode,
      isNow: i === 0,
    };
  });
}

function HourlyItem({ item, units }) {
  const unitSymbol = units === 'metric' ? '\u00B0' : '\u00B0';

  return (
    <View style={[styles.hourCard, item.isNow && styles.hourCardActive]}>
      <Text style={[styles.hourTime, item.isNow && styles.hourTimeActive]}>
        {item.time}
      </Text>
      <Text style={styles.hourIcon}>{getWeatherIcon(item.icon)}</Text>
      <Text style={styles.hourTemp}>
        {formatTemp(item.temp)}{unitSymbol}
      </Text>
    </View>
  );
}

export default function HourlyForecast({ data, units = 'metric', currentWeather }) {
  const hourlyData = useMemo(() => {
    if (data && data.length > 0) return data;
    return generateMockHourlyData(currentWeather);
  }, [data, currentWeather]);

  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <FlatList
        data={hourlyData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <HourlyItem item={item} units={units} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 20,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  listContent: {
    paddingRight: 20,
  },
  hourCard: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    minWidth: 72,
  },
  hourCardActive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderColor: COLORS.textWhite,
  },
  hourTime: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 8,
    fontWeight: '500',
  },
  hourTimeActive: {
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  hourIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
});
