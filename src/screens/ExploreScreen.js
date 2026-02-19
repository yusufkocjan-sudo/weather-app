import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  SafeAreaView, StatusBar, Platform, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { getUnits } from '../utils/storage';
import { CITY_LIST } from '../constants/cityImages';
import { getWeatherIcon } from '../utils/helpers';

function CityImageCard({ city, index, units, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const tempDisplay = units === 'imperial'
    ? Math.round((city.mockTemp * 9) / 5 + 32)
    : city.mockTemp;

  const icon = getWeatherIcon(city.mockIcon);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY }, { scale: scaleAnim }],
      marginBottom: 12,
    }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(city.name)}
        style={styles.cityCard}
      >
        <Image source={{ uri: city.image }} style={styles.cityCardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.cityCardOverlay}
        />
        <View style={styles.cityCardContent}>
          <View>
            <Text style={styles.cityCardName}>{city.name}</Text>
            <Text style={styles.cityCardCountry}>{city.country}</Text>
          </View>
          <View style={styles.cityCardWeather}>
            <Text style={styles.cityCardIcon}>{icon}</Text>
            <Text style={styles.cityCardTemp}>{tempDisplay}{'\u00B0'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ExploreScreen() {
  const [units, setUnits] = useState('metric');
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const savedUnits = await getUnits();
        setUnits(savedUnits);
      })();
    }
  }, [isFocused]);

  const handleCityPress = (cityName) => {
    navigation.navigate('Home', { city: cityName, timestamp: Date.now() });
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Tap a city to see its weather</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CITY_LIST.map((city, index) => (
            <CityImageCard
              key={city.name}
              city={city}
              index={index}
              units={units}
              onPress={handleCityPress}
            />
          ))}
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
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 16,
  },
  cityCard: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  cityCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cityCardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cityCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  cityCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cityCardCountry: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  cityCardWeather: {
    alignItems: 'flex-end',
  },
  cityCardIcon: {
    fontSize: 28,
  },
  cityCardTemp: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
