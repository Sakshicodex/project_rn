import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';




const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    GoogleSignin.configure({
        webClientId: '644888739422-7h961dko8206o73r73c225d3kgcqbdgi.apps.googleusercontent.com',
    
        // You can add other configuration options as needed
      });

      const handleGoogleSignIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const response = await fetch('http://10.9.11.209:3000/googleLogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleIdToken: userInfo.idToken,
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to login:', errorData.message);
            Alert.alert('Error', errorData.message);
          } else {
            const data = await response.json();
            console.log('Login successful:', data);
            navigation.navigate('postlogin');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
        }
      };
  

    
    
    const handleSignIn = async () => {
        try {
            const response = await fetch('http://10.9.11.209:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                // Login successful, navigate to post-login screen
                navigation.navigate('postlogin');
            } else {
                // Login failed, display error message
                const errorData = await response.json();
                Alert.alert('Error', errorData.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('forgetpassword');
      };





    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Login to your{'\n'}<Text>account</Text>
                </Text>
                <Text style={styles.subtitle}>Please sign in to your account</Text>

                <View style={styles.inputField}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter Email"

                    />
                </View>


                <View style={styles.inputField}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Password"
                            secureTextEntry={!passwordVisible} // Toggle visibility
                        />
                        <TouchableOpacity
                            style={styles.visibilityToggle}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                            <Icon
                                name={passwordVisible ? 'eye-slash' : 'eye'} // Change icon based on visibility
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Or sign in with</Text>
                    <View style={styles.line} />
                </View>
                



                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                    <Image
                        source={require('../assets/google.png')} // Make sure the path is correct
                        style={styles.googleLogo} // Add your styles
                    />


                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                        <Text style={styles.footerActionText}>Register</Text>
                    </TouchableOpacity>
                </View>
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
    visibilityToggle: {
        position: 'absolute',
        right: 10, // Adjust the value as necessary to align the icon inside the input
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40, // Width of the touchable area for the icon
    },
    forgotPassword: {
        color: '#FFA500',
        marginBottom: 16,
        textAlign: 'right'
    },
    button: {
        backgroundColor: '#FFA500',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
    },
    googleButton: {
        backgroundColor: '#de5246', // Google's red color
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        // Add other styling for the button
    },
    googleButtonText: {
        color: '#000000', // White color for the text
        // Add other text styling
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 16,
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#666',
    },
    footerActionText: {
        marginLeft: 5,
        color: '#FFA500',
        fontWeight: 'bold',
    },
});


export default LoginScreen;
