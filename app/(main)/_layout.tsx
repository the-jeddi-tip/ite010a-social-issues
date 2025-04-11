import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { AccessibilityProvider } from "./settingsContext";

export default function MainLayout() {
    return (
        <AccessibilityProvider>
            <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
                <Tabs.Screen
                    name="profile"
                    options={{
                        headerShown: false,
                        title: 'Profile',
                        tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="resource-hub"
                    options={{
                        headerShown: false,
                        title: 'Resource Hub',
                        tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="book" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        title: 'Home',
                        tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="jobs"
                    options={{
                        headerShown: false,
                        title: 'Jobs',
                        tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="list" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        headerShown: false,
                        title: 'Settings',
                        tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="gear" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="resource"
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="job"
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
            </Tabs>
        </AccessibilityProvider>
    );
}