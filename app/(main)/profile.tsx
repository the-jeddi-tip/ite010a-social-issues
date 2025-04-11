import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../firebaseConfig";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "@/components/topBar";

export default function ProfileScreen() {
    // Basic user info
    const [fullName, setFullName] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [savedImage, setSavedImage] = useState('');
    const [showUpdateSection, setShowUpdateSection] = useState(false);

    // New fields for enhanced profile
    const [profession, setProfession] = useState('');
    const [experience, setExperience] = useState('');

    // Stats
    const [developedCount, setDevelopedCount] = useState('');
    const [coDevelopedCount, setCoDevelopedCount] = useState('');
    const [trainingCount, setTrainingCount] = useState('');

    // Education
    const [school, setSchool] = useState('');
    const [yearStart, setYearStart] = useState('');
    const [yearEnd, setYearEnd] = useState('');

    // About/Accessibility
    const [assistiveTech, setAssistiveTech] = useState('');
    const [uiPreferences, setUiPreferences] = useState('');

    // Social
    const [connections, setConnections] = useState('');
    const [inCommon, setInCommon] = useState('');

    // Loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                const user = auth.currentUser;
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setFullName(userData.fullName || '');
                        setSavedImage(userData.profilePicture || '');
                        setProfession(userData.profession || '');
                        setExperience(userData.experience || '');
                        setDevelopedCount(userData.developedCount || '');
                        setCoDevelopedCount(userData.coDevelopedCount || '');
                        setTrainingCount(userData.trainingCount || '');
                        setSchool(userData.school || '');
                        setYearStart(userData.yearStart || '');
                        setYearEnd(userData.yearEnd || '');
                        setAssistiveTech(userData.assistiveTech || '');
                        setUiPreferences(userData.uiPreferences || '');
                        setConnections(userData.connections || '');
                        setInCommon(userData.inCommon || '');
                    }
                }
            }
            catch (error) {
                console.error("Error fetching user data: ", error);
            }
            finally {
                setLoading(false)
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

    const handleNotificationPress = () => {
        // Handle notification press
        Alert.alert('Notifications', 'No new notifications at the moment.');
    };

    const handleProfilePress = () => {
        // Navigate to profile screen
        router.push('/profile');
    };

    const handleSaveProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    fullName,
                    profession,
                    experience,
                    developedCount,
                    coDevelopedCount,
                    trainingCount,
                    school,
                    yearStart,
                    yearEnd,
                    assistiveTech,
                    uiPreferences,
                    connections,
                    inCommon
                });
                Alert.alert('Success', 'Profile updated successfully!');
            }
            catch (error) {
                console.error("Error updating profile: ", error);
                Alert.alert('Error', 'Failed to update profile.');
            }
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centeredContainer}>
                <ActivityIndicator size='large' color='#4C956C' />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <TopBar
                    title="Profile"
                    onNotificationPress={handleNotificationPress}
                    onProfilePress={handleProfilePress}
                    profilePicture={savedImage}
                />

                <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                        <View style={styles.updateSection}>
                            <TextInput
                                placeholder="Paste new image URL"
                                value={imageURL}
                                onChangeText={setImageURL}
                                style={styles.input}
                            />

                            <TouchableOpacity onPress={handleSaveImage} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Update Profile Picture</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Basic Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Profession</Text>
                            <TextInput
                                style={styles.input}
                                value={profession}
                                onChangeText={setProfession}
                                placeholder="e.g., Game Developer"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Experience</Text>
                            <TextInput
                                style={styles.input}
                                value={experience}
                                onChangeText={setExperience}
                                placeholder="e.g., 5 Years 7 Months"
                            />
                        </View>
                    </View>

                    {/* Social Connections */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Social Connections</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number of Connections</Text>
                            <TextInput
                                style={styles.input}
                                value={connections}
                                onChangeText={setConnections}
                                placeholder="e.g., 100+"
                                keyboardType="default"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>In Common</Text>
                            <TextInput
                                style={styles.input}
                                value={inCommon}
                                onChangeText={setInCommon}
                                placeholder="e.g., 10"
                                keyboardType="default"
                            />
                        </View>
                    </View>

                    {/* Professional Stats */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Stats</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statInput}>
                                <Text style={styles.label}>Developed</Text>
                                <TextInput
                                    style={styles.input}
                                    value={developedCount}
                                    onChangeText={setDevelopedCount}
                                    placeholder="e.g., 15"
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={styles.statInput}>
                                <Text style={styles.label}>Co-Developed</Text>
                                <TextInput
                                    style={styles.input}
                                    value={coDevelopedCount}
                                    onChangeText={setCoDevelopedCount}
                                    placeholder="e.g., 30+"
                                    keyboardType="default"
                                />
                            </View>

                            <View style={styles.statInput}>
                                <Text style={styles.label}>Training</Text>
                                <TextInput
                                    style={styles.input}
                                    value={trainingCount}
                                    onChangeText={setTrainingCount}
                                    placeholder="e.g., 100+"
                                    keyboardType="default"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Education */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>School/Institution</Text>
                            <TextInput
                                style={styles.input}
                                value={school}
                                onChangeText={setSchool}
                                placeholder="e.g., Technological Institute of the Philippines"
                            />
                        </View>

                        <View style={styles.yearContainer}>
                            <View style={styles.yearInput}>
                                <Text style={styles.label}>Start Year</Text>
                                <TextInput
                                    style={styles.input}
                                    value={yearStart}
                                    onChangeText={setYearStart}
                                    placeholder="YYYY"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                            </View>

                            <View style={styles.yearInput}>
                                <Text style={styles.label}>End Year</Text>
                                <TextInput
                                    style={styles.input}
                                    value={yearEnd}
                                    onChangeText={setYearEnd}
                                    placeholder="YYYY"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Accessibility Needs */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Accessibility Needs</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Preferred Assistive Technology</Text>
                            <TextInput
                                style={styles.input}
                                value={assistiveTech}
                                onChangeText={setAssistiveTech}
                                placeholder="e.g., Screen Reader"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>UI Preferences</Text>
                            <TextInput
                                style={styles.input}
                                value={uiPreferences}
                                onChangeText={setUiPreferences}
                                placeholder="e.g., High Contrast Mode, Text-to-Speech Enabled"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    </TouchableOpacity>

                    {/* Sign Out Button */}
                    <TouchableOpacity onPress={handleSignout} style={styles.signOutButton}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    {/* Bottom space */}
                    <View style={styles.bottomSpace}></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8F4EA",
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    nameText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#2D6A4F",
    },
    updateSection: {
        width: "100%",
        marginBottom: 20,
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
        color: "#2D6A4F",
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#666",
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statInput: {
        flex: 1,
        marginHorizontal: 3,
    },
    yearContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    yearInput: {
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        backgroundColor: "#4C956C",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10,
    },
    saveButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    signOutButton: {
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FF3B30",
    },
    signOutText: {
        color: "#FF3B30",
        fontWeight: "600",
    },
    bottomSpace: {
        height: 30,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F4EA',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#2D6A4F',
    },
});