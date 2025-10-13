import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../contexts/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import ErrorBoundary from '../components/ErrorBoundary';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Splash screen showing...');
        // Keep splash screen visible for 5 seconds to ensure it's visible
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Splash screen hiding...');
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        // Hide the native splash screen
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  console.log('App ready status:', appReady);

  // Show custom splash screen while app is not ready
  if (!appReady) {
    return (
      <ImageBackground
        source={require('../assets/img/bluebackground.png')}
        style={styles.splashContainer}
        resizeMode="cover"
      >
        <Image
          source={require('../assets/img/ecmidlogoblack.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </ImageBackground>
    );
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <StatusBar style="light" backgroundColor="#1e9fd8" translucent={true} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1e9fd8' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="about" />
          <Stack.Screen name="about-ecmid" />
          <Stack.Screen name="score" />
          <Stack.Screen name="claim-points" />
          <Stack.Screen name="points-table" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </UserProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e9fd8',
  },
  logo: {
    width: 200,
    height: 200,
  },
});