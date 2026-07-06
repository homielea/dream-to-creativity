import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { night } from '../src/theme/colors';
import { useDayTheme } from '../src/theme/useTheme';

export default function RootLayout() {
  const { palette, isDark } = useDayTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.bg },
          headerTintColor: palette.ink,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: palette.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="seed/new" options={{ headerShown: false }} />
        <Stack.Screen name="seed/[id]" options={{ title: 'Seed' }} />
        <Stack.Screen
          name="capture/index"
          options={{
            headerShown: false,
            // The capture surface owns the whole screen and is always true-dark.
            contentStyle: { backgroundColor: night.bg },
            animation: 'fade', // fade, never flash
          }}
        />
        <Stack.Screen name="digest/[seedId]" options={{ title: 'Harvest' }} />
        <Stack.Screen name="archive/index" options={{ title: 'Archive' }} />
      </Stack>
    </>
  );
}
