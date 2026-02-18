import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function UnitToggle({ units, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, units === 'metric' && styles.btnActive]}
        onPress={() => onToggle('metric')}
      >
        <Text style={[styles.btnText, units === 'metric' && styles.btnTextActive]}>°C</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, units === 'imperial' && styles.btnActive]}
        onPress={() => onToggle('imperial')}
      >
        <Text style={[styles.btnText, units === 'imperial' && styles.btnTextActive]}>°F</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 3,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  btnText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  btnTextActive: {
    color: COLORS.textWhite,
  },
});
