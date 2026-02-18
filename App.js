import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6dd5ed',
    background: 'transparent',
    card: 'rgba(0,0,0,0.5)',
    text: '#FFFFFF',
    border: 'transparent',
    notification: '#ef4444',
  },
};

function AppContent() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.phoneFrame}>
          <View style={styles.notch} />
          <View style={styles.phoneScreen}>
            <AppContent />
          </View>
          <View style={styles.homeBar} />
        </View>
      </View>
    );
  }

  return <AppContent />;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  phoneFrame: {
    width: 390,
    height: 844,
    backgroundColor: '#000',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 28,
    backgroundColor: '#000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 100,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 42,
    overflow: 'hidden',
  },
  homeBar: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    zIndex: 100,
  },
});
