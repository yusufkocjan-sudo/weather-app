import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { formatTemp, getWeatherIcon, formatDate, capitalizeFirst } from '../utils/helpers';

function DailyRow({ item, minOverall, maxOverall, units }) {
  const unitSymbol = units === 'metric' ? '\u00B0' : '\u00B0';
  const icon = getWeatherIcon(item.weather[0].icon);
  const description = capitalizeFirst(item.weather[0].description);
  const dayName = formatDate(item.dt);
  const minTemp = formatTemp(item.temp_min !== undefined ? item.temp_min : item.main.temp_min);
  const maxTemp = formatTemp(item.temp_max !== undefined ? item.temp_max : item.main.temp_max);

  const range = maxOverall - minOverall || 1;
  const barLeft = ((minTemp - minOverall) / range) * 100;
  const barWidth = Math.max(((maxTemp - minTemp) / range) * 100, 8);

  return (
    <View style={styles.row}>
      <Text style={styles.dayName}>{dayName}</Text>
      <Text style={styles.dayIcon}>{icon}</Text>
      <View style={styles.descriptionWrap}>
        <Text style={styles.dayDescription} numberOfLines={1}>{description}</Text>
      </View>
      <Text style={styles.tempMin}>{minTemp}{unitSymbol}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barBackground]}>
          <LinearGradient
            colors={['#5B9BD5', '#F4A261']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.barFill,
              {
                left: `${barLeft}%`,
                width: `${barWidth}%`,
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.tempMax}>{maxTemp}{unitSymbol}</Text>
    </View>
  );
}

function processForecastData(data) {
  if (!data) return [];

  // Handle both array format (from our API helper) and object with .list (raw API)
  const items = Array.isArray(data) ? data : data.list;
  if (!items || items.length === 0) return [];

  const dailyMap = {};

  items.forEach((item) => {
    const dt = item.dt || Math.floor(Date.now() / 1000);
    const date = new Date(dt * 1000).toDateString();
    const tempMin = item.temp_min !== undefined ? item.temp_min : (item.main?.temp_min ?? item.main?.temp ?? 0);
    const tempMax = item.temp_max !== undefined ? item.temp_max : (item.main?.temp_max ?? item.main?.temp ?? 0);

    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: dt,
        temp_min: tempMin,
        temp_max: tempMax,
        weather: item.weather,
      };
    } else {
      dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, tempMin);
      dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, tempMax);
    }
  });

  return Object.values(dailyMap);
}

export default function DailyForecast({ data, units = 'metric', expanded = false }) {
  const dailyData = processForecastData(data);

  if (!dailyData || dailyData.length === 0) return null;

  const displayData = expanded ? dailyData.slice(0, 5) : dailyData.slice(0, 3);

  const allMinTemps = displayData.map((d) => formatTemp(d.temp_min));
  const allMaxTemps = displayData.map((d) => formatTemp(d.temp_max));
  const minOverall = Math.min(...allMinTemps);
  const maxOverall = Math.max(...allMaxTemps);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {expanded ? '5-Day Forecast' : 'Daily Forecast'}
      </Text>
      {displayData.map((item, index) => (
        <DailyRow
          key={`daily-${index}`}
          item={item}
          minOverall={minOverall}
          maxOverall={maxOverall}
          units={units}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dayName: {
    width: 38,
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  dayIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  descriptionWrap: {
    flex: 1,
    marginRight: 8,
  },
  dayDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  tempMin: {
    width: 36,
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'right',
  },
  barContainer: {
    width: 60,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  tempMax: {
    width: 36,
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textWhite,
    textAlign: 'right',
  },
});
