import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const MOCK_CITIES = {
  london: { name: 'London', temp: 12, humidity: 78, wind: 5.2, icon: '\u2601\uFE0F', desc: 'Overcast clouds' },
  'new york': { name: 'New York', temp: 8, humidity: 65, wind: 7.1, icon: '\u26C5', desc: 'Partly cloudy' },
  tokyo: { name: 'Tokyo', temp: 15, humidity: 60, wind: 3.8, icon: '\u2600\uFE0F', desc: 'Clear sky' },
  paris: { name: 'Paris', temp: 11, humidity: 82, wind: 4.5, icon: '\uD83C\uDF27\uFE0F', desc: 'Light rain' },
  istanbul: { name: 'Istanbul', temp: 14, humidity: 70, wind: 6.0, icon: '\u26C5', desc: 'Few clouds' },
  dubai: { name: 'Dubai', temp: 32, humidity: 45, wind: 4.2, icon: '\u2600\uFE0F', desc: 'Clear sky' },
  sydney: { name: 'Sydney', temp: 24, humidity: 55, wind: 5.5, icon: '\u2600\uFE0F', desc: 'Sunny' },
  berlin: { name: 'Berlin', temp: 7, humidity: 80, wind: 6.8, icon: '\u2601\uFE0F', desc: 'Cloudy' },
};

function CityInput({ placeholder, value, onChangeText, onSubmit }) {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCorrect={false}
      />
    </View>
  );
}

function CompareColumn({ data, units }) {
  if (!data) {
    return (
      <View style={styles.column}>
        <Text style={styles.placeholderText}>Search a city</Text>
      </View>
    );
  }

  const unitSymbol = units === 'metric' ? '\u00B0C' : '\u00B0F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const tempDisplay = units === 'imperial'
    ? Math.round((data.temp * 9) / 5 + 32)
    : data.temp;

  return (
    <View style={styles.column}>
      <Text style={styles.columnCity}>{data.name}</Text>
      <Text style={styles.columnIcon}>{data.icon}</Text>
      <Text style={styles.columnTemp}>{tempDisplay}{unitSymbol}</Text>
      <Text style={styles.columnDesc}>{data.desc}</Text>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{'\uD83D\uDCA7'}</Text>
        <Text style={styles.statValue}>{data.humidity}%</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{'\uD83D\uDCA8'}</Text>
        <Text style={styles.statValue}>{data.wind} {windUnit}</Text>
      </View>
    </View>
  );
}

export default function CityCompare({ units = 'metric' }) {
  const [city1Input, setCity1Input] = useState('');
  const [city2Input, setCity2Input] = useState('');
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch1 = () => {
    const key = city1Input.trim().toLowerCase();
    if (MOCK_CITIES[key]) {
      setCity1Data(MOCK_CITIES[key]);
    }
  };

  const handleSearch2 = () => {
    const key = city2Input.trim().toLowerCase();
    if (MOCK_CITIES[key]) {
      setCity2Data(MOCK_CITIES[key]);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Compare Cities</Text>
      <View style={styles.card}>
        <View style={styles.inputsRow}>
          <CityInput
            placeholder="City 1..."
            value={city1Input}
            onChangeText={setCity1Input}
            onSubmit={handleSearch1}
          />
          <Text style={styles.vsText}>VS</Text>
          <CityInput
            placeholder="City 2..."
            value={city2Input}
            onChangeText={setCity2Input}
            onSubmit={handleSearch2}
          />
        </View>

        <View style={styles.compareRow}>
          <CompareColumn data={city1Data} units={units} />
          <View style={styles.divider} />
          <CompareColumn data={city2Data} units={units} />
        </View>

        {!city1Data && !city2Data && (
          <Text style={styles.hintText}>
            Try: London, New York, Tokyo, Paris, Istanbul, Dubai, Sydney, Berlin
          </Text>
        )}
      </View>
    </Animated.View>
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputWrap: {
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: SIZES.sm,
    color: COLORS.textWhite,
  },
  vsText: {
    fontSize: SIZES.sm,
    fontWeight: '800',
    color: COLORS.textLight,
    marginHorizontal: 10,
  },
  compareRow: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 8,
  },
  placeholderText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 20,
  },
  columnCity: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 6,
  },
  columnIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  columnTemp: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: 4,
  },
  columnDesc: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  statValue: {
    fontSize: SIZES.sm,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  hintText: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
