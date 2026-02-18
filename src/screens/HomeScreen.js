import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, getGradient } from '../constants/theme';
import { getCurrentWeather, getForecast } from '../services/weatherApi';
import { getRecentCities, addRecentCity, getUnits, setUnits as saveUnits } from '../utils/storage';

import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import DetailGrid from '../components/DetailGrid';
import WeatherParticles from '../components/WeatherParticles';
import WhatToWear from '../components/WhatToWear';
import SunTimeline from '../components/SunTimeline';
import AirQuality from '../components/AirQuality';
import RecentCities from '../components/RecentCities';
import UnitToggle from '../components/UnitToggle';
import { WeatherSkeleton } from '../components/SkeletonLoader';

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [recentCities, setRecentCities] = useState([]);
  const [units, setUnitsState] = useState('metric');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [gradient, setGradient] = useState(['#2193b0', '#6dd5ed']);

  useEffect(() => {
    (async () => {
      const savedUnits = await getUnits();
      setUnitsState(savedUnits);
      const cities = await getRecentCities();
      setRecentCities(cities);
      fetchWeather(cities.length > 0 ? cities[0] : 'Istanbul', savedUnits);
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
      setForecast(null);
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

  const weatherMain = weather?.weather?.[0]?.main || '';

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      {/* Animated weather particles behind everything */}
      <WeatherParticles weatherMain={weatherMain} />

      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        {/* Header row */}
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

          {/* Loading skeleton */}
          {loading && !refreshing && (
            <WeatherSkeleton />
          )}

          {/* Error card */}
          {error && !loading && (
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>{'\u26A0\uFE0F'}</Text>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorHint}>Try searching for another city</Text>
            </View>
          )}

          {/* Weather data */}
          {!loading && !error && weather && (
            <>
              <CurrentWeather data={weather} units={units} />
              <HourlyForecast currentWeather={weather} units={units} />
              <DetailGrid data={weather} units={units} />
              <WhatToWear
                temp={weather.main?.temp}
                weatherMain={weatherMain}
                units={units}
              />
              <SunTimeline
                sunrise={weather.sys?.sunrise}
                sunset={weather.sys?.sunset}
              />
              <AirQuality city={weather.name} />
              <DailyForecast data={forecast} units={units} expanded={false} />
              <RecentCities cities={recentCities} onSelect={handleSearch} />
            </>
          )}

          {/* Welcome state */}
          {!loading && !error && !weather && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeIcon}>{'\uD83C\uDF24\uFE0F'}</Text>
              <Text style={styles.welcomeTitle}>Welcome to Weather App</Text>
              <Text style={styles.welcomeText}>
                Search for a city to see the current weather and forecast
              </Text>
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
    paddingBottom: 20,
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 6,
  },
  errorText: {
    fontSize: SIZES.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  errorHint: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 10,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  bottomPadding: {
    height: 100,
  },
});
