import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const API_KEY = 'a16e38d85ac47d67090fc0604783a32d';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const debounceRef = useRef(null);

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

  const fetchSuggestions = async (text) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${GEO_URL}?q=${encodeURIComponent(text.trim())}&limit=5&appid=${API_KEY}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const unique = [];
        const seen = new Set();
        data.forEach((item) => {
          const key = `${item.name}-${item.country}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push({
              name: item.name,
              country: item.country,
              state: item.state || '',
            });
          }
        });
        setSuggestions(unique);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeText = (text) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 300);
  };

  const handleSelectSuggestion = (city) => {
    setQuery('');
    setSuggestions([]);
    onSearch(city.name);
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

      {isFocused && (isLoading || suggestions.length > 0) && (
        <View style={styles.suggestionsWrap}>
          {isLoading && suggestions.length === 0 ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : (
            suggestions.map((city, index) => (
              <TouchableOpacity
                key={`${city.name}-${city.country}-${index}`}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(city)}
                activeOpacity={0.6}
              >
                <Feather name="map-pin" size={13} color="rgba(255,255,255,0.35)" />
                <View style={styles.suggestionTextWrap}>
                  <Text style={styles.suggestionText}>{city.name}</Text>
                  <Text style={styles.suggestionMeta}>
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
    outlineStyle: 'none',
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
  suggestionTextWrap: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
  suggestionMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
});
