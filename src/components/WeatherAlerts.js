import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

function getAlerts(weatherMain) {
  const condition = (weatherMain || '').toLowerCase();

  if (condition.includes('thunderstorm')) {
    return [
      {
        emoji: '\u26C8\uFE0F',
        message: 'Severe thunderstorm warning',
        severity: 'severe',
      },
      {
        emoji: '\uD83C\uDF27\uFE0F',
        message: 'Heavy rain expected — stay indoors',
        severity: 'warning',
      },
    ];
  }

  if (condition.includes('rain') || condition.includes('drizzle')) {
    return [
      {
        emoji: '\uD83C\uDF27\uFE0F',
        message: 'Rain expected \u2014 carry an umbrella',
        severity: 'warning',
      },
    ];
  }

  if (condition.includes('snow')) {
    return [
      {
        emoji: '\u2744\uFE0F',
        message: 'Snow alert \u2014 roads may be slippery',
        severity: 'warning',
      },
    ];
  }

  if (condition.includes('clear')) {
    return [
      {
        emoji: '\u2600\uFE0F',
        message: 'UV Index High \u2014 wear sunscreen',
        severity: 'info',
      },
    ];
  }

  return [
    {
      emoji: '\u2705',
      message: 'No active weather alerts',
      severity: 'clear',
    },
  ];
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'severe':
      return { bg: 'rgba(244, 67, 54, 0.25)', border: 'rgba(244, 67, 54, 0.5)' };
    case 'warning':
      return { bg: 'rgba(255, 193, 7, 0.25)', border: 'rgba(255, 193, 7, 0.5)' };
    case 'info':
      return { bg: 'rgba(255, 152, 0, 0.2)', border: 'rgba(255, 152, 0, 0.4)' };
    case 'clear':
    default:
      return { bg: 'rgba(76, 175, 80, 0.2)', border: 'rgba(76, 175, 80, 0.4)' };
  }
}

function AlertItem({ alert, index }) {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const colors = getSeverityColor(alert.severity);

  return (
    <Animated.View
      style={[
        styles.alertCard,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <Text style={styles.alertEmoji}>{alert.emoji}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>
    </Animated.View>
  );
}

export default function WeatherAlerts({ weatherMain }) {
  const alerts = getAlerts(weatherMain);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Alerts</Text>
      {alerts.map((alert, index) => (
        <AlertItem key={`alert-${index}`} alert={alert} index={index} />
      ))}
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  alertEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  alertMessage: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.textWhite,
    fontWeight: '600',
    lineHeight: 20,
  },
});
