import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const WEATHER_FACTS = [
  'A single cloud can weigh more than 1 million pounds.',
  'Lightning strikes the Earth about 100 times every second.',
  'The highest temperature ever recorded was 56.7\u00B0C (134\u00B0F) in Death Valley, California.',
  'The lowest temperature ever recorded was -89.2\u00B0C (-128.6\u00B0F) in Antarctica.',
  'A hurricane can release energy equivalent to 10,000 nuclear bombs.',
  'Raindrops can fall at speeds of up to 22 mph.',
  'Snowflakes can take up to 1 hour to fall from the cloud to the ground.',
  'The wettest place on Earth is Mawsynram, India, with 467 inches of rain per year.',
  'Fog is actually a cloud that touches the ground.',
  'The wind speed of a tornado can exceed 300 mph.',
  'Every minute, 1 billion tons of rain falls on the Earth.',
  'A bolt of lightning is 5 times hotter than the surface of the sun.',
  'Hailstones can travel at speeds over 100 mph.',
  'The driest place on Earth is the Atacama Desert in Chile.',
  'Cirrus clouds can be found at altitudes above 20,000 feet.',
];

export default function FunFacts() {
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * WEATHER_FACTS.length)
  );
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => {
          let next = Math.floor(Math.random() * WEATHER_FACTS.length);
          while (next === prev && WEATHER_FACTS.length > 1) {
            next = Math.floor(Math.random() * WEATHER_FACTS.length);
          }
          return next;
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Did You Know?</Text>
      <View style={styles.card}>
        <Text style={styles.bulbEmoji}>{'\uD83D\uDCA1'}</Text>
        <Animated.View style={[styles.factWrap, { opacity: fadeAnim }]}>
          <Text style={styles.factText}>{WEATHER_FACTS[currentIndex]}</Text>
        </Animated.View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  bulbEmoji: {
    fontSize: 28,
    marginRight: 14,
    marginTop: 2,
  },
  factWrap: {
    flex: 1,
  },
  factText: {
    fontSize: SIZES.md,
    color: COLORS.textWhite,
    lineHeight: 22,
    fontWeight: '500',
  },
});
