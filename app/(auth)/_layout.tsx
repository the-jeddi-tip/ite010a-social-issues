import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";

export default function AuthLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Login',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    headerShown: false,
                    title: 'Register',
                    tabBarIcon: ({ color }: { color : string }) => <FontAwesome size={28} name="clipboard" color={color} />,
                }}
            />
        </Tabs>
    );
}