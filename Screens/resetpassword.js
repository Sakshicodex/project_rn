import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert , SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you have this library installed
import { useNavigation } from '@react-navigation/native';


const ResetPasswordScreen = ({ route}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { token } = route.params || {};

    if (!token) {
        // Token is missing, handle the error or navigate back
        console.log('Token is missing');
        return;
      }
      

    const handleResetPassword = async () => {
        // Perform password validation
        if (newPassword.length < 8) {
          alert('Password must be at least 8 characters long');
          return;
        }
    
        if (newPassword !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
    
        try {
          // Send the new password and token to your backend for updating
          const response = await fetch('http://10.9.11.209:3000/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            // Password reset successful
            console.log('Password reset successful');
            navigation.navigate('success')
            // Navigate to the login screen or perform the desired action
          } else {
            // Password reset failed
            console.log('Password reset failed:', data.error);
            // Display an error message to the user
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred. Please try again later.');
        }
      };

    

    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
           
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Your new password must be different from the previously used password
            </Text>

            <View style={styles.inputField}>
            <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setNewPassword}
                    value={newPassword}
                    placeholder="New Password"
                    secureTextEntry={true}
                />
                
            </View>

            <View style={styles.inputField}>
            <Text style={styles.label}>Confirm Password</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                />
               
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleResetPassword}  >
                <Text style={styles.verifyButtonText}>Verify Account</Text>
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
        paddingTop: 50,
        backgroundColor: '#fff',
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
    passwordRequirement: {
        fontSize: 14,
        color: '#666',
    },
    verifyButton: {
        backgroundColor: '#FFA500', // Use your app's theme color
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 150,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ResetPasswordScreen;
