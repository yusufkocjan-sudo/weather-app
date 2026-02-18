import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CITIES = [
  { name: 'London', country: 'UK', flag: '\uD83C\uDDEC\uD83C\uDDE7', mockTemp: 12, mockIcon: '\u2601\uFE0F' },
  { name: 'New York', country: 'US', flag: '\uD83C\uDDFA\uD83C\uDDF8', mockTemp: 8, mockIcon: '\u26C5' },
  { name: 'Tokyo', country: 'JP', flag: '\uD83C\uDDEF\uD83C\uDDF5', mockTemp: 15, mockIcon: '\u2600\uFE0F' },
  { name: 'Paris', country: 'FR', flag: '\uD83C\uDDEB\uD83C\uDDF7', mockTemp: 11, mockIcon: '\uD83C\uDF27\uFE0F' },
  { name: 'Istanbul', country: 'TR', flag: '\uD83C\uDDF9\uD83C\uDDF7', mockTemp: 14, mockIcon: '\u26C5' },
  { name: 'Dubai', country: 'AE', flag: '\uD83C\uDDE6\uD83C\uDDEA', mockTemp: 32, mockIcon: '\u2600\uFE0F' },
  { name: 'Sydney', country: 'AU', flag: '\uD83C\uDDE6\uD83C\uDDFA', mockTemp: 24, mockIcon: '\u2600\uFE0F' },
  { name: 'Berlin', country: 'DE', flag: '\uD83C\uDDE9\uD83C\uDDEA', mockTemp: 7, mockIcon: '\u2601\uFE0F' },
];

function CityCard({ city, index, onSelect, units }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const tempDisplay = units === 'imperial'
    ? Math.round((city.mockTemp * 9) / 5 + 32)
    : city.mockTemp;
  const unitSymbol = '\u00B0';

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelect && onSelect(city.name)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.flag}>{city.flag}</Text>
          <Text style={styles.weatherIcon}>{city.mockIcon}</Text>
        </View>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.countryName}>{city.country}</Text>
        <Text style={styles.temp}>{tempDisplay}{unitSymbol}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PopularCities({ onSelect, units = 'metric' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Cities</Text>
      <View style={styles.grid}>
        {CITIES.map((city, index) => (
          <CityCard
            key={city.name}
            city={city}
            index={index}
            onSelect={onSelect}
            units={units}
          />
        ))}
      </View>
    </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flag: {
    fontSize: 22,
  },
  weatherIcon: {
    fontSize: 22,
  },
  cityName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  countryName: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  temp: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginTop: 6,
  },
});
