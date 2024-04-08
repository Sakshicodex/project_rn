import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation}) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        if (email.trim() === '') {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }
    
        try {
            const response = await fetch('http://10.9.11.209:3000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }
    
            // Navigate to OTP input screen
            navigation.navigate('otp', { email }); // Make sure you have 'OtpScreen' in your navigation stack
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send password reset email');
        }
    };
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Forgot Password?
                </Text>
                <Text style={styles.subtitle}>Enter your email address and we'll send you confirmation code to reset your password</Text>

                <View style={styles.inputField}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter Email"

                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 30,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    inputField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        color: '#000000'
    },
    button: {
        backgroundColor: "#F2994A", // Use your own color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 35, // Set border radius here
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
    },
    buttonText: {
        color: "#FFFFFF", // Text color
        fontSize: 16, // Adjust your size
        fontWeight: "bold",
    },
});

export default ForgotPasswordScreen;
