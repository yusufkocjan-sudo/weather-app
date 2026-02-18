import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function RecentCities({ cities, onSelect }) {
  if (!cities || cities.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Recent</Text>
      <View style={styles.chips}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.chip}
            onPress={() => onSelect(city)}
            activeOpacity={0.6}
          >
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.4)" />
            <Text style={styles.chipText}>{city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
});
