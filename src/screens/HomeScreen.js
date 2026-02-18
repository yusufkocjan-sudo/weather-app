import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl, ActivityIndicator,
  StyleSheet, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, getGradient } from '../constants/theme';
import { getCurrentWeather, getForecast } from '../services/weatherApi';
import { getRecentCities, addRecentCity, getUnits, setUnits as saveUnits } from '../utils/storage';

import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import ForecastList from '../components/ForecastList';
import RecentCities from '../components/RecentCities';
import UnitToggle from '../components/UnitToggle';

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [recentCities, setRecentCities] = useState([]);
  const [units, setUnitsState] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [gradient, setGradient] = useState(['#2193b0', '#6dd5ed']);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      const savedUnits = await getUnits();
      setUnitsState(savedUnits);
      const cities = await getRecentCities();
      setRecentCities(cities);
      if (cities.length > 0) {
        fetchWeather(cities[0], savedUnits);
      }
    })();
  }, []);

  const fetchWeather = async (city, unitOverride) => {
    const u = unitOverride || units;
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city, u),
        getForecast(city, u),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setGradient(getGradient(weatherData.weather[0].main));
      const updated = await addRecentCity(city);
      setRecentCities(updated);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!weather) return;
    setRefreshing(true);
    await fetchWeather(weather.name);
    setRefreshing(false);
  }, [weather, units]);

  const handleSearch = (city) => {
    fetchWeather(city);
  };

  const handleUnitToggle = async (newUnits) => {
    setUnitsState(newUnits);
    await saveUnits(newUnits);
    if (weather) {
      fetchWeather(weather.name, newUnits);
    }
  };

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Weather</Text>
            <Text style={styles.headerSubtitle}>Check current conditions</Text>
          </View>
          <UnitToggle units={units} onToggle={handleUnitToggle} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.textWhite}
            />
          }
        >
          <SearchBar onSearch={handleSearch} />

          {loading && !refreshing && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={COLORS.textWhite} />
              <Text style={styles.loadingText}>Fetching weather...</Text>
            </View>
          )}

          {error && (
            <View style={styles.center}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorHint}>Try searching for another city</Text>
            </View>
          )}

          {!loading && !error && weather && (
            <>
              <CurrentWeather data={weather} units={units} />
              <ForecastList data={forecast} units={units} />
            </>
          )}

          {!loading && !error && !weather && (
            <View style={styles.center}>
              <Text style={styles.welcomeIcon}>🌤️</Text>
              <Text style={styles.welcomeTitle}>Welcome to Weather App</Text>
              <Text style={styles.welcomeText}>
                Search for a city to see the current weather and forecast
              </Text>
            </View>
          )}

          <RecentCities cities={recentCities} onSelect={handleSearch} />

          <View style={styles.spacer} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  spacer: {
    height: 40,
  },
});
