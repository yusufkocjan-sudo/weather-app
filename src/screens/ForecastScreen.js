import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getForecast } from '../services/weatherApi';
import { getUnits } from '../utils/storage';
import { getCityImage } from '../constants/cityImages';

import SearchBar from '../components/SearchBar';
import DailyForecast from '../components/DailyForecast';
import { WeatherSkeleton } from '../components/SkeletonLoader';

export default function ForecastScreen() {
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('Istanbul');
  const [units, setUnits] = useState('metric');
  const [loading, setLoading] = useState(true);
  const [cityImage, setCityImage] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnits(savedUnits);
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    fetchForecast(city, units);
  }, [city, units]);

  const fetchForecast = async (c, u) => {
    setLoading(true);
    try {
      const data = await getForecast(c, u);
      setForecast(data);
      setCityImage(getCityImage(c));
    } catch {
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newCity) => setCity(newCity);

  const getDailyStats = () => {
    if (!forecast) return [];
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
    return Object.entries(dayMap).slice(0, 5).map(([date, info]) => ({
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

  const getWeeklySummary = () => {
    if (dailyStats.length === 0) return '';
    const conditions = dailyStats.map((d) => d.weather.main);
    const counts = {};
    conditions.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const suffix = units === 'metric' ? '\u00B0C' : '\u00B0F';
    return `Mostly ${dominant.toLowerCase()} this week, ${globalMin}${suffix} to ${globalMax}${suffix}.`;
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forecast</Text>
          <Text style={styles.headerSubtitle}>{city}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar onSearch={handleSearch} />

          {cityImage && !loading && (
            <View style={styles.cityHero}>
              <Image source={{ uri: cityImage }} style={styles.cityHeroImage} />
              <LinearGradient
                colors={['transparent', 'rgba(15,23,42,0.95)']}
                style={styles.cityHeroOverlay}
              />
              <Text style={styles.cityHeroName}>{city}</Text>
            </View>
          )}

          {loading && <WeatherSkeleton />}

          {!loading && forecast && (
            <>
              <DailyForecast data={forecast} units={units} expanded={true} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Temperature Range</Text>
                <View style={styles.chartCard}>
                  {dailyStats.map((day, index) => {
                    const leftPct = ((day.min - globalMin) / tempRange) * 100;
                    const widthPct = ((day.max - day.min) / tempRange) * 100;

                    return (
                      <View key={index} style={styles.chartRow}>
                        <Text style={styles.chartDay}>{day.dayName}</Text>
                        <Text style={styles.chartMinLabel}>{day.min}{'\u00B0'}</Text>
                        <View style={styles.chartBarTrack}>
                          <LinearGradient
                            colors={['#60a5fa', '#fbbf24']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                              styles.chartBarFill,
                              { left: `${leftPct}%`, width: `${Math.max(widthPct, 10)}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartMaxLabel}>{day.max}{'\u00B0'}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {dailyStats.length > 0 && (
                <View style={styles.summaryCard}>
                  <Ionicons name="analytics-outline" size={20} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.summaryText}>{getWeeklySummary()}</Text>
                </View>
              )}
            </>
          )}

          {!loading && !forecast && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No forecast data</Text>
              <Text style={styles.emptyHint}>Search for a city above</Text>
            </View>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  cityHero: {
    marginHorizontal: 20,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  cityHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cityHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cityHeroName: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  chartDay: {
    width: 36,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  chartMinLabel: {
    width: 32,
    fontSize: 12,
    color: '#93c5fd',
    textAlign: 'right',
    marginRight: 8,
  },
  chartBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  chartBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  chartMaxLabel: {
    width: 32,
    fontSize: 12,
    color: '#fbbf24',
    textAlign: 'left',
    marginLeft: 8,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    gap: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 12,
  },
  emptyHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
});
