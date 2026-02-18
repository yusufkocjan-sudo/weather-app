import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const CITIES = [
  { name: 'London', country: 'UK', mockTemp: 12, mockIcon: '\u2601\uFE0F' },
  { name: 'New York', country: 'US', mockTemp: 8, mockIcon: '\u26C5' },
  { name: 'Tokyo', country: 'JP', mockTemp: 15, mockIcon: '\u2600\uFE0F' },
  { name: 'Paris', country: 'FR', mockTemp: 11, mockIcon: '\uD83C\uDF27\uFE0F' },
  { name: 'Istanbul', country: 'TR', mockTemp: 14, mockIcon: '\u26C5' },
  { name: 'Dubai', country: 'AE', mockTemp: 32, mockIcon: '\u2600\uFE0F' },
  { name: 'Sydney', country: 'AU', mockTemp: 24, mockIcon: '\u2600\uFE0F' },
  { name: 'Berlin', country: 'DE', mockTemp: 7, mockIcon: '\u2601\uFE0F' },
];

function CityCard({ city, index, onSelect, units }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const tempDisplay = units === 'imperial'
    ? Math.round((city.mockTemp * 9) / 5 + 32)
    : city.mockTemp;

  return (
    <Animated.View
      style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ translateY }] }]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelect && onSelect(city.name)}
        activeOpacity={0.7}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.countryName}>{city.country}</Text>
          </View>
          <Text style={styles.weatherIcon}>{city.mockIcon}</Text>
        </View>
        <Text style={styles.temp}>{tempDisplay}{'\u00B0'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PopularCities({ onSelect, units = 'metric' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Popular Cities</Text>
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
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  countryName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 1,
  },
  weatherIcon: {
    fontSize: 24,
  },
  temp: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
