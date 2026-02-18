import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar, Platform, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getUnits, setUnits as saveUnits } from '../utils/storage';

function SectionCard({ title, iconName, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name={iconName} size={18} color="rgba(255,255,255,0.6)" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

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
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnitsState(savedUnits);
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

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.gradient}>
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
          <SectionCard title="Units" iconName="thermometer-outline">
            <SettingsRow
              label="Temperature"
              subtitle={units === 'metric' ? 'Celsius' : 'Fahrenheit'}
              rightContent={
                <TouchableOpacity
                  onPress={handleUnitToggle}
                  style={[styles.unitBtn, units === 'imperial' && styles.unitBtnActive]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.unitBtnText}>
                    {units === 'metric' ? '\u00B0C' : '\u00B0F'}
                  </Text>
                </TouchableOpacity>
              }
            />
          </SectionCard>

          <SectionCard title="Default City" iconName="location-outline">
            <SettingsRow label="Current" subtitle={defaultCity} />
            <View style={styles.cityInputRow}>
              <TextInput
                style={styles.cityInput}
                placeholder="Enter city name..."
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={cityInput}
                onChangeText={setCityInput}
                onSubmitEditing={handleSetDefaultCity}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.saveBtn, !cityInput.trim() && styles.saveBtnDisabled]}
                onPress={handleSetDefaultCity}
                disabled={!cityInput.trim()}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>

          <SectionCard title="Notifications" iconName="notifications-outline">
            <SettingsRow
              label="Daily forecast"
              subtitle="Morning weather updates"
              rightContent={
                <Switch
                  value={dailyForecast}
                  onValueChange={setDailyForecast}
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(59,130,246,0.4)' }}
                  thumbColor={dailyForecast ? '#3b82f6' : '#64748b'}
                />
              }
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              label="Severe weather"
              subtitle="Storm and extreme alerts"
              rightContent={
                <Switch
                  value={severeAlerts}
                  onValueChange={setSevereAlerts}
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(239,68,68,0.4)' }}
                  thumbColor={severeAlerts ? '#ef4444' : '#64748b'}
                />
              }
            />
          </SectionCard>

          <SectionCard title="About" iconName="information-circle-outline">
            <SettingsRow
              label="Version"
              rightContent={<Text style={styles.versionText}>1.0.0</Text>}
            />
            <View style={styles.rowDivider} />
            <SettingsRow label="Data source" subtitle="OpenWeatherMap" />
          </SectionCard>

          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 16,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingsRowLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 1,
  },
  rowDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 8,
  },
  unitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  unitBtnActive: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderColor: 'rgba(245,158,11,0.3)',
  },
  unitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cityInputRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  cityInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  saveBtn: {
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(59,130,246,0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.3,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  versionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
});
