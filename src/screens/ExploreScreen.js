import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getUnits } from '../utils/storage';

import PopularCities from '../components/PopularCities';
import CityCompare from '../components/CityCompare';
import FunFacts from '../components/FunFacts';
import WeatherAlerts from '../components/WeatherAlerts';

export default function ExploreScreen() {
  const [units, setUnits] = useState('metric');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnits(savedUnits);
      })();
    }
  }, [isFocused]);

  return (
    <LinearGradient colors={['#1a1a2e', '#4a1942', '#16213e']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Discover weather worldwide</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Popular Cities */}
          <PopularCities onSelect={() => {}} units={units} />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{'\u2728'}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* City Compare */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{'\u2696\uFE0F'}</Text>
            <Text style={styles.sectionTitle}>Compare Cities</Text>
          </View>
          <CityCompare units={units} />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{'\uD83C\uDF0D'}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Fun Facts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{'\uD83D\uDCA1'}</Text>
            <Text style={styles.sectionTitle}>Did You Know?</Text>
          </View>
          <FunFacts />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{'\uD83D\uDD14'}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Weather Alerts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{'\u26A0\uFE0F'}</Text>
            <Text style={styles.sectionTitle}>Weather Alerts</Text>
          </View>
          <WeatherAlerts weatherMain="Clear" />

          {/* Bottom padding for tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  bottomPadding: {
    height: 100,
  },
});
