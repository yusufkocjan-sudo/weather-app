import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function RecentCities({ cities, onSelect }) {
  if (!cities || cities.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Searches</Text>
      <View style={styles.chips}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.chip}
            onPress={() => onSelect(city)}
          >
            <Text style={styles.chipIcon}>📍</Text>
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
    marginTop: 28,
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.textWhite,
  },
});
