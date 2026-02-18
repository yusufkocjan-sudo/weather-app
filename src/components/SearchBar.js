import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setQuery('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSubmit}>
          <View style={styles.iconCircle}>
            <SearchIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SearchIcon() {
  return (
    <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: 14, height: 14, borderRadius: 7, borderWidth: 2,
        borderColor: COLORS.textWhite, marginTop: -2, marginLeft: -2,
      }} />
      <View style={{
        width: 2, height: 6, backgroundColor: COLORS.textWhite,
        position: 'absolute', bottom: 0, right: 2,
        transform: [{ rotate: '-45deg' }], borderRadius: 1,
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: SIZES.base,
    color: COLORS.textWhite,
  },
  searchBtn: {
    paddingRight: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
