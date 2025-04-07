import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="resource"
                options={{
                    headerShown: false,
                    title: 'Resource Hub',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    headerShown: false,
                    title: 'Jobs',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: 'Settings',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
        </Tabs>
    );
}