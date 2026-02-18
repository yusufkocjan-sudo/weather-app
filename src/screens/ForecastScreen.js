import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getForecast } from '../services/weatherApi';
import { getUnits } from '../utils/storage';
import { formatTemp } from '../utils/helpers';

import SearchBar from '../components/SearchBar';
import DailyForecast from '../components/DailyForecast';
import { WeatherSkeleton } from '../components/SkeletonLoader';

export default function ForecastScreen() {
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('Istanbul');
  const [units, setUnits] = useState('metric');
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  // Reload units from storage every time this tab is focused
  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnits(savedUnits);
      })();
    }
  }, [isFocused]);

  // Fetch forecast whenever city or units change
  useEffect(() => {
    fetchForecast(city, units);
  }, [city, units]);

  const fetchForecast = async (c, u) => {
    setLoading(true);
    try {
      const data = await getForecast(c, u);
      setForecast(data);
    } catch {
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newCity) => {
    setCity(newCity);
  };

  // Compute temperature range info from forecast
  const getDailyStats = () => {
    if (!forecast) return [];
    // Handle both array format and object with .list
    const items = Array.isArray(forecast) ? forecast : forecast.list;
    if (!items || items.length === 0) return [];

    const dayMap = {};
    items.forEach((item) => {
      const date = item.dt_txt?.split(' ')[0] || new Date((item.dt || Date.now() / 1000) * 1000).toISOString().split('T')[0];
      const tempMin = item.main?.temp_min ?? item.main?.temp ?? 0;
      const tempMax = item.main?.temp_max ?? item.main?.temp ?? 0;
      if (!dayMap[date]) {
        dayMap[date] = { min: tempMin, max: tempMax, weather: item.weather[0] };
      } else {
        dayMap[date].min = Math.min(dayMap[date].min, tempMin);
        dayMap[date].max = Math.max(dayMap[date].max, tempMax);
      }
    });
    const days = Object.entries(dayMap).slice(0, 5);
    return days.map(([date, info]) => ({
      date,
      min: Math.round(info.min),
      max: Math.round(info.max),
      weather: info.weather,
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));
  };

  const dailyStats = getDailyStats();
  const globalMin = dailyStats.length > 0 ? Math.min(...dailyStats.map((d) => d.min)) : 0;
  const globalMax = dailyStats.length > 0 ? Math.max(...dailyStats.map((d) => d.max)) : 30;
  const tempRange = globalMax - globalMin || 1;

  // Determine predominant condition
  const getWeeklySummary = () => {
    if (dailyStats.length === 0) return '';
    const conditions = dailyStats.map((d) => d.weather.main);
    const counts = {};
    conditions.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const suffix = units === 'metric' ? '\u00B0C' : '\u00B0F';
    return `This week will be mostly ${dominant.toLowerCase()} with temperatures ranging from ${globalMin}${suffix} to ${globalMax}${suffix}.`;
  };

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>5-Day Forecast</Text>
          <Text style={styles.headerSubtitle}>{city}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar onSearch={handleSearch} />

          {loading && <WeatherSkeleton />}

          {!loading && forecast && (
            <>
              {/* Expanded daily forecast */}
              <DailyForecast data={forecast} units={units} expanded={true} />

              {/* Temperature range chart */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Temperature Range</Text>
                <View style={styles.chartCard}>
                  {dailyStats.map((day, index) => {
                    const leftPct = ((day.min - globalMin) / tempRange) * 100;
                    const widthPct = ((day.max - day.min) / tempRange) * 100;
                    const suffix = units === 'metric' ? '\u00B0' : '\u00B0';

                    return (
                      <View key={index} style={styles.chartRow}>
                        <Text style={styles.chartDay}>{day.dayName}</Text>
                        <Text style={styles.chartMinLabel}>{day.min}{suffix}</Text>
                        <View style={styles.chartBarTrack}>
                          <LinearGradient
                            colors={['#3b82f6', '#f59e0b', '#ef4444']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                              styles.chartBarFill,
                              {
                                left: `${leftPct}%`,
                                width: `${Math.max(widthPct, 8)}%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartMaxLabel}>{day.max}{suffix}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Weather summary */}
              {dailyStats.length > 0 && (
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryIcon}>{'\uD83D\uDCCA'}</Text>
                  <Text style={styles.summaryText}>{getWeeklySummary()}</Text>
                </View>
              )}
            </>
          )}

          {!loading && !forecast && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{'\uD83D\uDCC5'}</Text>
              <Text style={styles.emptyText}>No forecast data available</Text>
              <Text style={styles.emptyHint}>Try searching for a city</Text>
            </View>
          )}

          {/* Bottom padding for tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  chartDay: {
    width: 40,
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  chartMinLabel: {
    width: 36,
    fontSize: SIZES.sm,
    color: '#93c5fd',
    textAlign: 'right',
    marginRight: 8,
  },
  chartBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  chartBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  chartMaxLabel: {
    width: 36,
    fontSize: SIZES.sm,
    color: '#fbbf24',
    textAlign: 'left',
    marginLeft: 8,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  bottomPadding: {
    height: 100,
  },
});
