import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </UserProvider>
  );
}