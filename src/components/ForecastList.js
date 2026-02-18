import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon, formatDate } from '../utils/helpers';

export default function ForecastList({ data, units }) {
  if (!data || data.length === 0) return null;

  const unitSymbol = units === 'metric' ? '°' : '°';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.dt.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.day}>{formatDate(item.dt)}</Text>
            <Text style={styles.icon}>{getWeatherIcon(item.weather[0].icon)}</Text>
            <Text style={styles.temp}>
              {formatTemp(item.main.temp_max)}{unitSymbol}
            </Text>
            <Text style={styles.tempMin}>
              {formatTemp(item.main.temp_min)}{unitSymbol}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingLeft: 20,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 16,
  },
  list: {
    paddingRight: 20,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  day: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  temp: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  tempMin: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
