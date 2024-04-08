import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image,TouchableOpacity ,Dimensions} from 'react-native';
import { BlurView } from '@react-native-community/blur'; 

const { height } = Dimensions.get('window');

const SuccessScreen = ({ navigation }) => {
    const handleLogin = async () => {
        navigation.navigate('login')
       
      };
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/reset.png')} // Replace with the path to your background image
                style={styles.backgroundImage}
            >
                {/* Apply the blur effect */}
                <BlurView
                    style={styles.absolute}
                    blurType="light" // You can choose: 'dark', 'light', 'xlight', etc.
                    blurAmount={10} // Adjust to achieve the desired blur
                />
            </ImageBackground>
            <View style={styles.card}>
                {/* Icon and success message */}
                <Image
                        source={require('../assets/success.png')} // Replace with the path to your success icon image
                        style={styles.icon}
                        resizeMode="contain"
                    />
                <Text style={styles.headerText}>Password Changed</Text>
                <Text style={styles.subHeaderText}>
                Password changed successfully, you can login again with a new password
                </Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogin}>
          <Text style={styles.logoutButtonText}>Go To Login</Text>
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
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
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

export default SuccessScreen;
