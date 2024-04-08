import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image,TouchableOpacity ,Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const PostLoginScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
          // Retrieve the user's token from AsyncStorage
          const userToken = await AsyncStorage.getItem('userToken');
      
          if (!userToken) {
            // User token not found, navigate to the login screen
            navigation.navigate('login');
            return;
          }
      
          // Remove the token from storage
          await AsyncStorage.removeItem('userToken');
      
          // Make a request to your server to log out the user
          const response = await fetch('http://10.9.11.209:3000/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`, // Include the user token for authentication
            },
          });
      
          if (response.ok) {
            // Logout successful, navigate to the login screen
            navigation.navigate('login');
          } else {
            // Handle logout error
            const errorData = await response.json();
            console.error('Logout failed:', errorData.message);
            Alert.alert('Logout Failed', errorData.message);
          }
        } catch (error) {
          // Error removing token or logging out, handle the error
          console.error('Logout Failed:', error);
          Alert.alert('Logout Failed', 'Please try again.');
        }
      };
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/o4.png')} // Replace with the path to your background image
                style={styles.backgroundImage}
              
               
            />

            <View style={styles.card}>
                {/* Icon and success message */}
                <Image
                        source={require('../assets/success.png')} // Replace with the path to your success icon image
                        style={styles.icon}
                        resizeMode="contain"
                    />
                <Text style={styles.headerText}>Login Successful</Text>
                <Text style={styles.subHeaderText}>
                    An event has been created and the invite has been sent to you on mail.
                </Text>
                <TouchableOpacity 
                        onPress={handleLogout}
                        style={styles.logoutButton}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        
        
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute', // Position the card over the background
        top: height / 2.5, // Start from half the height of the screen
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingTop: 20, // Add some padding at the top inside the card
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        // Add styles for your icon container if necessary
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginTop: 100,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
        marginTop: 16,
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: '#FFA500', // Orange color for the button
        paddingVertical: 10,
        paddingHorizontal: 100,
        borderRadius: 20,
    },
    logoutText: {
        color: '#FFFFFF', // White color for the text
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PostLoginScreen;
