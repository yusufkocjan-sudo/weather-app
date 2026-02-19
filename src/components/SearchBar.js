import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CITY_SUGGESTIONS = [
  'London', 'New York', 'Tokyo', 'Paris', 'Istanbul', 'Dubai', 'Sydney', 'Berlin',
  'Amsterdam', 'Ankara', 'Athens', 'Bangkok', 'Barcelona', 'Beijing', 'Brussels',
  'Buenos Aires', 'Cairo', 'Chicago', 'Copenhagen', 'Delhi', 'Dublin', 'Frankfurt',
  'Helsinki', 'Hong Kong', 'Johannesburg', 'Kuala Lumpur', 'Lisbon', 'Los Angeles',
  'Madrid', 'Mexico City', 'Miami', 'Milan', 'Moscow', 'Mumbai', 'Munich',
  'Nairobi', 'Oslo', 'Prague', 'Rio de Janeiro', 'Rome', 'San Francisco',
  'Seoul', 'Shanghai', 'Singapore', 'Stockholm', 'Toronto', 'Vienna', 'Warsaw', 'Zurich',
];

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSuggestions([]);
    }, 150);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleChangeText = (text) => {
    setQuery(text);
    if (text.trim().length > 0) {
      const filtered = CITY_SUGGESTIONS.filter((city) =>
        city.toLowerCase().startsWith(text.toLowerCase().trim())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (city) => {
    setQuery('');
    setSuggestions([]);
    onSearch(city);
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const triggerBtnPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    triggerBtnPress();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setQuery('');
      setSuggestions([]);
    } else {
      triggerShake();
    }
  };

  const interpolatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.3)'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputWrap,
          {
            borderColor: interpolatedBorderColor,
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <Feather name="search" size={16} color="rgba(255,255,255,0.35)" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[styles.btnCircle, { transform: [{ scale: scaleAnim }] }]}
          >
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {suggestions.length > 0 && isFocused && (
        <View style={styles.suggestionsWrap}>
          {suggestions.map((city) => (
            <TouchableOpacity
              key={city}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(city)}
              activeOpacity={0.6}
            >
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.35)" />
              <Text style={styles.suggestionText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingRight: 6,
  },
  searchIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  searchBtn: {
    padding: 2,
  },
  btnCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsWrap: {
    marginTop: 6,
    backgroundColor: 'rgba(20, 25, 45, 0.95)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  suggestionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
});
