import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
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
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
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
    } else {
      triggerShake();
    }
  };

  const interpolatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.25)'],
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
          onChangeText={setQuery}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  searchBtn: {
    paddingRight: 6,
    paddingLeft: 4,
  },
  btnCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
