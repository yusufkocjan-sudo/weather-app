import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UnitToggle({ units, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, units === 'metric' && styles.btnActive]}
        onPress={() => onToggle('metric')}
      >
        <Text style={[styles.btnText, units === 'metric' && styles.btnTextActive]}>{'\u00B0'}C</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, units === 'imperial' && styles.btnActive]}
        onPress={() => onToggle('imperial')}
      >
        <Text style={[styles.btnText, units === 'imperial' && styles.btnTextActive]}>{'\u00B0'}F</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 2,
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  btnTextActive: {
    color: '#FFFFFF',
  },
});
