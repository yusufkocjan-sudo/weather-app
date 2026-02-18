import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, getGradient } from '../constants/theme';
import { getCurrentWeather, getForecast } from '../services/weatherApi';
import { getRecentCities, addRecentCity, getUnits, setUnits as saveUnits } from '../utils/storage';

import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import DetailGrid from '../components/DetailGrid';
import WeatherParticles from '../components/WeatherParticles';
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
  const [gradient, setGradient] = useState(['#1e40af', '#3b82f6']);

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

  const handleSearch = (city) => fetchWeather(city);

  const handleUnitToggle = async (newUnits) => {
    setUnitsState(newUnits);
    await saveUnits(newUnits);
    if (weather) fetchWeather(weather.name, newUnits);
  };

  const weatherMain = weather?.weather?.[0]?.main || '';

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      <WeatherParticles weatherMain={weatherMain} />
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather</Text>
          <UnitToggle units={units} onToggle={handleUnitToggle} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        >
          <SearchBar onSearch={handleSearch} />

          {loading && !refreshing && <WeatherSkeleton />}

          {error && !loading && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={40} color="rgba(248,113,113,0.8)" />
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && weather && (
            <>
              <CurrentWeather data={weather} units={units} />
              <HourlyForecast currentWeather={weather} units={units} />
              <DetailGrid data={weather} units={units} />
              <DailyForecast data={forecast} units={units} expanded={false} />
              <RecentCities cities={recentCities} onSelect={handleSearch} />
            </>
          )}

          {!loading && !error && !weather && (
            <View style={styles.welcomeContainer}>
              <Ionicons name="partly-sunny-outline" size={56} color="rgba(255,255,255,0.4)" />
              <Text style={styles.welcomeTitle}>Search for a city</Text>
              <Text style={styles.welcomeText}>
                Get current conditions and forecasts
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 8,
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});
