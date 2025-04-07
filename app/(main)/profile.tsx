import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../firebaseConfig";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen() {
    const [fullName, setFullName] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [savedImage, setSavedImage] = useState('');
    const [showUpdateSection, setShowUpdateSection] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFullName(userData.fullName);
                    setSavedImage(userData.profilePicture);
                }
            }
        };

        fetchUserData();
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

    const handleSaveImage = async () => {
        const user = auth.currentUser;
        if (user && imageURL.trim() !== '') {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    profilePicture: imageURL.trim(),
                });
                setSavedImage(imageURL.trim());
                setImageURL('');
                Alert.alert('Success', 'Profile picture updated successfully!');
            }
            catch (error) {
                console.error("Error updating profile picture: ", error);
            }
        } else {
            Alert.alert('Error', 'Please enter a valid image URL.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="auto" />

            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => setShowUpdateSection(!showUpdateSection)}>

                    <Image
                        source={
                            savedImage
                                ? { uri: savedImage }
                                : require('../../assets/defaultProfile.png')
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.nameText}>{fullName}</Text>
            </View>

            {showUpdateSection && (
                <>
                    <TextInput
                        placeholder="Paste new image URL"
                        value={imageURL}
                        onChangeText={setImageURL}
                        style={styles.input}
                    />

                    <TouchableOpacity onPress={handleSaveImage} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Update Profile Picture</Text>
                    </TouchableOpacity>
                </>
            )}

            <View>
                <TouchableOpacity onPress={handleSignout}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    profileContainer: {

    },
    profileImage: {
        width: 100,
        height: 100,
    },
    nameText: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Inter"
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    saveButtonText: {
        color: "white",
        fontWeight: "bold",
    }
})