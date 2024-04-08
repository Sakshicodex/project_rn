import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    GoogleSignin.configure({
        webClientId: '644888739422-7h961dko8206o73r73c225d3kgcqbdgi.apps.googleusercontent.com',
    
        // You can add other configuration options as needed
      });
    // Add your sign up logic here
    const handleSignUp = async () => {

        console.log('Attempting to sign up');
        if (!email || !username || !password) {
            alert('Please fill all fields and agree to the terms.');
            return;
        }
        if (!termsAccepted) {
            alert('Please agree to the terms.');
            return;
        }

        try {

            const response = await fetch('http://10.9.11.209:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username, // Change 'username' to the actual name field
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
               

                console.log(data);
                alert('Signup successful');

            } else {
                const errorData = await response.text();
                console.error('Signup failed:', errorData);
                alert('Signup failed. Check console for details.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to sign up. See console for details.');
        }
    };

    const handleGoogleSignUp = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn(); // This will open the Google Sign-Up window
      
          // Check if the user exists in your database
          const response = await fetch('http://10.9.11.209:3000/checkGoogleUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleId: userInfo.user.id,
            }),
          });
      
          if (response.ok) {
            // User already exists, navigate to the login screen
            navigation.navigate('login');
          } else {
            // User doesn't exist, create a new user in your database
            const createResponse = await fetch('http://10.9.11.209:3000/createGoogleUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                googleId: userInfo.user.id,
                name: userInfo.user.name,
                email: userInfo.user.email,
              }),
            });
      
            if (createResponse.ok) {
              // User created successfully, navigate to the login screen
              navigation.navigate('login');
            } else {
              // Handle error creating user
              console.error('Failed to create user');
            }
          }
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // User canceled the sign-in flow
            console.log('User canceled the sign-in flow');
          } else {
            // Some other error occurred
            console.error(error);
          }
        }
      };
   


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Create your new{'\n'}<Text>account</Text>
                </Text>
                <Text style={styles.subtitle}>Create an account to start looking for the food u like</Text>

                <View style={styles.inputField}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter Email"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputField}>
                    <Text style={styles.label}>User Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Enter Username"
                        keyboardType="email-address"
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
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={termsAccepted}
                        onValueChange={setTermsAccepted}
                        style={termsAccepted ? styles.checkboxChecked : styles.checkboxUnchecked}
                        tintColors={{ true: '#FFA500', false: '#ddd' }} // Orange when checked, grey when unchecked
                    />
                    <Text style={styles.label}>
                        I Agree with <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                </View>


                <TouchableOpacity style={styles.button} onPress={ handleSignUp}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Or sign in with</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp} >
                    <Image
                        source={require('../assets/google.png')} // Make sure the path is correct
                        style={styles.googleLogo} // Add your styles
                    />


                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <Text style={styles.footerActionText}>Sign In</Text>
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
    },

    linkText: {
        color: '#FFA500',
        fontWeight: 'bold',
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 16,
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',

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

export default SignupScreen;
