import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../../firebaseConfig'

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Success', `Logged in ${user.email}`);
      })
      .catch((error) => {
        Alert.alert('Login failed', error.message)
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.appTitle}>ReachOut</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Welcome Back</Text>
        <Text style={styles.subHeaderText}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    color: '#2E2E2E',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2E2E',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E2E2E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  signupText: {
    fontSize: 14,
    color: '#757575',
  },
  signupLink: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});