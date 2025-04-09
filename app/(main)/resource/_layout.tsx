import React from "react";
import { Stack } from "expo-router";

export default function ResourceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
          // This is important - it hides this screen from the tab bar
          presentation: "modal",
          // You can also customize the animation
          animation: "slide_from_right",
        }} 
      />
    </Stack>
  );
}