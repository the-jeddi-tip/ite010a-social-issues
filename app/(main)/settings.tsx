import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function SettingsScreen() {
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFullName(userData.fullName);
                }
            }
        };

        fetchUserName();
    }, []);

    const handleSignout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Success', `Signed out ${fullName}`);
            router.replace("/(auth)");
        }
        catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Settings</Text>
            <TouchableOpacity onPress={handleSignout}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
})