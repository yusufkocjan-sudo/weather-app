import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

function getClothingSuggestion(temp, weatherMain, units) {
  let tempC = temp;
  if (units === 'imperial') {
    tempC = ((temp - 32) * 5) / 9;
  }

  let emoji = '';
  let title = '';
  let subtitle = '';

  if (tempC < 0) {
    emoji = '\uD83E\uDDE5\uD83E\uDDE3\uD83E\uDDE4';
    title = 'Bundle up!';
    subtitle = 'Heavy coat, scarf, and gloves';
  } else if (tempC < 10) {
    emoji = '\uD83E\uDDE5';
    title = 'Layer up!';
    subtitle = 'Warm jacket and layers';
  } else if (tempC < 20) {
    emoji = '\uD83E\uDDE5\uD83D\uDC55';
    title = 'Light layers';
    subtitle = 'Light jacket or sweater';
  } else if (tempC < 30) {
    emoji = '\uD83D\uDC55\uD83E\uDE73';
    title = 'Stay cool!';
    subtitle = 'T-shirt and shorts';
  } else {
    emoji = '\uD83E\uDE73\uD83E\uDDE2\uD83D\uDD76\uFE0F';
    title = 'Beat the heat!';
    subtitle = 'Light clothes, hat, sunscreen';
  }

  const isRaining = weatherMain &&
    (weatherMain.toLowerCase().includes('rain') ||
     weatherMain.toLowerCase().includes('drizzle') ||
     weatherMain.toLowerCase().includes('thunderstorm'));

  const umbrellaNote = isRaining ? '\u2602\uFE0F Don\'t forget your umbrella!' : null;

  return { emoji, title, subtitle, umbrellaNote };
}

export default function WhatToWear({ temp, weatherMain, units = 'metric' }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (temp === undefined || temp === null) return null;

  const { emoji, title, subtitle, umbrellaNote } = getClothingSuggestion(temp, weatherMain, units);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>What to Wear</Text>
      <View style={styles.card}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {umbrellaNote && (
            <Text style={styles.umbrellaNote}>{umbrellaNote}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  umbrellaNote: {
    fontSize: SIZES.md,
    color: '#AED6F1',
    marginTop: 6,
    fontWeight: '600',
  },
});
