import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar, Platform, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import {
  getUnits, setUnits as saveUnits,
  getDefaultCity, setDefaultCity as saveDefaultCity,
  getNotificationSettings, setNotificationSetting,
} from '../utils/storage';

function ToggleSwitch({ value, onToggle, activeColor = '#3b82f6' }) {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.toggleTrack,
        { backgroundColor: value ? activeColor : 'rgba(255,255,255,0.1)' },
      ]}
    >
      <Animated.View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
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
        const savedCity = await getDefaultCity();
        setDefaultCity(savedCity);
        const notifSettings = await getNotificationSettings();
        setDailyForecast(notifSettings.dailyForecast);
        setSevereAlerts(notifSettings.severeAlerts);
      })();
    }
  }, [isFocused]);

  const handleSetUnit = async (u) => {
    setUnitsState(u);
    await saveUnits(u);
  };

  const handleSetDefaultCity = async () => {
    if (cityInput.trim()) {
      const city = cityInput.trim();
      setDefaultCity(city);
      setCityInput('');
      await saveDefaultCity(city);
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
          {/* Unit Selector — pill toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Temperature Unit</Text>
            <View style={styles.unitPillRow}>
              <TouchableOpacity
                style={[styles.unitPill, units === 'metric' && styles.unitPillActive]}
                onPress={() => handleSetUnit('metric')}
                activeOpacity={0.7}
              >
                <Text style={[styles.unitPillText, units === 'metric' && styles.unitPillTextActive]}>
                  Celsius
                </Text>
                <Text style={[styles.unitPillSymbol, units === 'metric' && styles.unitPillTextActive]}>
                  {'\u00B0C'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitPill, units === 'imperial' && styles.unitPillActive]}
                onPress={() => handleSetUnit('imperial')}
                activeOpacity={0.7}
              >
                <Text style={[styles.unitPillText, units === 'imperial' && styles.unitPillTextActive]}>
                  Fahrenheit
                </Text>
                <Text style={[styles.unitPillSymbol, units === 'imperial' && styles.unitPillTextActive]}>
                  {'\u00B0F'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Default City */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Default City</Text>
            <View style={styles.cityCard}>
              <View style={styles.cityCurrentRow}>
                <Feather name="map-pin" size={16} color="rgba(255,255,255,0.4)" />
                <Text style={styles.cityCurrentText}>{defaultCity}</Text>
              </View>
              <View style={styles.cityInputRow}>
                <TextInput
                  style={styles.cityInput}
                  placeholder="Change default city..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={cityInput}
                  onChangeText={setCityInput}
                  onSubmitEditing={handleSetDefaultCity}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.saveBtn, !cityInput.trim() && styles.saveBtnDisabled]}
                  onPress={handleSetDefaultCity}
                  disabled={!cityInput.trim()}
                  activeOpacity={0.7}
                >
                  <Feather name="check" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notifications</Text>
            <View style={styles.notifCard}>
              <View style={styles.notifRow}>
                <View style={styles.notifIconWrap}>
                  <Feather name="sun" size={16} color="#fbbf24" />
                </View>
                <View style={styles.notifTextWrap}>
                  <Text style={styles.notifLabel}>Daily forecast</Text>
                  <Text style={styles.notifHint}>Morning weather summary</Text>
                </View>
                <ToggleSwitch
                  value={dailyForecast}
                  onToggle={() => {
                    const val = !dailyForecast;
                    setDailyForecast(val);
                    setNotificationSetting('dailyForecast', val);
                  }}
                  activeColor="#3b82f6"
                />
              </View>
              <View style={styles.notifDivider} />
              <View style={styles.notifRow}>
                <View style={[styles.notifIconWrap, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
                  <Feather name="alert-triangle" size={16} color="#f87171" />
                </View>
                <View style={styles.notifTextWrap}>
                  <Text style={styles.notifLabel}>Severe weather</Text>
                  <Text style={styles.notifHint}>Storm and extreme alerts</Text>
                </View>
                <ToggleSwitch
                  value={severeAlerts}
                  onToggle={() => {
                    const val = !severeAlerts;
                    setSevereAlerts(val);
                    setNotificationSetting('severeAlerts', val);
                  }}
                  activeColor="#ef4444"
                />
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>About</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutTop}>
                <View style={styles.appIconWrap}>
                  <Feather name="cloud" size={24} color="#60a5fa" />
                </View>
                <View>
                  <Text style={styles.appName}>Weather App</Text>
                  <Text style={styles.appVersion}>Version 1.0.0</Text>
                </View>
              </View>
              <View style={styles.aboutDivider} />
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Data source</Text>
                <Text style={styles.aboutValue}>OpenWeatherMap</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Framework</Text>
                <Text style={styles.aboutValue}>React Native</Text>
              </View>
            </View>
          </View>

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
    paddingTop: 8,
  },

  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 2,
  },

  // Unit pills
  unitPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitPill: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  unitPillActive: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.35)',
  },
  unitPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  unitPillSymbol: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.25)',
  },
  unitPillTextActive: {
    color: '#FFFFFF',
  },

  // City
  cityCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 14,
  },
  cityCurrentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cityCurrentText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cityInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cityInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#FFFFFF',
    outlineStyle: 'none',
  },
  saveBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59,130,246,0.4)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.25,
  },

  // Notifications
  notifCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 4,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  notifIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(251,191,36,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTextWrap: {
    flex: 1,
  },
  notifLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  notifHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 1,
  },
  notifDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 12,
  },

  // Toggle
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  // About
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 16,
  },
  aboutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  appIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: 'rgba(96,165,250,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appVersion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  aboutDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 14,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  aboutLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  aboutValue: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },
});
