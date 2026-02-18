import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar, Platform,
  Animated, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getUnits, setUnits as saveUnits } from '../utils/storage';

// Custom iOS-style animated unit switch
function UnitSwitch({ isMetric, onToggle }) {
  const animValue = useRef(new Animated.Value(isMetric ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isMetric ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [isMetric]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 42],
  });

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b82f6', '#f59e0b'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={styles.unitSwitchContainer}
    >
      <Text style={[styles.unitLabel, isMetric && styles.unitLabelActive]}>
        {'\u00B0'}C
      </Text>
      <Animated.View style={[styles.unitSwitchTrack, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.unitSwitchThumb,
            { transform: [{ translateX }] },
          ]}
        >
          <Text style={styles.unitThumbText}>
            {isMetric ? '\u00B0C' : '\u00B0F'}
          </Text>
        </Animated.View>
      </Animated.View>
      <Text style={[styles.unitLabel, !isMetric && styles.unitLabelActive]}>
        {'\u00B0'}F
      </Text>
    </TouchableOpacity>
  );
}

// Settings section card with glassmorphism
function SectionCard({ title, icon, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// Settings row
function SettingsRow({ label, subtitle, rightContent }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsRowLeft}>
        <Text style={styles.settingsLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent}
    </View>
  );
}

export default function SettingsScreen() {
  const [units, setUnitsState] = useState('metric');
  const [defaultCity, setDefaultCity] = useState('Istanbul');
  const [cityInput, setCityInput] = useState('');
  const [dailyForecast, setDailyForecast] = useState(true);
  const [severeAlerts, setSevereAlerts] = useState(true);
  const [tempDrops, setTempDrops] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnitsState(savedUnits);
        setLastUpdated(new Date());
      })();
    }
  }, [isFocused]);

  const handleUnitToggle = async () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnitsState(newUnits);
    await saveUnits(newUnits);
  };

  const handleSetDefaultCity = () => {
    if (cityInput.trim()) {
      setDefaultCity(cityInput.trim());
      setCityInput('');
    }
  };

  const getMinutesAgo = () => {
    if (!lastUpdated) return 'N/A';
    const diff = Math.round((new Date() - lastUpdated) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff} minute${diff !== 1 ? 's' : ''} ago`;
  };

  return (
    <LinearGradient colors={['#1e293b', '#334155', '#1e293b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Units Section */}
          <SectionCard title="Units" icon={'\uD83C\uDF21\uFE0F'}>
            <SettingsRow
              label="Temperature Unit"
              subtitle={units === 'metric' ? 'Celsius' : 'Fahrenheit'}
              rightContent={
                <UnitSwitch
                  isMetric={units === 'metric'}
                  onToggle={handleUnitToggle}
                />
              }
            />
          </SectionCard>

          {/* Default City Section */}
          <SectionCard title="Default City" icon={'\uD83D\uDCCD'}>
            <SettingsRow
              label="Current default"
              subtitle={defaultCity}
            />
            <View style={styles.cityInputRow}>
              <TextInput
                style={styles.cityInput}
                placeholder="Enter new default city..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={cityInput}
                onChangeText={setCityInput}
                onSubmitEditing={handleSetDefaultCity}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[
                  styles.cityInputButton,
                  !cityInput.trim() && styles.cityInputButtonDisabled,
                ]}
                onPress={handleSetDefaultCity}
                disabled={!cityInput.trim()}
              >
                <Text style={styles.cityInputButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>

          {/* Notifications Section */}
          <SectionCard title="Notifications" icon={'\uD83D\uDD14'}>
            <SettingsRow
              label="Daily forecast"
              subtitle="Get weather updates each morning"
              rightContent={
                <Switch
                  value={dailyForecast}
                  onValueChange={setDailyForecast}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(59,130,246,0.5)' }}
                  thumbColor={dailyForecast ? '#3b82f6' : '#94a3b8'}
                  ios_backgroundColor="rgba(255,255,255,0.15)"
                />
              }
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              label="Severe weather alerts"
              subtitle="Storms, extreme heat or cold"
              rightContent={
                <Switch
                  value={severeAlerts}
                  onValueChange={setSevereAlerts}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(239,68,68,0.5)' }}
                  thumbColor={severeAlerts ? '#ef4444' : '#94a3b8'}
                  ios_backgroundColor="rgba(255,255,255,0.15)"
                />
              }
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              label="Temperature drops"
              subtitle="Alert when temp drops 10+ degrees"
              rightContent={
                <Switch
                  value={tempDrops}
                  onValueChange={setTempDrops}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(245,158,11,0.5)' }}
                  thumbColor={tempDrops ? '#f59e0b' : '#94a3b8'}
                  ios_backgroundColor="rgba(255,255,255,0.15)"
                />
              }
            />
          </SectionCard>

          {/* Data Section */}
          <SectionCard title="Data" icon={'\uD83D\uDDC4\uFE0F'}>
            <SettingsRow
              label="Last updated"
              subtitle={getMinutesAgo()}
            />
            <View style={styles.rowDivider} />
            <TouchableOpacity
              style={styles.clearCacheButton}
              onPress={() => setLastUpdated(new Date())}
              activeOpacity={0.7}
            >
              <Text style={styles.clearCacheText}>Clear Cache</Text>
              <Text style={styles.clearCacheIcon}>{'\uD83D\uDDD1\uFE0F'}</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* About Section */}
          <SectionCard title="About" icon={'\u2139\uFE0F'}>
            <SettingsRow
              label="App version"
              rightContent={
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>1.0.0</Text>
                </View>
              }
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              label="Built with"
              subtitle="React Native & Expo"
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              label="Weather data"
              subtitle="OpenWeatherMap"
            />
          </SectionCard>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },

  // Section card — glassmorphism
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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

  // Settings row
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingsRowLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  settingsSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 8,
  },

  // Unit switch
  unitSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
  },
  unitLabelActive: {
    color: COLORS.textWhite,
  },
  unitSwitchTrack: {
    width: 76,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    position: 'relative',
  },
  unitSwitchThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  unitThumbText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },

  // City input
  cityInputRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  cityInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: SIZES.md,
    color: COLORS.textWhite,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cityInputButton: {
    height: 44,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityInputButtonDisabled: {
    backgroundColor: 'rgba(59,130,246,0.3)',
  },
  cityInputButtonText: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // Clear cache
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  clearCacheText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: '#fca5a5',
    marginRight: 6,
  },
  clearCacheIcon: {
    fontSize: 16,
  },

  // Version badge
  versionBadge: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  versionText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: '#93c5fd',
  },

  bottomPadding: {
    height: 100,
  },
});
